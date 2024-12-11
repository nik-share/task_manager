<script lang="ts">
  import { onMount } from 'svelte'
  import { deleteTask, getTasks, toggleTaskStatus } from '../lib/actions'
  import { tasksStore } from '../lib/stores'
  import type { Task, TaskId } from '../lib/types'
  
  let initialLoading = true;
  let error = '';
  let updatingTaskIds = new Set<TaskId>();
  let deletingTaskIds = new Set<TaskId>();
  
  export async function loadTasks(): Promise<void> {
    if (!initialLoading && $tasksStore.length === 0) {
      initialLoading = true;
    }
    error = '';
    try {
      const newTasks = await getTasks();
      tasksStore.set(newTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      error = err instanceof Error ? err.message : 'Failed to load tasks';
    } finally {
      initialLoading = false;
    }
  }
  
  async function handleToggleStatus(task: Task): Promise<void> {
    if (updatingTaskIds.has(task.id)) return;
    
    const taskIndex = $tasksStore.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      const updatedTasks = [...$tasksStore];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed: !updatedTasks[taskIndex].completed };
      tasksStore.set(updatedTasks);
    }

    updatingTaskIds.add(task.id);
    updatingTaskIds = updatingTaskIds; 
    try {
      await toggleTaskStatus(task.id);
    } catch (err) {
      console.error('Error toggling task status:', err);

      if (taskIndex !== -1) {
        const updatedTasks = [...$tasksStore];
        updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed: !updatedTasks[taskIndex].completed };
        tasksStore.set(updatedTasks);
      }
      error = err instanceof Error ? err.message : 'Failed to update task';
    } finally {
      updatingTaskIds.delete(task.id);
      updatingTaskIds = updatingTaskIds;
    }
  }
  
  async function handleDelete(id: TaskId): Promise<void> {
    if (!confirm('Are you sure you want to delete this task?')) return;
    if (deletingTaskIds.has(id)) return;

    deletingTaskIds.add(id);
    deletingTaskIds = deletingTaskIds; 

    try {
      await deleteTask(id);
      tasksStore.update(tasks => tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      error = err instanceof Error ? err.message : 'Failed to delete task';
    } finally {
      deletingTaskIds.delete(id);
      deletingTaskIds = deletingTaskIds; 
    }
  }
  
  onMount(loadTasks);
</script>

<task-list>
  <div class="space-y-4">
    {#if error}
      <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{error}</span>
      </div>
    {/if}

    {#if initialLoading}
      <div class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">Loading tasks...</p>
      </div>
    {:else if $tasksStore.length === 0}
      <div class="text-center py-8 bg-white rounded-lg shadow">
        <p class="text-gray-500">No tasks found. Create one to get started!</p>
      </div>
    {:else}
      {#each $tasksStore as task (task.id)}
        <div class="bg-white p-4 rounded-lg shadow flex items-center justify-between {updatingTaskIds.has(task.id) ? 'opacity-70' : ''} transition-opacity duration-200">
          <div class="flex items-center space-x-4 flex-1">
            <div class="relative">
              <input
                type="checkbox"
                checked={task.completed}
                on:change={() => handleToggleStatus(task)}
                disabled={updatingTaskIds.has(task.id)}
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded {updatingTaskIds.has(task.id) ? 'opacity-0' : ''}"
              />
              {#if updatingTaskIds.has(task.id)}
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium {task.completed ? 'line-through text-gray-500' : ''} truncate">
                {task.title}
              </h3>
              {#if task.description}
                <p class="text-gray-500 truncate">{task.description}</p>
              {/if}
              <div class="flex flex-wrap gap-2 mt-2 text-sm">
                <span class={`px-2 py-1 rounded-full text-xs font-semibold
                  ${task.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 
                  task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}`}>
                  {task.priority}
                </span>
                {#if task.dueDate}
                  <span class="text-gray-500 text-xs">
                    Due: {new Date(task.dueDate).toLocaleString()}
                  </span>
                {/if}
              </div>
            </div>
          </div>
          <button
            on:click={() => handleDelete(task.id)}
            disabled={deletingTaskIds.has(task.id)}
            class="ml-4 text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 {deletingTaskIds.has(task.id) ? 'opacity-50 cursor-not-allowed' : ''}"
          >
            {#if deletingTaskIds.has(task.id)}
              <div class="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            {/if}
          </button>
        </div>
      {/each}
    {/if}
  </div>
</task-list>
