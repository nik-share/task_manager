import type { APIRoute } from 'astro'
import prisma from '../../../lib/prisma'
import { UpdateTaskSchema } from '../../../lib/schemas'

export const GET: APIRoute = async ({ params }) => {
	try {
		const id = Number(params.id)
		if (isNaN(id)) {
			return new Response(JSON.stringify({ error: 'Invalid task ID' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
				},
			})
		}

		const task = await prisma.task.findUnique({
			where: { id },
		})

		if (!task) {
			return new Response(JSON.stringify({ error: 'Task not found' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json',
				},
			})
		}

		return new Response(JSON.stringify(task), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.error('Error fetching task:', error)
		return new Response(JSON.stringify({ error: 'Failed to fetch task' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
}

export const PUT: APIRoute = async ({ params, request }) => {
	const { id } = params
	if (!id) {
		return new Response(JSON.stringify({ error: 'Task ID is required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	try {
		const json = await request.json()

		const result = UpdateTaskSchema.safeParse(json)
		if (!result.success) {
			return new Response(
				JSON.stringify({
					error: 'Validation failed',
					issues: result.error.issues,
				}),
				{
					status: 400,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
		}

		const taskData = result.data
		const task = await prisma.task.update({
			where: { id: parseInt(id) },
			data: taskData,
		})

		return new Response(JSON.stringify(task), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.error('Error updating task:', error)
		return new Response(JSON.stringify({ error: 'Failed to update task' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
}

export const DELETE: APIRoute = async ({ params }) => {
	const { id } = params
	if (!id) {
		return new Response(JSON.stringify({ error: 'Task ID is required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	try {
		await prisma.task.delete({
			where: { id: parseInt(id) },
		})

		return new Response(null, { status: 204 })
	} catch (error) {
		console.error('Error deleting task:', error)
		return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
}
