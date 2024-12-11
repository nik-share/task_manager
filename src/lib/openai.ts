import OpenAI from 'openai'

let openai: OpenAI

export function initializeOpenAI(apiKey: string) {
	openai = new OpenAI({
		apiKey: apiKey,
	})
}

export async function generateTaskDescription(title: string): Promise<string> {
	if (!openai) {
		throw new Error('OpenAI client not initialized. Please provide an API key.')
	}

	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are a helpful assistant that generates concise and practical task descriptions based on task titles.',
				},
				{
					role: 'user',
					content: `Generate a brief but detailed description for a task titled: "${title}". Keep it under 200 characters.`,
				},
			],
			model: 'gpt-3.5-turbo',
		})

		return (
			completion.choices[0]?.message?.content ||
			'Unable to generate description'
		)
	} catch (error) {
		console.error('Error generating task description:', error)
		if (error instanceof OpenAI.APIError) {
			if (error.code === 'insufficient_quota') {
				throw new Error('OpenAI API quota exceeded. Please check your billing details.')
			}
			throw new Error(error.message || 'OpenAI API error occurred')
		}
		throw new Error('Failed to generate task description')
	}
}
