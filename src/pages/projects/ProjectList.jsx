import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiPlus, FiSearch } from 'react-icons/fi'
import api from '../../api/axios'
import ProjectCard from '../../components/projects/ProjectCard'
import Loader from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/helpers'

const listOf = (payload) => {
  const value = payload?.data?.data ?? payload?.data ?? payload
  return Array.isArray(value) ? value : value?.content || value?.items || []
}

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const { user } = useAuth()

  useEffect(() => {
    api.get('/projects')
      .then((res) => setProjects(listOf(res)))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const filtered = projects.filter((project) => {
    const matchesQuery = `${project.name || ''} ${project.description || ''}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'ALL' || project.status === status
    return matchesQuery && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
          <p className="text-sm text-slate-500">Browse team projects and open task boards.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link to="/projects/new" className="btn-primary inline-flex items-center gap-2 text-sm">
            <FiPlus className="h-4 w-4" />
            New project
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" placeholder="Search projects" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field sm:w-44">
          <option value="ALL">All statuses</option>
          <option value="PLANNED">Planned</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => <ProjectCard key={project.id} project={project} canEdit={user?.role === 'ADMIN'} />)}
      </div>
      {!filtered.length && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No projects found.</div>}
    </div>
  )
}
