import api from './axios'
import { unwrapApiList, unwrapApiResponse } from './apiResponse'

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED']

function statusParams(status) {
  return status && status !== 'ALL' ? { status } : undefined
}

export async function createProjectTask(projectId, taskRequest) {
  return unwrapApiResponse(await api.post(`/projects/${projectId}/tasks`, taskRequest))
}

export async function getProjectTasks(projectId, status) {
  return unwrapApiList(await api.get(`/projects/${projectId}/tasks`, { params: statusParams(status) }))
}

export async function getMyTasks(status) {
  return unwrapApiList(await api.get('/tasks/my', { params: statusParams(status) }))
}

export async function getTask(id) {
  return unwrapApiResponse(await api.get(`/tasks/${id}`))
}

export async function updateTask(id, taskRequest) {
  return unwrapApiResponse(await api.put(`/tasks/${id}`, taskRequest))
}

export async function updateTaskStatus(id, status) {
  return unwrapApiResponse(await api.patch(`/tasks/${id}/status`, { status }))
}

export async function deleteTask(id) {
  return unwrapApiResponse(await api.delete(`/tasks/${id}`))
}
