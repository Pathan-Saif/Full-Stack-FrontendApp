import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import Loader from '../../components/common/Loader'
import { getErrorMessage } from '../../utils/helpers'

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload

export default function TaskForm() {
  const { projectId, taskId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(taskId)
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    assignedToId: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        let task = null
        let currentProjectId = projectId

        if (isEdit) {
          const taskRes = await api.get(`/tasks/${taskId}`)
          task = unwrap(taskRes)
          currentProjectId = task.projectId
        }

        if (currentProjectId) {
          const projectRes = await api.get(`/projects/${currentProjectId}`)
          const project = unwrap(projectRes)
          setMembers((project.members || []).filter((user) => !user.role || user.role === 'MEMBER'))
        }

        if (task) {
          const assigned = task.assignedTo || task.assignee || task.user || {}
          setForm({
            title: task.title || '',
            description: task.description || '',
            status: task.status || 'TODO',
            priority: task.priority || 'MEDIUM',
            dueDate: toInputDate(task.dueDate),
            assignedToId: String(task.assignedToId || assigned.id || ''),
          })
        }
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isEdit, projectId, taskId])

  function handleChange(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Task title is required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim() || null,
        dueDate: form.dueDate || null,
        assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
      }
      const res = isEdit ? await api.put(`/tasks/${taskId}`, payload) : await api.post(`/projects/${projectId}/tasks`, payload)
      const saved = unwrap(res)
      toast.success(isEdit ? 'Task updated' : 'Task created')
      navigate(projectId ? `/projects/${projectId}` : `/projects/${saved.projectId || saved.project?.id || ''}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{isEdit ? 'Edit task' : 'New task'}</h2>
          <p className="text-sm text-slate-500">Create assignments with priority, status and due date.</p>
        </div>

        <div>
          <label className="label">Task title</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Prepare sprint plan" />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-28" placeholder="Task details" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Assignee</label>
            <select name="assignedToId" value={form.assignedToId} onChange={handleChange} className="input-field">
              <option value="">Unassigned</option>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name || member.email}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Due date</label>
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary text-sm">Cancel</button>
          <button disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save task'}</button>
        </div>
      </form>
    </div>
  )
}

function toInputDate(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}
