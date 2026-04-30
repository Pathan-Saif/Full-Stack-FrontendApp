import { Link } from 'react-router-dom'
import { FiCalendar, FiEdit2, FiEye, FiUsers } from 'react-icons/fi'
import { formatDate, getProjectStatusColor } from '../../utils/helpers'

export default function ProjectCard({ project, canEdit = false }) {
  const members = project.members || project.teamMembers || []

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-800">{project.name}</h3>
          {project.description && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{project.description}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getProjectStatusColor(project.status)}`}>
          {project.status || 'ACTIVE'}
        </span>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <FiCalendar className="h-4 w-4" />
          <span>{formatDate(project.startDate)} - {formatDate(project.deadline)}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiUsers className="h-4 w-4" />
          <span>{members.length || project.memberCount || 0} members</span>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Link to={`/projects/${project.id}`} className="btn-secondary inline-flex flex-1 items-center justify-center gap-2 text-sm">
          <FiEye className="h-4 w-4" />
          View
        </Link>
        {canEdit && (
          <Link to={`/projects/${project.id}/edit`} className="btn-secondary inline-flex items-center justify-center gap-2 text-sm" title="Edit project">
            <FiEdit2 className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
