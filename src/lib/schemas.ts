import { z } from 'zod'

export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'])

export const CreateTaskSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required')
		.max(100, 'Title must be less than 100 characters'),
	description: z.string().nullable().optional(),
	priority: TaskPriorityEnum,
	dueDate: z
		.string()
		.transform(date => {
			if (!date) return null

			return date + ':00+04:00'
		})
		.nullable()
		.optional(),
})

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
	completed: z.boolean().optional(),
})

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
