import { openai } from '../../lib/open-ai';
import { linkedinSecretPrompt, translateLinkedinSecret } from '../../private/linkedin';
import { ClientInfo } from '../../types/client-info';
import { LocaleDetails } from '../../types/languages';

export const generateLinkedinPost = async ({
  context,
  href,
  locale,
  info,
}: {
  context: string;
  href: string;
  locale: LocaleDetails;
  info: ClientInfo;
}): Promise<string[] | null> => {
  try {
    const prompt = linkedinSecretPrompt(context, href, locale.language, info);

    const completion = await openai.chat.completions.create({
      model: 'o1-mini',
      messages: [
        {
          role: 'user',
          content: `${prompt.system}\n\n
          ${prompt.user}`,
        },
      ],
    });

    const response = completion.choices[0].message?.content?.replaceAll('```html', '').replaceAll('```', '');

    if (!response) {
      return null;
    }
    const cleanedResponse = response
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^[^{[]*/, '')
      .replace(/[^}\]]*$/, '')
      .trim();

    try {
      const list = JSON.parse(cleanedResponse) as string[];
      const prompt = translateLinkedinSecret(list);

      const completionWithTranslation = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `${prompt.system}\n\n
            ${prompt.user}`,
          },
        ],
      });

      const contentWithTranslation = completionWithTranslation.choices[0].message?.content
        ?.replaceAll('```html', '')
        .replaceAll('```', '');

      if (!contentWithTranslation) {
        return null;
      }

      const cleanedTranslation = contentWithTranslation
        .replace(/```[\s\S]*?```/g, '')
        .replace(/^[^{[]*/, '')
        .replace(/[^}\]]*$/, '')
        .trim();

      const finishedList = JSON.parse(cleanedTranslation) as string[];

      return finishedList;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in generateLinkedinPost', error);
    return null;
  }
};
