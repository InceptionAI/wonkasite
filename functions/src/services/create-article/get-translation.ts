import { Timestamp } from 'firebase-admin/firestore';
import { dbAdmin } from '../../lib/firebase-admin';
import { openai } from '../../lib/open-ai';
import { Article } from '../../types/article';
import { Locale, localesDetails } from '../../types/languages';
import { getTranslationPrompt } from '../../private/translation';

//TODO: Finish this function, not working yet
export const getTranslation = async (article: Article, clientId: string, lang: Locale): Promise<void> => {
  const locale = localesDetails[lang];
  const prompts = await getTranslationPrompt(locale, article);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: prompts.system,
      },
      {
        role: 'user',
        content: prompts.user,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message?.content;

  if (!content) {
    throw new Error('Failed to generate a translation');
  }

  const data = JSON.parse(content) as Article;
  data.id = article.id;
  data.author = article.author;
  data.published = false;
  data.created = Timestamp.now();
  data.thumbnail = article.thumbnail;
  data.prompt = article.prompt;

  const docRefTranslate = dbAdmin.doc(`${clientId}/${lang}/articles/${data.id}`);

  await docRefTranslate.set(data);
  // await docRef.set({ translations: { [lang]: data.id } }, { merge: true });
};
