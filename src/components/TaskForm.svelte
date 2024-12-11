<script lang="ts">
  import { createTask } from '../lib/actions'
  import { tasksStore } from '../lib/stores'
  import type { CreateTaskData, TaskPriority } from '../lib/types'

  let title = '';
  let description = '';
  let priority: TaskPriority = 'MEDIUM';
  let dueDate = '';
  let error = '';
  let isSubmitting = false;
  let isGenerating = false;
  let isManualDescription = false;

  async function generateDescription() {
    if (!title.trim() || isGenerating) return;
    
    isGenerating = true;
    error = '';
    
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate description');
      }
      
      description = data.description;
      isManualDescription = false;
    } catch (e: unknown) {
      if (e instanceof Error) {
        error = e.message;
        
        isManualDescription = true;
      } else {
        error = 'An unknown error occurred';
      }
    } finally {
      isGenerating = false;
    }
  }

  async function handleSubmit(): Promise<void> {
    if (isSubmitting) return;
    if (!title.trim()) {
      error = 'Title is required';
      return;
    }

    error = '';
    isSubmitting = true;

    const taskData: CreateTaskData = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      dueDate: dueDate || null,
    };

    try {
      const newTask = await createTask(taskData);
      tasksStore.update(tasks => [...tasks, newTask]);
      
      // Reset form
      title = '';
      description = '';
      priority = 'MEDIUM';
      dueDate = '';
    } catch (err) {
      console.error('Error creating task:', err);
      error = err instanceof Error ? err.message : 'Failed to create task';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4 bg-white p-6 rounded-lg shadow">
  {#if error}
    <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}

  <div>
    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
    <input
      type="text"
      id="title"
      bind:value={title}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      placeholder="Enter task title"
      disabled={isSubmitting}
    />
  </div>

  <div>
    <div class="flex justify-between items-center">
      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
      <div class="flex items-center space-x-2">
        <button
          type="button"
          class="text-sm text-gray-500 hover:text-gray-700"
          on:click={() => isManualDescription = !isManualDescription}
        >
          {isManualDescription ? 'Use AI Generation' : 'Enter Manually'}
        </button>
        {#if !isManualDescription}
          <button
            type="button"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            on:click={generateDescription}
            disabled={isGenerating || !title.trim()}
          >
            {#if isGenerating}
              <span class="inline-block animate-spin mr-2">↻</span>
              Generating...
            {:else}
              Generate
            {/if}
          </button>
        {/if}
      </div>
    </div>
    <textarea
      id="description"
      bind:value={description}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      rows="3"
      placeholder={isManualDescription ? "Enter task description manually" : "Click Generate to create AI description"}
      disabled={isSubmitting || (!isManualDescription && !description)}
    ></textarea>
  </div>

  <div>
    <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
    <select
      id="priority"
      bind:value={priority}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      disabled={isSubmitting}
    >
      <option value="LOW">Low</option>
      <option value="MEDIUM">Medium</option>
      <option value="HIGH">High</option>
    </select>
  </div>

  <div>
    <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
    <input
      type="datetime-local"
      id="dueDate"
      bind:value={dueDate}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      disabled={isSubmitting}
    />
  </div>

  <div class="flex justify-end">
    <button
      type="submit"
      disabled={isSubmitting}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if isSubmitting}
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        Creating...
      {:else}
        Create Task
      {/if}
    </button>
  </div>
</form>
