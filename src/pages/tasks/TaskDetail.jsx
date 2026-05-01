import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiCalendar, FiEdit2, FiFolder, FiTrash2, FiUser } from 'react-icons/fi'
import { deleteTask, getTask, TASK_STATUSES, updateTaskStatus } from '../../api/tasks'
import ConfirmModal from '../../components/common/ConfirmModal'
import Loader from '../../components/common/Loader'
import TaskStatusBadge from '../../components/tasks/TaskStatusBadge'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, formatDateTime, getErrorMessage, getPriorityColor, isOverdue } from '../../utils/helpers'

export default function TaskDetail() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getTask(taskId)
      .then(setTask)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [taskId])

  async function handleStatusChange(e) {
    const nextStatus = e.target.value
    setUpdatingStatus(true)
    try {
      const updated = await updateTaskStatus(task.id, nextStatus)
      setTask((current) => ({ ...current, ...updated }))
      toast.success('Task status updated')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTask(task.id)
      toast.success('Task deleted')
      navigate(task.projectId ? `/projects/${task.projectId}` : '/tasks/my')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader />
  if (!task) return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">Task not found.</div>

  const isAdmin = user?.role === 'ADMIN'
  const assignedTo = task.assignedTo

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate(-1)} className="btn-secondary inline-flex items-center gap-2 text-sm">
        <FiArrowLeft className="h-4 w-4" />
        Back
      </button>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <TaskStatusBadge status={task.status} />
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {(task.overdue || isOverdue(task.dueDate, task.status)) && (
                <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Overdue</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{task.title}</h2>
            {task.description && <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm text-slate-600">{task.description}</p>}
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <Link to={`/tasks/${task.id}/edit`} className="btn-secondary inline-flex items-center gap-2 text-sm">
                <FiEdit2 className="h-4 w-4" />
                Edit
              </Link>
              <button type="button" onClick={() => setShowDelete(true)} className="btn-danger inline-flex items-center gap-2 text-sm">
                <FiTrash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <FiFolder className="h-4 w-4 text-slate-400" />
            <Link to={`/projects/${task.projectId}`} className="font-medium text-indigo-600 hover:underline">{task.projectName || `Project ${task.projectId}`}</Link>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="h-4 w-4 text-slate-400" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUser className="h-4 w-4 text-slate-400" />
            <span>{assignedTo?.name || assignedTo?.email || 'Unassigned'}</span>
          </div>
          <div>
            <span className="text-slate-400">Updated </span>
            <span>{formatDateTime(task.updatedAt)}</span>
          </div>
        </div>

        <div className="mt-6 max-w-xs">
          <label className="label">Status</label>
          <select value={task.status} onChange={handleStatusChange} disabled={updatingStatus} className="input-field">
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>{status === 'IN_PROGRESS' ? 'In progress' : status === 'TODO' ? 'To do' : 'Completed'}</option>
            ))}
          </select>
        </div>
      </section>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete task"
        message={`Delete ${task.title}? This cannot be undone.`}
        loading={deleting}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
