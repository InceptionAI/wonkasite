import { openai } from '../../lib/open-ai';
import { get10RootIdeasPrompt } from '../../private/ideas';
import { preprocessJSON } from '../preprocessJSON';

// Function to generate a list of 10 ideas to a given context
export const get10RootIdeas = async (subject: string, mission: string, target_audience: string): Promise<string[]> => {
  const prompt = await get10RootIdeasPrompt(subject, mission, target_audience);

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
  });

  const result = preprocessJSON(completion.choices[0].message?.content ?? '').replace('rootIdeas: ', '');
  console.log('result: ', result);

  if (!result) {
    console.log('Error in get-10-root-ideas.ts: no result');
    return [];
  }
  try {
    JSON.parse(result);
  } catch (error) {
    console.log('Error parse in get-10-root-ideas.ts: ', error);
    return [];
  }
  const data: string[] = JSON.parse(result);

  return data;
};
