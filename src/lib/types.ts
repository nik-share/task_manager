import type { Task as PrismaTask } from '@prisma/client';

export interface Task extends PrismaTask {}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface CreateTaskData {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  dueDate?: string | null;
}

export interface TaskUpdateData {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
  completed?: boolean;
}

export type TaskId = number;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
