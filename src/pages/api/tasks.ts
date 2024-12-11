import type { APIRoute } from 'astro'
import prisma from '../../lib/prisma'
import { CreateTaskSchema } from '../../lib/schemas'

export const GET: APIRoute = async () => {
	try {
		const tasks = await prisma.task.findMany({
			orderBy: { createdAt: 'desc' },
		})
		return new Response(JSON.stringify(tasks), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.error('Error fetching tasks:', error)
		return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const json = await request.json()

		const result = CreateTaskSchema.safeParse(json)
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
		const task = await prisma.task.create({
			data: {
				...taskData,
				completed: false,
			},
		})

		return new Response(JSON.stringify(task), {
			status: 201,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (error) {
		console.error('Error creating task:', error)
		return new Response(JSON.stringify({ error: 'Failed to create task' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
}
