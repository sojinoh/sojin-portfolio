// Q&A content pool — keyed by id.
// Each entry has a `q` (shown as chip text) and `parts` (sequential reply bubbles).

const QA_POOL = {

  location: {
    q: 'wait, where are you even based? 🌍',
    parts: [
      'Seattle, WA! ☁️',
      "Rainy skies, great coffee, and starting my Master's at UW HCDE this September.",
      "honestly couldn't ask for a better combo 😄",
    ],
  },

  pivot: {
    q: 'ok but how did you go from eng → HCD? 👀',
    parts: [
      'I kept shipping features and asking myself:',
      '"does anyone actually want this?" 🤔',
      'One project crystallized it — we prioritized a splashy home screen refresh to boost search volume while real usability issues sat unresolved.',
      "That gap between metrics and real user needs is exactly what I want to close at HCDE 🎯",
    ],
  },

  proud: {
    q: "what's something you've built that you're proud of? 🛠️",
    parts: [
      "In high school in Korea, I built a simple website showing cafeteria menus with photos — for English-speaking teachers who couldn't read Korean. 🍱",
      "They'd been packing lunch every day just to avoid the uncertainty.",
      "Such a small information barrier, such a real daily burden.",
      "That moment taught me how access to information shapes people's agency 💛",
    ],
  },

  ai: {
    q: 'what does human-centered AI mean to you? 🤔',
    parts: [
      'It means the AI is transparent about how it works — and lets you push back.',
      "I've seen how generative AI creates totally different experiences depending on a user's background.",
      'Experts question the output. Others just trust it.',
      'I want to design systems that help everyone understand and stay in control 🙌',
    ],
  },

  current: {
    q: 'what are you working on right now? ✨',
    parts: [
      "Getting ready to start my Master's at UW HCDE this September! 🎓",
      "And wrapping up 6 years on Amazon's Silk browser — but I now notice everything through a human-centered lens 🔍",
      "It's made me a much more intentional engineer, and I can't wait to go deeper 😄",
    ],
  },

  vibe: {
    q: "what's your vibe outside of work? 🌿",
    parts: [
      'Long walks, matcha,',
      "and convincing myself I'll finish that book I started 😄",
    ],
  },

  amazon: {
    q: 'what did you actually do at Amazon? 💼',
    parts: [
      "6 years on the Silk browser team — Amazon's built-in browser on Fire TV and Fire tablets 📺",
      "I shipped features like search recommendations, home screen redesigns, and video playback improvements that reached millions of users.",
      "The scale was humbling. But so was the gap between our KPIs and what users actually experienced day-to-day.",
      "That tension is what pushed me toward HCD 🔍",
    ],
  },

  hcde: {
    q: "what's HCDE and why that program? 🎓",
    parts: [
      "Human Centered Design & Engineering — it bridges UX research, design, and systems thinking.",
      "UW's program drew me in because it's deeply interdisciplinary. Not just design, not just engineering, but the messy overlap between people and technology 🌐",
      "And Seattle keeps me close to industry while I study. Best of both worlds.",
    ],
  },

  future: {
    q: "what are you hoping to do after your Master's? 🚀",
    parts: [
      "I want to work on products where UX directly shapes how people understand complex systems — AI tools, health tech, civic tech.",
      "Specifically, roles that blend engineering depth with design thinking. UX engineer, product researcher, something in that space.",
      "I want to build things where I can answer 'does this actually help someone?' with a confident yes ✅",
    ],
  },

  process: {
    q: 'what does your design process look like? 🎨',
    parts: [
      "I start with one question: who gets left behind if this doesn't work? 🤔",
      "Then I try to get close to those people — interviews, observation, whatever gets me to the real behavior, not the reported behavior.",
      "From there it's iteration. I'm comfortable going whiteboard → coded prototype → usability test.",
      "The engineer in me loves implementation details. The designer in me keeps asking if we're building the right thing before making it right 🙌",
    ],
  },

  contact: {
    q: 'how can I reach you? 📬',
    parts: [
      "I'd love to connect! 💌",
      "Email me at sojinohh@gmail.com — I try to reply within a day.",
      "You can also find me on LinkedIn — link's up in the corner ↗",
      "If you're hiring or want to collaborate on something interesting, definitely reach out 🙏",
    ],
  },

  surprise: {
    q: 'tell me something surprising about you 🙃',
    parts: [
      "I grew up in Korea, moved to the US for college, and somehow ended up building the browser on your Amazon Fire TV 😂",
      "I also once fixed a production bug while on a plane with no wifi — drafted the patch in Notes, deployed the moment we landed 🛫",
      "And I can read Roman numerals faster than most people. Side effect of too many engineering docs.",
    ],
  },

};

// Ordered list of questions shown as chips (3 at a time, cycling through)
const ALL_QUESTIONS = [
  QA_POOL.location,
  QA_POOL.pivot,
  QA_POOL.proud,
  QA_POOL.ai,
  QA_POOL.current,
  QA_POOL.vibe,
  QA_POOL.amazon,
  QA_POOL.hcde,
  QA_POOL.future,
  QA_POOL.process,
  QA_POOL.contact,
  QA_POOL.surprise,
];

// Keyword patterns for free-form input matching → QA_POOL entry
const KEYWORD_MAP = [
  { test: /seattle|where are you|based|live|location/i,                   qa: QA_POOL.location },
  { test: /amazon|fire tv|silk|browser|aws|what did you do|your work/i,   qa: QA_POOL.amazon  },
  { test: /how.*eng|eng.*hcd|pivot|switch|transition|career change/i,     qa: QA_POOL.pivot   },
  { test: /hcde|uw|master|grad school|university|degree|program/i,        qa: QA_POOL.hcde    },
  { test: /proud|built|high school|cafeteria|project you/i,               qa: QA_POOL.proud   },
  { test: /ai|artificial intel|human.centered|machine learning/i,         qa: QA_POOL.ai      },
  { test: /right now|working on|currently|nowadays|today/i,               qa: QA_POOL.current },
  { test: /hobby|outside|free time|personal|relax|fun|matcha|vibe/i,      qa: QA_POOL.vibe    },
  { test: /after.*master|future|goal|aspire|hope|next step|plan/i,        qa: QA_POOL.future  },
  { test: /process|approach|method|how do you design|workflow/i,          qa: QA_POOL.process },
  { test: /contact|reach|email|connect|linkedin|hire|collab|meet/i,       qa: QA_POOL.contact },
  { test: /surprise|fun fact|unusual|unexpected|weird|tell me something/i, qa: QA_POOL.surprise },
];

// Response used when no keyword matches
const FALLBACK_RESPONSE = {
  parts: [
    "ooh, good question 😄 I don't have a scripted answer for that one!",
    "feel free to email me directly — sojinohh@gmail.com 💌",
    "I'd genuinely love to chat 🙏",
  ],
};
