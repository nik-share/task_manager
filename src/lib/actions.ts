import type {
	ApiResponse,
	CreateTaskData,
	Task,
	TaskId,
	TaskPriority,
} from './types'

const API_BASE_URL =
	typeof window === 'undefined' ? 'http://localhost:4321' : ''

export async function createTask(
	taskData: CreateTaskData | FormData
): Promise<Task> {
	let body: string
	let headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	if (taskData instanceof FormData) {
		const data: CreateTaskData = {
			title: taskData.get('title') as string,
			description: (taskData.get('description') as string) || null,
			priority: taskData.get('priority') as TaskPriority,
			dueDate: (taskData.get('dueDate') as string) || null,
		}
		body = JSON.stringify(data)
	} else {
		body = JSON.stringify(taskData)
	}

	const response = await fetch(`${API_BASE_URL}/api/tasks`, {
		method: 'POST',
		headers,
		body,
	})

	if (!response.ok) {
		const errorData: ApiResponse<never> = await response
			.json()
			.catch(() => ({}))
		throw new Error(errorData.message || 'Failed to create task')
	}

	return response.json()
}

export async function getTasks(): Promise<Task[]> {
	const response = await fetch(`${API_BASE_URL}/api/tasks`)

	if (!response.ok) {
		const errorData: ApiResponse<never> = await response
			.json()
			.catch(() => ({}))
		throw new Error(errorData.message || 'Failed to fetch tasks')
	}

	return response.json()
}

export async function updateTask(id: number, data: any) {
	const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		throw new Error('Failed to update task')
	}

	return response.json()
}

export async function toggleTaskStatus(id: TaskId): Promise<Task> {
	const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({}),
	})

	if (!response.ok) {
		const errorData: ApiResponse<never> = await response
			.json()
			.catch(() => ({}))
		throw new Error(errorData.message || 'Failed to update task')
	}

	return response.json()
}

export async function deleteTask(id: TaskId): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
		method: 'DELETE',
	})

	if (!response.ok) {
		const errorData: ApiResponse<never> = await response
			.json()
			.catch(() => ({}))
		throw new Error(errorData.message || 'Failed to delete task')
	}
}

export async function getTask(id: number) {
	const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`)

	if (!response.ok) {
		throw new Error('Failed to fetch task')
	}

	return response.json()
}
