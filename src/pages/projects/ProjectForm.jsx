import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createProject, getProject, PROJECT_STATUSES, updateProject } from '../../api/projects'
import Loader from '../../components/common/Loader'
import { getErrorMessage } from '../../utils/helpers'

export default function ProjectForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    startDate: '',
    deadline: '',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    getProject(id)
      .then((project) => {
        setForm({
          name: project.name || '',
          description: project.description || '',
          status: project.status || 'ACTIVE',
          startDate: toInputDate(project.startDate),
          deadline: toInputDate(project.deadline),
        })
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  function handleChange(e) {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Project name is required')
      return
    }
    if (form.name.trim().length > 200) {
      toast.error('Project name must be 200 characters or less')
      return
    }
    if (form.description.length > 2000) {
      toast.error('Description must be 2000 characters or less')
      return
    }
    if (!PROJECT_STATUSES.includes(form.status)) {
      toast.error('Select a valid project status')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        description: form.description.trim() || null,
        startDate: form.startDate || null,
        deadline: form.deadline || null,
      }
      const saved = isEdit ? await updateProject(id, payload) : await createProject(payload)
      toast.success(isEdit ? 'Project updated' : 'Project created')
      navigate(`/projects/${saved.id || id}`)
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
          <h2 className="text-xl font-semibold text-slate-800">{isEdit ? 'Edit project' : 'New project'}</h2>
          <p className="text-sm text-slate-500">Set project details and status.</p>
        </div>

        <div>
          <label className="label">Project name</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Website redesign" maxLength={200} required />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-28" placeholder="What is this project about?" maxLength={2000} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div>
            <label className="label">Start date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary text-sm">Cancel</button>
          <button disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save project'}</button>
        </div>
      </form>
    </div>
  )
}

function toInputDate(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}
