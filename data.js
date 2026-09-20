/**
 * ============================================================
 *  SITE CONTENT — this is the only file you need to edit for
 *  routine updates. index.html, styles.css and app.js handle
 *  layout and behaviour and shouldn't need to change when you
 *  just want to add a project or fix a bio line.
 *
 *  To add a new project: copy an object inside an "items" array
 *  and change its fields.
 *  To add a new category: copy one of the objects in
 *  "categories" (including its own "items" array) and give it a
 *  new "id".
 * ============================================================
 */

const SITE_DATA = {
  profile: {
    name: "Yifei Wang",
    title: "Computer scientist and data scientist working on AI safety",
    bio:
      "I build tools and run experiments to making AI systems " +
      "safer and more reliable. My work spans evaluation, control, interpretability research, " +
      "applied data science, policy research and general software engineering — the " +
      "categories below are organised around that mix.",

    // Path to a photo, relative to index.html. Set to null (no quotes)
    // to show a plain initials avatar instead — the page works fine
    // either way, so there's no rush to add a photo.
    photo: "assets/profile.jpg",

    // Path to your résumé PDF, relative to index.html.
    resumeUrl: "assets/resume.pdf",

    contacts: [
      { label: "Email", url: "mailto:alice2316708@gmail.com" },
      { label: "GitHub", url: "https://github.com/AliceBobCharlie" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/yifei-wang-11725a376/" }
    ]
  },

  // Each object below becomes one card on the board. The order here
  // is only the *default* order — once a visitor drags a card, their
  // browser remembers the new order for their next visit.
  categories: [
    {
      id: "ai-safety",
      title: "AI Safety",
      accent: "#4B3F72",
      description: "Evaluation, control and interpretability work.",
      items: [
        {
          title: "The dimensional structure of occupational space: a coordinate system for AI substitution measures",
          url: "https://github.com/AliceBobCharlie/AI_and_employment",
          description: "A working paper recovering three robust axes of occupational structure (physical intensity, judgement, person-facing work) from O*NET and used them to predict where AI substitution bites.\n"
        },
        {
          title: "Multi-agent Control Arena",
          url: "https://github.com/AliceBobCharlie/multi-agent-control-arena",
          description: "A multi-agent control setting implemented in Control Arena demonstrating agents can exhibit collusion via shared codebases even without explicit communication."
        },
        {
          title: "Standard Secret-Loyalty Detectors Measure what: Fine-Tuning, or Loyalty?",
          url: "https://github.com/AliceBobCharlie/SecretLoyalty",
          description: "A hackathon paper experimenting prior-first auditing of secret loyalty."
        },
      ]
    },
    {
      id: "deep-learning",
      title: "Deep Learning",
      accent: "#a60a30",
      description: "Repositories and papers related to deep learning",
      items: [
        {
          title: "Mobile face reaging",
          url: "https://github.com/AliceBobCharlie/mobile_face_reaging",
          description: "A quantized face reaging app that can run on mobile devices."
        },
        {
          title: "Mobile voice agent",
          url: "https://github.com/AliceBobCharlie/LLMAgent",
          description: "An mobile LLM agent that can understand audio instructions."
        },
      ]
    },
    {
      id: "data-science",
      title: "Data Science",
      accent: "#B8752E",
      description: "Analysis, modelling and data visualisation.",
      items: [
        {
          title: "Astronomical Classification with DESI spectroscopic data",
          url: "https://github.com/AliceBobCharlie/DESI",
          description: "Classify different types of astronomical objects."
        },
        {
          title: "Stock trading analysis and simulation",
          url: "https://github.com/AliceBobCharlie/Stock_dj",
          description: "Simulated and analysed Dow-Jones stocks with different strategies."
        }
      ]
    },
    {
      id: "software-projects",
      title: "Software Development",
      accent: "#1F6F78",
      description: "Systems, algorithms and software projects.",
      items: [
        {
          title: "Bayesian Classifier Extension for Sklearn",
          url: "https://github.com/AliceBobCharlie/StatsNB",
          description: "a Python package extending Sklearn's NaiveBayesianClassifiers to support all continuous distributions"
        },
        {
          title: "CompareCart",
          url: "https://github.com/AliceBobCharlie/CompareCart",
          description: "an app which scraps Boston local shopping data to help international students and tourists search& compare items to find the best deal."
        },
        {
          title: "Other Web Apps",
          url: "https://github.com/AliceBobCharlie/web_dev",
          description: "A repository for my web applications"
        }
      ]
    },
    {
      id: "other",
      title: "Other Projects",
      accent: "#5B6470",
      description: "Everything that doesn't fit neatly above.",
      items: [
        {
          title: "Probability tutorial",
          url: "https://janedoe.dev/blog",
          description: "A webpage that helps learners with common difficulties in probability"
        }
      ]
    }
  ]
};
