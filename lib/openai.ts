import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
    dangerouslyAllowBrowser: true // Only for demo/mock purposes if needed on client, but we use it in API routes usually.
});
