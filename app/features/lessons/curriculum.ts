import type { Lesson, PassCriteria, Stage } from "./types";

// All practice lines are original, written for Type with Bob.

export const stages: readonly Stage[] = [
  { id: "home-row", title: "Home row" },
  { id: "top-row", title: "Top row" },
  { id: "bottom-row", title: "Bottom row" },
  { id: "capitals", title: "Shift and capitals" },
  { id: "numbers", title: "Numbers" },
  { id: "punctuation", title: "Punctuation" },
];

const beginner: PassCriteria = { minAccuracy: 90, minWpm: 5 };
const improving: PassCriteria = { minAccuracy: 90, minWpm: 8 };
const confident: PassCriteria = { minAccuracy: 90, minWpm: 10 };

const homeRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];
const topRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

export const curriculum: readonly Lesson[] = [
  // Home row
  {
    id: "home-f-j",
    stage: "home-row",
    title: "F and J",
    description:
      "Rest your index fingers on F and J. Feel the little bumps? That's home.",
    newKeys: ["f", "j", " "],
    lines: ["fff jjj fjf jfj", "jf fj ff jj fj jf"],
    pass: beginner,
  },
  {
    id: "home-d-k",
    stage: "home-row",
    title: "D and K",
    description: "Your middle fingers sit on D and K, right next door.",
    newKeys: ["d", "k"],
    lines: ["ddd kkk dkd kdk", "fd jk dj kf fdk jkd"],
    pass: beginner,
  },
  {
    id: "home-s-l",
    stage: "home-row",
    title: "S and L",
    description: "Ring fingers on S and L. Keep the others resting on home.",
    newKeys: ["s", "l"],
    lines: ["sss lll sls lsl", "sdf jkl fds lkj"],
    pass: beginner,
  },
  {
    id: "home-a-semicolon",
    stage: "home-row",
    title: "A and ;",
    description:
      "Little fingers on A and the semicolon. Now every finger has a home.",
    newKeys: ["a", ";"],
    lines: ["aaa ;;; a;a ;a;", "a sad lad; a fall; a salad"],
    pass: beginner,
  },
  {
    id: "home-g-h",
    stage: "home-row",
    title: "G and H",
    description: "Stretch your index fingers inwards to reach G and H.",
    newKeys: ["g", "h"],
    lines: [
      "ggg hhh ghg hgh",
      "a glad lad has half a salad",
      "dash flash shall hall",
    ],
    pass: beginner,
  },
  {
    id: "home-review",
    stage: "home-row",
    title: "Home row review",
    description: "Put the whole home row together.",
    newKeys: [],
    focusKeys: homeRow,
    lines: ["dad has a flask; all lads ask", "a glad lass shall add salad"],
    pass: beginner,
  },

  // Top row
  {
    id: "top-e-i",
    stage: "top-row",
    title: "E and I",
    description: "Reach up from D to E, and from K to I, then come back home.",
    newKeys: ["e", "i"],
    lines: [
      "eee iii eie iei",
      "she said his dish is ideal",
      "a lake like glass; he feels glad",
    ],
    pass: improving,
  },
  {
    id: "top-r-u",
    stage: "top-row",
    title: "R and U",
    description: "Index fingers reach up to R and U.",
    newKeys: ["r", "u"],
    lines: [
      "rrr uuu rur uru",
      "a red ruler is useful",
      "he sure is a regular judge",
    ],
    pass: improving,
  },
  {
    id: "top-t-y",
    stage: "top-row",
    title: "T and Y",
    description: "A longer stretch: index fingers up and in to T and Y.",
    newKeys: ["t", "y"],
    lines: [
      "ttt yyy tyt yty",
      "they stay at the lake all day",
      "try a tasty treat at the fair",
    ],
    pass: improving,
  },
  {
    id: "top-w-o",
    stage: "top-row",
    title: "W and O",
    description: "Ring fingers reach up to W and O.",
    newKeys: ["w", "o"],
    lines: [
      "www ooo wow owo",
      "a slow old owl flew west",
      "we worked hard all week",
    ],
    pass: improving,
  },
  {
    id: "top-q-p",
    stage: "top-row",
    title: "Q and P",
    description: "Little fingers reach up to Q and P.",
    newKeys: ["q", "p"],
    lines: [
      "qqq ppp qpq pqp",
      "please pass the paper",
      "a quiet path up a steep hill",
    ],
    pass: improving,
  },
  {
    id: "top-review",
    stage: "top-row",
    title: "Top row review",
    description: "Mix the top row with everything you know so far.",
    newKeys: [],
    focusKeys: topRow,
    lines: [
      "the quiet wet street was where they played",
      "we should take a short trip to a park",
    ],
    pass: improving,
  },

  // Bottom row
  {
    id: "bottom-n-m",
    stage: "bottom-row",
    title: "N and M",
    description: "Right index finger reaches down to N and M.",
    newKeys: ["n", "m"],
    lines: [
      "nnn mmm nmn mnm",
      "many men and women went home",
      "a man in the moon",
    ],
    pass: confident,
  },
  {
    id: "bottom-v-b",
    stage: "bottom-row",
    title: "V and B",
    description: "Left index finger reaches down to V and B.",
    newKeys: ["v", "b"],
    lines: [
      "vvv bbb vbv bvb",
      "a big brown bear above the river",
      "we have a very busy bakery",
    ],
    pass: confident,
  },
  {
    id: "bottom-c-comma",
    stage: "bottom-row",
    title: "C and comma",
    description: "Middle fingers reach down to C and the comma.",
    newKeys: ["c", ","],
    lines: [
      "ccc ,,, c,c ,c,",
      "cats, cows, and chickens",
      "a cold clean creek, a calm cove",
    ],
    pass: confident,
  },
  {
    id: "bottom-x-full-stop",
    stage: "bottom-row",
    title: "X and full stop",
    description: "Ring fingers reach down to X and the full stop.",
    newKeys: ["x", "."],
    lines: [
      "xxx ... x.x .x.",
      "six boxes of wax.",
      "the fox jumps next to the taxi.",
    ],
    pass: confident,
  },
  {
    id: "bottom-z-slash",
    stage: "bottom-row",
    title: "Z and slash",
    description: "Little fingers reach down to Z and the slash.",
    newKeys: ["z", "/"],
    lines: ["zzz /// z/z /z/", "a lazy zebra zigzags", "and/or either/or"],
    pass: confident,
  },

  // Shift and capitals
  {
    id: "capitals-left-shift",
    stage: "capitals",
    title: "Capitals with left Shift",
    description:
      "For capitals typed with your right hand, hold the left Shift with your left little finger.",
    newKeys: ["H", "J", "K", "L", "N", "M", "U", "I", "O", "P", "Y"],
    lines: [
      "Hello Kim",
      "John and Mia met in Oslo",
      "Paul likes Lima. Yuki likes Mumbai.",
    ],
    pass: confident,
  },
  {
    id: "capitals-right-shift",
    stage: "capitals",
    title: "Capitals with right Shift",
    description:
      "For capitals typed with your left hand, hold the right Shift with your right little finger.",
    newKeys: [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "A",
      "S",
      "D",
      "F",
      "G",
      "Z",
      "X",
      "C",
      "V",
      "B",
    ],
    lines: [
      "Sam and Ted went to Rome.",
      "Dave, Beth and Gwen visit Cardiff.",
      "Zara and Fred cross Wales.",
    ],
    pass: confident,
  },

  // Numbers
  {
    id: "numbers-1-5",
    stage: "numbers",
    title: "Numbers 1 to 5",
    description: "Reach up past the top row to the numbers 1 to 5.",
    newKeys: ["1", "2", "3", "4", "5"],
    lines: [
      "111 222 333 444 555",
      "12 apples and 34 pears",
      "we need 5 more, not 3.",
    ],
    pass: confident,
  },
  {
    id: "numbers-6-0",
    stage: "numbers",
    title: "Numbers 6 to 0",
    description: "Now the numbers 6 to 0, with your right hand.",
    newKeys: ["6", "7", "8", "9", "0"],
    lines: [
      "666 777 888 999 000",
      "the bus leaves at 9.",
      "in 1987 there were 60 cats.",
    ],
    pass: confident,
  },

  // Punctuation
  {
    id: "punctuation-quotes",
    stage: "punctuation",
    title: "Apostrophes and quotes",
    description: "The apostrophe is next to the semicolon. Quotes need Shift.",
    newKeys: ["'", '"'],
    lines: ["it's time; don't stop", '"Yes," said Ben. "I am here."'],
    pass: confident,
  },
  {
    id: "punctuation-questions",
    stage: "punctuation",
    title: "Questions and exclamations",
    description: "Question marks and exclamation marks both need Shift.",
    newKeys: ["?", "!"],
    lines: ["Are you ready? Yes!", "Who is there? It's me!"],
    pass: confident,
  },
  {
    id: "punctuation-colons-dashes-brackets",
    stage: "punctuation",
    title: "Colons, dashes and brackets",
    description: "Colons, hyphens and brackets for notes and lists.",
    newKeys: [":", "-", "(", ")"],
    lines: [
      "Note: bring a pen (or two).",
      "a well-known half-term trip",
      "Open: 9-5 (Mon-Fri)",
    ],
    pass: confident,
  },
];
