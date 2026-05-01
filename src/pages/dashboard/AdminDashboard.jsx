import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiAlertCircle, FiCheckCircle, FiClock, FiFolder, FiPlus } from 'react-icons/fi'
import api from '../../api/axios'
import { getProjects } from '../../api/projects'
import { unwrapApiResponse } from '../../api/apiResponse'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import ProjectCard from '../../components/projects/ProjectCard'
import { getErrorMessage } from '../../utils/helpers'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.get('/dashboard/admin'),
          getProjects(),
        ])
        setStats(unwrapApiResponse(statsRes))
        setProjects(projectsRes)
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) return <Loader />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Team overview</h2>
          <p className="text-sm text-slate-500">Track project health and current task load.</p>
        </div>
        <Link to="/projects/new" className="btn-primary inline-flex items-center gap-2 text-sm">
          <FiPlus className="h-4 w-4" />
          New project
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Projects" value={stats?.totalProjects ?? projects.length} icon={FiFolder} color="indigo" />
        <StatCard title="Active" value={stats?.activeProjects ?? 0} icon={FiClock} color="blue" />
        <StatCard title="Pending tasks" value={stats?.pendingTasks ?? 0} icon={FiAlertCircle} color="amber" />
        <StatCard title="Completed tasks" value={stats?.completedTasks ?? 0} icon={FiCheckCircle} color="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent projects</h3>
            <Link to="/projects" className="text-sm font-medium text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="grid gap-4">
            {projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} canEdit />)}
            {!projects.length && <EmptyState text="No projects yet." />}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-800">Project status</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <StatusRow label="Planned" value={stats?.plannedProjects ?? 0} />
            <StatusRow label="Active" value={stats?.activeProjects ?? 0} />
            <StatusRow label="Completed" value={stats?.completedProjects ?? 0} />
            <StatusRow label="Overdue tasks" value={stats?.overdueTasks ?? 0} />
          </div>
        </section>
      </div>
    </div>
  )
}

function EmptyState({ text }) {
  return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{text}</div>
}

function StatusRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
      <span>{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  )
}
