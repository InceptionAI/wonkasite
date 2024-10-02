import { dbAdmin } from '../../lib/firebase-admin';
import { FrequencyArticle, NextIdeas } from '../../types/client-info';
import { Timestamp } from 'firebase-admin/firestore';

/**
 *
 * Here's 3 way to use this function:
 * 1. Set title to an empty string to delete it from nextIdeas.
 * 2. Set a new object with title = string to add a new idea.
 * 3. Modify an existing idea by setting title = string to an other value.
 */

const updateNextIdeas = async (clientId: string, nextIdeasInput: NextIdeas[]) => {
  const docRef = dbAdmin.doc(`${clientId}/info`);

  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Client document does not exist');
  }

  const data = doc.data();

  if (!data) {
    throw new Error('Client document is empty');
  }

  const frequency = data.frequency as FrequencyArticle;

  if (!frequency) {
    throw new Error('Posting frequency is not set for the client');
  }

  // Map frequency to times per week
  const frequencyMap: { [key in FrequencyArticle]: number } = {
    'times-week-7': 7,
    'times-week-4': 4,
    'times-week-3': 3,
    'times-week-2': 2,
    'times-week-1': 1,
  };

  const timesPerWeek = frequencyMap[frequency];

  if (!timesPerWeek) {
    throw new Error(`Invalid frequency value: ${frequency}`);
  }

  const intervalDays = 7 / timesPerWeek;
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000;

  const now = new Date();

  // Initialize date to now or the earliest date in the list
  let date = now;

  const updatedNextIdeas: NextIdeas[] = [];

  for (let i = 0; i < nextIdeasInput.length; i++) {
    const idea = nextIdeasInput[i];
    const updatedIdea: NextIdeas = { ...idea };

    // Validate title
    if (typeof idea.title !== 'string' || !idea.title.trim()) {
      console.warn(`Skipping idea at position ${i + 1} due to invalid or empty title.`);
      continue; // Skip adding this idea to updatedNextIdeas
    }
    updatedIdea.title = idea.title.trim();

    // Handle date
    if (idea.date) {
      // Check if date is a string, convert to Timestamp
      if (typeof idea.date === 'string') {
        idea.date = Timestamp.fromDate(new Date(idea.date));
        updatedIdea.date = idea.date;
      }
      const ideaDate = idea.date.toDate();

      const diffDays = (now.getTime() - ideaDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 3 && updatedIdea.new) {
        delete updatedIdea.new;
      }
      date = ideaDate;
    } else {
      // Assign a date based on the previous idea's date plus interval
      if (i > 0 && updatedNextIdeas[i - 1].date) {
        date = new Date(updatedNextIdeas[i - 1].date!.toDate().getTime() + intervalMs);
      } else if (i === 0 && date < now) {
        // Ensure first date is not in the past
        date = now;
      }

      updatedIdea.date = Timestamp.fromDate(date);
      updatedIdea.new = true;
    }

    // Update date for next iteration
    date = new Date(date.getTime() + intervalMs);

    updatedNextIdeas.push(updatedIdea);
  }

  // Update Firestore document
  await docRef.update({
    nextIdeas: updatedNextIdeas,
  });
};

export { updateNextIdeas };
