export type TextSource = {
  id: string;
  name: string;
  description: string;
  /** Where the text comes from, as required for anything not written here. */
  origin: string;
  kind: "words" | "passages";
  items: readonly string[];
};

export type PracticeLength = {
  id: string;
  name: string;
  words: number;
};

export const lengths: readonly PracticeLength[] = [
  { id: "short", name: "Short", words: 15 },
  { id: "medium", name: "Medium", words: 30 },
  { id: "long", name: "Long", words: 60 },
];

const commonWords: TextSource = {
  id: "common-words",
  name: "Common words",
  description: "A random mix of everyday English words, all lowercase.",
  origin: "Word list compiled for Type with Bob.",
  kind: "words",
  // prettier-ignore
  items: [
    "the", "and", "that", "have", "for", "not", "with", "you", "this", "but",
    "his", "from", "they", "say", "her", "she", "will", "one", "all", "would",
    "there", "their", "what", "out", "about", "who", "get", "which", "when", "make",
    "can", "like", "time", "just", "him", "know", "take", "people", "into", "year",
    "your", "good", "some", "could", "them", "see", "other", "than", "then", "now",
    "look", "only", "come", "its", "over", "think", "also", "back", "after", "use",
    "two", "how", "our", "work", "first", "well", "way", "even", "new", "want",
    "because", "any", "these", "give", "day", "most", "find", "here", "thing", "many",
    "tell", "very", "where", "long", "down", "life", "child", "world", "school", "still",
    "try", "last", "ask", "need", "too", "feel", "three", "state", "never", "become",
    "high", "really", "something", "open", "family", "leave", "put", "old", "while", "mean",
    "keep", "student", "why", "let", "great", "same", "big", "group", "begin", "seem",
    "country", "help", "talk", "turn", "problem", "every", "start", "hand", "might", "show",
    "part", "against", "place", "such", "again", "few", "case", "week", "company", "system",
    "each", "right", "program", "hear", "question", "during", "play", "home", "small", "number",
    "always", "move", "night", "live", "point", "believe", "hold", "today", "bring", "happen",
    "next", "without", "before", "large", "million", "must", "house", "water", "under", "story",
    "young", "fact", "month", "lot", "study", "book", "eye", "job", "word", "kind",
    "four", "head", "far", "black", "light", "both", "little", "side", "until", "area",
  ],
};

const shortStories: TextSource = {
  id: "short-stories",
  name: "Short stories",
  description: "Little everyday scenes with capitals and punctuation.",
  origin: "Original passages written for Type with Bob.",
  kind: "passages",
  items: [
    "The kettle clicked off just as the rain began. Maya poured her tea, wrapped both hands around the warm mug and watched the drops race each other down the window. Somewhere outside, a dog barked twice and then thought better of it.",
    "Every Saturday the market fills the square by eight. There are apples stacked like little red hills, loaves still warm from the oven, and a man who sells nothing but buttons. Nobody knows how he makes a living, but he is always smiling.",
    "Sam had practised the song for weeks. On the night of the concert his hands shook, so he took a slow breath, looked at the back of the hall and started to play. By the second verse he had forgotten to be nervous at all.",
    "The old bike had a squeaky wheel and a bell that only rang when it felt like it. Still, it carried Priya to school every morning, past the bakery, over the bridge and down the hill where the wind made her eyes water.",
    'At the top of the hill the whole town was spread out below them like a map. They could see the river, the station, and even their own street. Leo pointed at a tiny blue roof and shouted, "That one is ours!"',
    "Grandad kept a notebook of every bird he saw from the kitchen window. Robins, sparrows and a cheeky magpie filled most pages, but one line was underlined three times: a heron, standing perfectly still on the garden wall.",
  ],
};

const proverbs: TextSource = {
  id: "proverbs",
  name: "Proverbs",
  description: "Well-known sayings, short and full of punctuation.",
  origin: "Traditional English proverbs, in the public domain.",
  kind: "passages",
  items: [
    "Many hands make light work.",
    "A stitch in time saves nine.",
    "Look before you leap.",
    "Actions speak louder than words.",
    "Where there's a will, there's a way.",
    "Don't count your chickens before they hatch.",
    "Every cloud has a silver lining.",
    "Rome wasn't built in a day.",
    "Practice makes perfect.",
    "The early bird catches the worm.",
    "Better late than never.",
    "Slow and steady wins the race.",
    "Two heads are better than one.",
    "When in Rome, do as the Romans do.",
    "Fortune favours the bold.",
    "An apple a day keeps the doctor away.",
    "Don't put all your eggs in one basket.",
    "You can't judge a book by its cover.",
    "Honesty is the best policy.",
    "Absence makes the heart grow fonder.",
  ],
};

export const sources: readonly TextSource[] = [
  commonWords,
  shortStories,
  proverbs,
];

export const DEFAULT_SOURCE_ID = commonWords.id;
export const DEFAULT_LENGTH_ID = "short";
