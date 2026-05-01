import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiSearch } from 'react-icons/fi'
import { getMyTasks, updateTaskStatus } from '../../api/tasks'
import Loader from '../../components/common/Loader'
import TaskCard from '../../components/tasks/TaskCard'
import { getErrorMessage } from '../../utils/helpers'

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')

  useEffect(() => {
    setLoading(true)
    getMyTasks(status)
      .then(setTasks)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [status])

  async function handleStatusChange(task, nextStatus) {
    try {
      const updated = await updateTaskStatus(task.id, nextStatus)
      setTasks((current) => current.map((item) => item.id === task.id ? { ...item, ...updated } : item))
      toast.success('Task status updated')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (loading) return <Loader />

  const filtered = tasks.filter((task) => {
    const matchesQuery = `${task.title || ''} ${task.description || ''}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'ALL' || task.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">My tasks</h2>
        <p className="text-sm text-slate-500">Filter your assignments and update progress.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" placeholder="Search tasks" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field sm:w-44">
          <option value="ALL">All statuses</option>
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((task) => <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />)}
      </div>
      {!filtered.length && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No tasks found.</div>}
    </div>
  )
}
