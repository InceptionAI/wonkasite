import { openai } from '../../../lib/open-ai';
import { getConclusionPrompt } from '../../../private/content';

// Function to generate content for a subtitle
export const createContentForClosure = async (
  subtitle: string,
  mission: string,
  subject: string,
  targetAudience: string,
  listSubtitle: string[],
  lang: string,
  CTA: string,
  domain: string,
): Promise<string> => {
  const prompt = await getConclusionPrompt(subtitle, mission, subject, targetAudience, listSubtitle, lang, CTA, domain);

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
