import { getStatusColor } from '../../utils/helpers'

export default function TaskStatusBadge({ status }) {
  const labels = {
    TODO: 'To do',
    IN_PROGRESS: 'In progress',
    COMPLETED: 'Completed',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(status)}`}>
      {labels[status] || status || 'Unknown'}
    </span>
  )
}
