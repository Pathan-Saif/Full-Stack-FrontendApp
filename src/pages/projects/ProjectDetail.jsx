import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCalendar, FiEdit2, FiPlus, FiTrash2, FiUserMinus, FiUserPlus, FiUsers } from 'react-icons/fi'
import { addProjectMember, deleteProject, getProject, removeProjectMember } from '../../api/projects'
import { deleteTask, getProjectTasks } from '../../api/tasks'
import { getUsers } from '../../api/users'
import Loader from '../../components/common/Loader'
import ConfirmModal from '../../components/common/ConfirmModal'
import TaskCard from '../../components/tasks/TaskCard'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, getErrorMessage, getProjectStatusColor } from '../../utils/helpers'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [memberToAdd, setMemberToAdd] = useState('')
  const [taskStatus, setTaskStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [addingMember, setAddingMember] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [removingMember, setRemovingMember] = useState(false)
  const [deletingTask, setDeletingTask] = useState(false)
  const [deletingProject, setDeletingProject] = useState(false)
  const [showDeleteProject, setShowDeleteProject] = useState(false)

  const loadProject = useCallback(async () => {
    const [projectRes, tasksRes] = await Promise.all([
      getProject(id),
      getProjectTasks(id, taskStatus),
    ])
    setProject(projectRes)
    setTasks(tasksRes)
  }, [id, taskStatus])

  useEffect(() => {
    async function load() {
      try {
        const requests = [loadProject()]
        if (user?.role === 'ADMIN') requests.push(getUsers().then(setUsers))
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
      await addProjectMember(id, memberToAdd)
      toast.success('Member added to project')
      setMemberToAdd('')
      await loadProject()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setAddingMember(false)
    }
  }

  async function handleRemoveMember() {
    if (!memberToRemove) return

    setRemovingMember(true)
    try {
      const updated = await removeProjectMember(id, memberToRemove.id)
      setProject(updated)
      setMemberToRemove(null)
      toast.success('Member removed from project')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setRemovingMember(false)
    }
  }

  async function handleDeleteProject() {
    setDeletingProject(true)
    try {
      await deleteProject(id)
      toast.success('Project deleted')
      navigate('/projects')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingProject(false)
    }
  }

  async function handleDeleteTask() {
    if (!taskToDelete) return

    setDeletingTask(true)
    try {
      await deleteTask(taskToDelete.id)
      setTasks((current) => current.filter((task) => task.id !== taskToDelete.id))
      setTaskToDelete(null)
      toast.success('Task deleted')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeletingTask(false)
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
              <button type="button" onClick={() => setShowDeleteProject(true)} className="btn-danger inline-flex items-center gap-2 text-sm">
                <FiTrash2 className="h-4 w-4" />
                Delete
              </button>
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
              <span key={member.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {member.name || member.email}
                <button type="button" onClick={() => setMemberToRemove(member)} className="text-slate-400 hover:text-red-600" title="Remove member">
                  <FiUserMinus className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {!members.length && <span className="text-sm text-slate-500">No members added yet.</span>}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-800">Tasks</h3>
          <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="input-field sm:w-44">
            <option value="ALL">All statuses</option>
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              canEdit={user?.role === 'ADMIN'}
              onDelete={user?.role === 'ADMIN' ? setTaskToDelete : undefined}
            />
          ))}
        </div>
        {!tasks.length && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No tasks in this project yet.</div>}
      </section>

      <ConfirmModal
        isOpen={Boolean(memberToRemove)}
        title="Remove member"
        message={`Remove ${memberToRemove?.name || memberToRemove?.email || 'this member'} from this project?`}
        loading={removingMember}
        confirmLabel="Remove"
        loadingLabel="Removing..."
        onCancel={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
      />
      <ConfirmModal
        isOpen={showDeleteProject}
        title="Delete project"
        message={`Delete ${project.name}? This cannot be undone.`}
        loading={deletingProject}
        onCancel={() => setShowDeleteProject(false)}
        onConfirm={handleDeleteProject}
      />
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete task"
        message={`Delete ${taskToDelete?.title || 'this task'}? This cannot be undone.`}
        loading={deletingTask}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />
    </div>
  )
}
