import type { APIRoute } from 'astro';
import { generateTaskDescription, initializeOpenAI } from '../../lib/openai';
import { z } from 'zod';

const GenerateDescriptionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
});

export const POST: APIRoute = async ({ request }) => {
    try {
        const apiKey = import.meta.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'OpenAI API key not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        initializeOpenAI(apiKey);

        const body = await request.json();
        const result = GenerateDescriptionSchema.safeParse(body);

        if (!result.success) {
            return new Response(
                JSON.stringify({ error: 'Invalid request data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const description = await generateTaskDescription(result.data.title);

        return new Response(
            JSON.stringify({ description }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error in generate-description endpoint:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to generate description' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
