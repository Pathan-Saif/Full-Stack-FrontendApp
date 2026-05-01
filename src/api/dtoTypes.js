/**
 * @typedef {'ADMIN' | 'MEMBER'} UserRole
 * @typedef {'PLANNED' | 'ACTIVE' | 'COMPLETED'} ProjectStatus
 * @typedef {'LOW' | 'MEDIUM' | 'HIGH'} TaskPriority
 * @typedef {'TODO' | 'IN_PROGRESS' | 'COMPLETED'} TaskStatus
 *
 * @typedef {{ success: boolean, message: string, data?: T, timestamp?: string }} ApiResponse<T>
 * @template T
 *
 * @typedef {{ id: number, name: string, email: string, role: UserRole, createdAt: string }} UserResponse
 *
 * @typedef {{
 *   name: string,
 *   description?: string | null,
 *   startDate?: string | null,
 *   deadline?: string | null,
 *   status: ProjectStatus
 * }} ProjectRequest
 *
 * @typedef {{
 *   id: number,
 *   name: string,
 *   description?: string,
 *   startDate?: string,
 *   deadline?: string,
 *   status: ProjectStatus,
 *   createdBy: UserResponse,
 *   members: UserResponse[],
 *   taskCount: number,
 *   createdAt: string,
 *   updatedAt: string
 * }} ProjectResponse
 *
 * @typedef {{
 *   title: string,
 *   description?: string | null,
 *   priority: TaskPriority,
 *   status: TaskStatus,
 *   dueDate?: string | null,
 *   assignedToId?: number | null
 * }} TaskRequest
 *
 * @typedef {{ status: TaskStatus }} TaskStatusRequest
 *
 * @typedef {{
 *   id: number,
 *   title: string,
 *   description?: string,
 *   priority: TaskPriority,
 *   status: TaskStatus,
 *   dueDate?: string,
 *   overdue: boolean,
 *   assignedTo?: UserResponse,
 *   projectId: number,
 *   projectName: string,
 *   createdBy: UserResponse,
 *   createdAt: string,
 *   updatedAt: string
 * }} TaskResponse
 */

export {}
