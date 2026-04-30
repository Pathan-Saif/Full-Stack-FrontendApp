import { Link } from 'react-router-dom'
import { FiCalendar, FiEdit2, FiUser } from 'react-icons/fi'
import TaskStatusBadge from './TaskStatusBadge'
import { formatDate, getPriorityColor, isOverdue } from '../../utils/helpers'

export default function TaskCard({ task, canEdit = false, onStatusChange }) {
  const assignedTo = task.assignedTo || task.assignee || task.user

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800">{task.title}</h3>
          {task.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>}
        </div>
        {canEdit && (
          <Link to={`/tasks/${task.id}/edit`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" title="Edit task">
            <FiEdit2 className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TaskStatusBadge status={task.status} />
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority || 'MEDIUM'}
        </span>
        {isOverdue(task.dueDate, task.status) && (
          <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Overdue</span>
        )}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <FiCalendar className="h-4 w-4" />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiUser className="h-4 w-4" />
          <span className="truncate">{assignedTo?.name || task.assignedToName || 'Unassigned'}</span>
        </div>
      </div>

      {onStatusChange && (
        <select
          value={task.status || 'TODO'}
          onChange={(e) => onStatusChange(task, e.target.value)}
          className="input-field mt-4"
        >
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      )}
    </div>
  )
}
