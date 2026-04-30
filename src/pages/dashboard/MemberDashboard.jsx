import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiClock, FiList, FiAlertCircle } from 'react-icons/fi'
import api from '../../api/axios'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import TaskCard from '../../components/tasks/TaskCard'
import { getErrorMessage, isOverdue } from '../../utils/helpers'

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload
const listOf = (payload) => {
  const value = unwrap(payload)
  return Array.isArray(value) ? value : value?.content || value?.items || []
}

export default function MemberDashboard() {
  const [stats, setStats] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/dashboard/member'),
          api.get('/tasks/my'),
        ])
        setStats(unwrap(statsRes))
        setTasks(listOf(tasksRes))
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  async function handleStatusChange(task, status) {
    try {
      const { data } = await api.patch(`/tasks/${task.id}/status`, { status })
      const updated = data?.data || data || { ...task, status }
      setTasks((current) => current.map((item) => item.id === task.id ? { ...item, ...updated, status } : item))
      toast.success('Task updated')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  if (loading) return <Loader />

  const pending = stats?.myPendingTasks ?? tasks.filter((task) => task.status !== 'COMPLETED').length
  const completed = stats?.myCompletedTasks ?? tasks.filter((task) => task.status === 'COMPLETED').length
  const overdue = stats?.myOverdueTasks ?? tasks.filter((task) => isOverdue(task.dueDate, task.status)).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">My work</h2>
        <p className="text-sm text-slate-500">Update progress and keep your assigned tasks current.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Assigned" value={stats?.myAssignedTasks ?? tasks.length} icon={FiList} color="slate" />
        <StatCard title="Pending" value={pending} icon={FiClock} color="blue" />
        <StatCard title="Completed" value={completed} icon={FiCheckCircle} color="green" />
        <StatCard title="Overdue" value={overdue} icon={FiAlertCircle} color="red" />
      </div>

      <section>
        <h3 className="mb-3 font-semibold text-slate-800">Assigned tasks</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {tasks.slice(0, 6).map((task) => <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />)}
          {!tasks.length && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No tasks assigned yet.</div>}
        </div>
      </section>
    </div>
  )
}
