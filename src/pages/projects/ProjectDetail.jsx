import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCalendar, FiEdit2, FiPlus, FiUserPlus, FiUsers } from 'react-icons/fi'
import api from '../../api/axios'
import Loader from '../../components/common/Loader'
import TaskCard from '../../components/tasks/TaskCard'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, getErrorMessage, getProjectStatusColor } from '../../utils/helpers'

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload
const listOf = (payload) => {
  const value = unwrap(payload)
  return Array.isArray(value) ? value : value?.tasks || value?.content || value?.items || []
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [memberToAdd, setMemberToAdd] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingMember, setAddingMember] = useState(false)

  const loadProject = useCallback(async () => {
    const [projectRes, tasksRes] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/projects/${id}/tasks`),
    ])
    setProject(unwrap(projectRes))
    setTasks(listOf(tasksRes))
  }, [id])

  useEffect(() => {
    async function load() {
      try {
        const requests = [loadProject()]
        if (user?.role === 'ADMIN') requests.push(api.get('/users').then((res) => setUsers(listOf(res))))
        await Promise.all(requests)
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [loadProject, user?.role])

  async function handleAddMember(e) {
    e.preventDefault()
    if (!memberToAdd) {
      toast.error('Select a member first')
      return
    }

    setAddingMember(true)
    try {
      await api.post(`/projects/${id}/members/${memberToAdd}`)
      toast.success('Member added to project')
      setMemberToAdd('')
      await loadProject()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setAddingMember(false)
    }
  }

  if (loading) return <Loader />
  if (!project) return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Project not found.</div>

  const members = project.members || project.teamMembers || []
  const memberIds = new Set(members.map((member) => Number(member.id)))
  const availableMembers = users.filter((candidate) => {
    const isMember = !candidate.role || candidate.role === 'MEMBER'
    return isMember && !memberIds.has(Number(candidate.id))
  })

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getProjectStatusColor(project.status)}`}>{project.status || 'ACTIVE'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{project.name}</h2>
            {project.description && <p className="mt-2 max-w-3xl text-sm text-slate-500">{project.description}</p>}
          </div>
          {user?.role === 'ADMIN' && (
            <div className="flex gap-2">
              <Link to={`/projects/${id}/edit`} className="btn-secondary inline-flex items-center gap-2 text-sm">
                <FiEdit2 className="h-4 w-4" />
                Edit
              </Link>
              <Link to={`/projects/${id}/tasks/new`} className="btn-primary inline-flex items-center gap-2 text-sm">
                <FiPlus className="h-4 w-4" />
                Add task
              </Link>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-slate-400" />
            <span>{formatDate(project.startDate)} - {formatDate(project.deadline)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="h-4 w-4 text-slate-400" />
            <span>{members.length || project.memberCount || 0} members</span>
          </div>
        </div>
      </section>

      {user?.role === 'ADMIN' && (
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800">Project members</h3>
              <p className="text-sm text-slate-500">Members added here can be assigned tasks in this project.</p>
            </div>
          </div>

          <form onSubmit={handleAddMember} className="flex flex-col gap-3 sm:flex-row">
            <select value={memberToAdd} onChange={(e) => setMemberToAdd(e.target.value)} className="input-field sm:max-w-sm">
              <option value="">Select member</option>
              {availableMembers.map((member) => (
                <option key={member.id} value={member.id}>{member.name || member.email}</option>
              ))}
            </select>
            <button disabled={addingMember || !availableMembers.length} className="btn-primary inline-flex items-center justify-center gap-2 text-sm">
              <FiUserPlus className="h-4 w-4" />
              {addingMember ? 'Adding...' : 'Add member'}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {members.map((member) => (
              <span key={member.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {member.name || member.email}
              </span>
            ))}
            {!members.length && <span className="text-sm text-slate-500">No members added yet.</span>}
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 font-semibold text-slate-800">Tasks</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {tasks.map((task) => <TaskCard key={task.id} task={task} canEdit={user?.role === 'ADMIN'} />)}
        </div>
        {!tasks.length && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No tasks in this project yet.</div>}
      </section>
    </div>
  )
}
