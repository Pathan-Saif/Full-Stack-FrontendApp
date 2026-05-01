import api from './axios'
import { unwrapApiList, unwrapApiResponse } from './apiResponse'

export const PROJECT_STATUSES = ['PLANNED', 'ACTIVE', 'COMPLETED']

export async function getProjects() {
  return unwrapApiList(await api.get('/projects'))
}

export async function getProject(id) {
  return unwrapApiResponse(await api.get(`/projects/${id}`))
}

export async function createProject(projectRequest) {
  return unwrapApiResponse(await api.post('/projects', projectRequest))
}

export async function updateProject(id, projectRequest) {
  return unwrapApiResponse(await api.put(`/projects/${id}`, projectRequest))
}

export async function deleteProject(id) {
  return unwrapApiResponse(await api.delete(`/projects/${id}`))
}

export async function addProjectMember(projectId, userId) {
  return unwrapApiResponse(await api.post(`/projects/${projectId}/members/${userId}`))
}

export async function removeProjectMember(projectId, userId) {
  return unwrapApiResponse(await api.delete(`/projects/${projectId}/members/${userId}`))
}
