import { PrismaClient } from '@prisma/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { CreateTaskData, TaskPriority } from './types'

const prisma = new PrismaClient()

describe('Task Actions', () => {
	beforeEach(async () => {
		await prisma.task.deleteMany()
	})

	afterEach(async () => {
		await prisma.$disconnect()
	})

	it('should create a new task', async () => {
		const taskData: CreateTaskData = {
			title: 'Test Task',
			description: 'Test Description',
			priority: 'HIGH' as TaskPriority,
			dueDate: new Date().toISOString(),
		}

		const task = await prisma.task.create({
			data: {
				...taskData,
				completed: false,
				dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
			},
		})

		expect(task.title).toBe('Test Task')
		expect(task.description).toBe('Test Description')
		expect(task.priority).toBe('HIGH')
	})

	it('should get all tasks', async () => {
		await prisma.task.create({
			data: {
				title: 'Task 1',
				priority: 'LOW',
				completed: false,
			},
		})

		await new Promise(resolve => setTimeout(resolve, 10))

		await prisma.task.create({
			data: {
				title: 'Task 2',
				priority: 'MEDIUM',
				completed: false,
			},
		})

		const allTasks = await prisma.task.findMany({
			orderBy: { createdAt: 'desc' },
		})

		expect(allTasks).toHaveLength(2)
		expect(allTasks[0].title).toBe('Task 2')
		expect(allTasks[1].title).toBe('Task 1')
	})

	it('should update a task', async () => {
		const task = await prisma.task.create({
			data: {
				title: 'Original Task',
				priority: 'LOW',
				completed: false,
			},
		})

		const updatedTask = await prisma.task.update({
			where: { id: task.id },
			data: {
				title: 'Updated Task',
				priority: 'HIGH',
			},
		})

		expect(updatedTask.title).toBe('Updated Task')
		expect(updatedTask.priority).toBe('HIGH')
	})

	it('should delete a task', async () => {
		const task = await prisma.task.create({
			data: {
				title: 'Task to Delete',
				priority: 'LOW',
				completed: false,
			},
		})

		await prisma.task.delete({
			where: { id: task.id },
		})

		const deletedTask = await prisma.task.findUnique({
			where: { id: task.id },
		})

		expect(deletedTask).toBeNull()
	})

	it('should toggle task status', async () => {
		const task = await prisma.task.create({
			data: {
				title: 'Task to Toggle',
				priority: 'LOW',
				completed: false,
			},
		})

		const toggledTask = await prisma.task.update({
			where: { id: task.id },
			data: {
				completed: !task.completed,
			},
		})

		expect(toggledTask.completed).toBe(true)
	})
})
