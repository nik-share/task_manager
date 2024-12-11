import { writable } from 'svelte/store';
import type { Task } from './types';

export const tasksStore = writable<Task[]>([]);
