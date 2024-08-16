import { openai } from '../../../lib/open-ai';
import { improveBodyPrompt } from '../../../private/content';

// Function to improve the body of the article
export const improveBody = async (body: string, lang: string, listSubtitle: string[], context: string): Promise<string> => {
  const prompt = await improveBodyPrompt(body, lang, listSubtitle, context);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: prompt.system,
      },
      {
        role: 'user',
        content: prompt.user,
      },
    ],
    temperature: 0.1,
    top_p: 0.1,
  });

  const content = completion.choices[0].message?.content;

  return content ?? 'No content generated';
};
