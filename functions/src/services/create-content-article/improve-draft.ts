import { openai } from '../../lib/open-ai';
import { improveDraftPrompt } from '../../private/prompt';

// Function to generate content for a subtitle
export const improveDraft = async (
  draft: string,
  mission: string,
  subject: string,
  target_audiance: string,
  lang: string,
): Promise<string> => {
  const prompt = await improveDraftPrompt(draft, mission, subject, target_audiance, lang);

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

  const content = completion.choices[0].message?.content;

  return content ?? 'No content generated';
};
