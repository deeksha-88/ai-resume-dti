/**
 * AI Resume Analyzer - Express Backend
 *
 * Run:
 *   cd backend
 *   npm install
 *   npm start
 *
 * Server runs on http://localhost:5000
 */

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

/* ---------------- Skill database per role ---------------- */
const ROLE_SKILLS = {
  "frontend developer": [
    "html", "css", "javascript", "typescript", "react", "redux",
    "tailwind", "nextjs", "git", "rest api", "responsive design", "accessibility",
  ],
  "backend developer": [
    "nodejs", "express", "mongodb", "sql", "postgresql", "rest api",
    "graphql", "docker", "redis", "authentication", "git", "typescript",
  ],
  "full stack developer": [
    "html", "css", "javascript", "typescript", "react", "nodejs",
    "express", "mongodb", "sql", "git", "docker", "rest api",
  ],
  "data scientist": [
    "python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "sql", "statistics", "machine learning", "deep learning", "data visualization", "jupyter",
  ],
  "data analyst": [
    "excel", "sql", "python", "tableau", "power bi", "pandas",
    "statistics", "data visualization", "etl", "reporting",
  ],
  "machine learning engineer": [
    "python", "tensorflow", "pytorch", "scikit-learn", "mlops",
    "docker", "kubernetes", "aws", "sql", "deep learning", "nlp", "computer vision",
  ],
  "devops engineer": [
    "linux", "docker", "kubernetes", "aws", "azure", "terraform",
    "jenkins", "ci/cd", "bash", "python", "ansible", "monitoring",
  ],
  "android developer": [
    "kotlin", "java", "android studio", "jetpack compose", "xml",
    "firebase", "rest api", "git", "mvvm",
  ],
  "ios developer": [
    "swift", "swiftui", "xcode", "objective-c", "core data",
    "rest api", "git", "uikit",
  ],
  "ui ux designer": [
    "figma", "adobe xd", "sketch", "wireframing", "prototyping",
    "user research", "design systems", "html", "css",
  ],
};

const DEFAULT_SKILLS = [
  "communication", "teamwork", "problem solving", "git", "rest api",
  "javascript", "python", "sql",
];

/* ---------------- Helpers ---------------- */
function normalize(str) {
  return (str || "").toLowerCase();
}

function extractSkills(resumeText) {
  const text = normalize(resumeText);
  const allKnown = new Set();
  Object.values(ROLE_SKILLS).forEach((arr) => arr.forEach((s) => allKnown.add(s)));
  DEFAULT_SKILLS.forEach((s) => allKnown.add(s));

  const found = [];
  allKnown.forEach((skill) => {
    // word-boundary-ish match (skills can include spaces / slashes)
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
    if (re.test(text)) found.push(skill);
  });
  return Array.from(new Set(found));
}

function getRoleSkills(jobRole) {
  const key = normalize(jobRole).trim();
  if (ROLE_SKILLS[key]) return { key, skills: ROLE_SKILLS[key] };
  // partial match
  for (const k of Object.keys(ROLE_SKILLS)) {
    if (key.includes(k) || k.includes(key)) return { key: k, skills: ROLE_SKILLS[k] };
  }
  return { key: key || "generic", skills: DEFAULT_SKILLS };
}

/* ---------------- Learning roadmap (trusted links only) ---------------- */
const LEARNING_LINKS = {
  javascript: { title: "Learn JavaScript", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  typescript: { title: "TypeScript Handbook", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  html: { title: "HTML Tutorial", link: "https://www.w3schools.com/html/" },
  css: { title: "CSS Tutorial", link: "https://www.w3schools.com/css/" },
  react: { title: "Learn React", link: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
  redux: { title: "Redux Basics", link: "https://www.freecodecamp.org/news/tag/redux/" },
  tailwind: { title: "Tailwind via CSS Fundamentals", link: "https://www.w3schools.com/css/" },
  nextjs: { title: "Next.js & React", link: "https://www.freecodecamp.org/news/tag/next-js/" },
  nodejs: { title: "Node.js Tutorial", link: "https://www.w3schools.com/nodejs/" },
  express: { title: "Express on Node.js", link: "https://www.w3schools.com/nodejs/nodejs_modules.asp" },
  mongodb: { title: "MongoDB Basics", link: "https://www.w3schools.com/mongodb/" },
  sql: { title: "SQL Tutorial", link: "https://www.w3schools.com/sql/" },
  postgresql: { title: "PostgreSQL via SQL", link: "https://www.w3schools.com/sql/" },
  graphql: { title: "GraphQL Intro", link: "https://www.freecodecamp.org/news/tag/graphql/" },
  docker: { title: "Docker for Developers", link: "https://www.freecodecamp.org/news/tag/docker/" },
  kubernetes: { title: "Kubernetes Guide", link: "https://www.freecodecamp.org/news/tag/kubernetes/" },
  redis: { title: "Redis Basics", link: "https://www.freecodecamp.org/news/tag/redis/" },
  authentication: { title: "Web Auth Basics", link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" },
  "rest api": { title: "REST APIs", link: "https://developer.mozilla.org/en-US/docs/Glossary/REST" },
  git: { title: "Git Tutorial", link: "https://www.w3schools.com/git/" },
  python: { title: "Python Tutorial", link: "https://www.w3schools.com/python/" },
  pandas: { title: "Pandas via Python", link: "https://www.w3schools.com/python/pandas/default.asp" },
  numpy: { title: "NumPy via Python", link: "https://www.w3schools.com/python/numpy/default.asp" },
  "scikit-learn": { title: "ML with Python", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
  tensorflow: { title: "TensorFlow & ML", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
  pytorch: { title: "PyTorch & ML", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
  statistics: { title: "Statistics for Data", link: "https://www.w3schools.com/statistics/" },
  "machine learning": { title: "Machine Learning Course", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
  "deep learning": { title: "Deep Learning Path", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
  "data visualization": { title: "Data Viz with Python", link: "https://www.w3schools.com/python/matplotlib_intro.asp" },
  jupyter: { title: "Python in Jupyter", link: "https://www.w3schools.com/python/" },
  excel: { title: "Excel Tutorial", link: "https://www.w3schools.com/excel/" },
  tableau: { title: "Data Analysis with Python", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
  "power bi": { title: "Data Analysis with Python", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
  etl: { title: "Data Analysis Path", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
  reporting: { title: "Data Analysis Path", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
  mlops: { title: "ML Engineering", link: "https://www.freecodecamp.org/news/tag/machine-learning/" },
  aws: { title: "Cloud Fundamentals", link: "https://www.freecodecamp.org/news/tag/aws/" },
  azure: { title: "Cloud Fundamentals", link: "https://www.freecodecamp.org/news/tag/cloud/" },
  terraform: { title: "Infrastructure as Code", link: "https://www.freecodecamp.org/news/tag/devops/" },
  jenkins: { title: "CI/CD Basics", link: "https://www.freecodecamp.org/news/tag/devops/" },
  "ci/cd": { title: "CI/CD Basics", link: "https://www.freecodecamp.org/news/tag/devops/" },
  bash: { title: "Bash Tutorial", link: "https://www.freecodecamp.org/news/tag/bash/" },
  ansible: { title: "DevOps Path", link: "https://www.freecodecamp.org/news/tag/devops/" },
  monitoring: { title: "DevOps Path", link: "https://www.freecodecamp.org/news/tag/devops/" },
  linux: { title: "Linux Basics", link: "https://www.freecodecamp.org/news/tag/linux/" },
  nlp: { title: "NLP with Python", link: "https://www.freecodecamp.org/news/tag/nlp/" },
  "computer vision": { title: "Computer Vision", link: "https://www.freecodecamp.org/news/tag/computer-vision/" },
  kotlin: { title: "Kotlin Tutorial", link: "https://www.w3schools.com/kotlin/" },
  java: { title: "Java Tutorial", link: "https://www.w3schools.com/java/" },
  "android studio": { title: "Android via Kotlin", link: "https://www.w3schools.com/kotlin/" },
  "jetpack compose": { title: "Android via Kotlin", link: "https://www.w3schools.com/kotlin/" },
  xml: { title: "XML Tutorial", link: "https://www.w3schools.com/xml/" },
  firebase: { title: "Backend Basics", link: "https://www.freecodecamp.org/news/tag/firebase/" },
  mvvm: { title: "Software Architecture", link: "https://developer.mozilla.org/en-US/docs/Glossary/MVC" },
  swift: { title: "Swift Basics", link: "https://www.freecodecamp.org/news/tag/swift/" },
  swiftui: { title: "iOS via Swift", link: "https://www.freecodecamp.org/news/tag/swift/" },
  xcode: { title: "iOS via Swift", link: "https://www.freecodecamp.org/news/tag/swift/" },
  "objective-c": { title: "iOS via Swift", link: "https://www.freecodecamp.org/news/tag/swift/" },
  "core data": { title: "iOS via Swift", link: "https://www.freecodecamp.org/news/tag/swift/" },
  uikit: { title: "iOS via Swift", link: "https://www.freecodecamp.org/news/tag/swift/" },
  figma: { title: "Web Design Basics", link: "https://www.w3schools.com/css/" },
  "adobe xd": { title: "Web Design Basics", link: "https://www.w3schools.com/css/" },
  sketch: { title: "Web Design Basics", link: "https://www.w3schools.com/css/" },
  wireframing: { title: "UX Fundamentals", link: "https://developer.mozilla.org/en-US/docs/Learn" },
  prototyping: { title: "UX Fundamentals", link: "https://developer.mozilla.org/en-US/docs/Learn" },
  "user research": { title: "UX Fundamentals", link: "https://developer.mozilla.org/en-US/docs/Learn" },
  "design systems": { title: "Design Systems & CSS", link: "https://www.w3schools.com/css/" },
  accessibility: { title: "Web Accessibility", link: "https://developer.mozilla.org/en-US/docs/Web/Accessibility" },
  "responsive design": { title: "Responsive Web Design", link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/" },
};

function buildRoadmap(missing) {
  const items = [];
  for (const skill of missing) {
    if (LEARNING_LINKS[skill]) items.push(LEARNING_LINKS[skill]);
  }
  // de-dup by link
  const seen = new Set();
  const out = [];
  for (const it of items) {
    if (!seen.has(it.link)) {
      seen.add(it.link);
      out.push(it);
    }
  }
  if (out.length === 0) {
    out.push(
      { title: "Web Development Basics", link: "https://www.w3schools.com/" },
      { title: "freeCodeCamp Curriculum", link: "https://www.freecodecamp.org/learn/" },
      { title: "MDN Web Docs", link: "https://developer.mozilla.org/en-US/docs/Learn" },
    );
  }
  return out.slice(0, 10);
}

/* ---------------- Job recommendations ---------------- */
function buildJobRecommendations(roleKey, matched, score) {
  const titles = {
    "frontend developer": ["Frontend Developer", "React Developer", "UI Engineer", "Web Developer"],
    "backend developer": ["Backend Developer", "Node.js Engineer", "API Developer", "Platform Engineer"],
    "full stack developer": ["Full Stack Developer", "Software Engineer", "Web Application Developer", "Product Engineer"],
    "data scientist": ["Data Scientist", "ML Researcher", "Applied Scientist", "Quantitative Analyst"],
    "data analyst": ["Data Analyst", "Business Analyst", "BI Analyst", "Reporting Analyst"],
    "machine learning engineer": ["ML Engineer", "AI Engineer", "MLOps Engineer", "Applied ML Engineer"],
    "devops engineer": ["DevOps Engineer", "SRE", "Cloud Engineer", "Platform Engineer"],
    "android developer": ["Android Developer", "Mobile Engineer", "Kotlin Developer"],
    "ios developer": ["iOS Developer", "Mobile Engineer", "Swift Developer"],
    "ui ux designer": ["UI/UX Designer", "Product Designer", "Interaction Designer"],
  };
  const list = titles[roleKey] || ["Software Engineer", "Associate Developer", "Junior Engineer", "Technical Analyst"];
  const companies = ["Acme Corp", "Globex", "Initech", "Umbrella", "Hooli", "Stark Industries", "Wayne Enterprises"];
  const levels = score >= 75 ? ["Senior", "Mid-level"] : score >= 50 ? ["Mid-level", "Junior"] : ["Junior", "Trainee"];
  return list.map((t, i) => ({
    title: `${levels[i % levels.length]} ${t}`,
    company: companies[(i * 3) % companies.length],
    matchPercent: Math.max(35, Math.min(98, score - 5 + i * 4)),
    keySkills: matched.slice(0, 5),
    location: ["Remote", "Bangalore, IN", "Berlin, DE", "New York, US"][i % 4],
  }));
}

/* ---------------- Salary insights ---------------- */
function buildSalary(roleKey, score) {
  const base = {
    "frontend developer": 70000,
    "backend developer": 80000,
    "full stack developer": 85000,
    "data scientist": 95000,
    "data analyst": 65000,
    "machine learning engineer": 110000,
    "devops engineer": 95000,
    "android developer": 75000,
    "ios developer": 80000,
    "ui ux designer": 65000,
  }[roleKey] || 60000;

  const factor = 0.7 + (score / 100) * 0.8; // 0.7x .. 1.5x
  const expected = Math.round(base * factor);
  return {
    currency: "USD",
    junior: `$${Math.round(expected * 0.7).toLocaleString()} - $${Math.round(expected * 0.9).toLocaleString()}`,
    mid: `$${Math.round(expected * 0.95).toLocaleString()} - $${Math.round(expected * 1.2).toLocaleString()}`,
    senior: `$${Math.round(expected * 1.3).toLocaleString()} - $${Math.round(expected * 1.7).toLocaleString()}`,
    expectedForYou: `$${Math.round(expected * 0.9).toLocaleString()} - $${Math.round(expected * 1.15).toLocaleString()}`,
    note: score >= 70
      ? "Strong match — you can target the upper bands."
      : score >= 45
        ? "Decent match — target mid bands while closing skill gaps."
        : "Build foundational skills first to unlock higher bands.",
  };
}

/* ---------------- Suggestions / modified resume ---------------- */
function buildSuggestions(missing, matched, jobRole) {
  const out = [];
  if (missing.length) {
    out.push(`Add hands-on projects demonstrating: ${missing.slice(0, 4).join(", ")}.`);
    out.push(`Take a focused course on ${missing[0]} and add a project to your resume.`);
  }
  if (matched.length) {
    out.push(`Quantify your impact with metrics for ${matched.slice(0, 3).join(", ")}.`);
  }
  out.push(`Tailor your resume summary toward "${jobRole}" using role-specific keywords.`);
  out.push("Use strong action verbs (Built, Led, Shipped, Optimized) and bullet points starting with outcomes.");
  out.push("Keep your resume to 1 page if you have <5 years experience.");
  return out;
}

function buildModifiedResume(resumeText, jobRole, matched, missing) {
  const summary = `Aspiring ${jobRole} with hands-on experience in ${matched.slice(0, 5).join(", ") || "modern web technologies"}. Currently expanding expertise in ${missing.slice(0, 3).join(", ") || "advanced concepts"} to deliver production-grade solutions.`;
  const bullets = [
    `Engineered features using ${matched[0] || "core stack"}, improving performance and user experience.`,
    `Collaborated cross-functionally to ship ${jobRole}-aligned deliverables on schedule.`,
    `Wrote clean, tested, documented code following industry best practices.`,
    `Currently learning ${missing[0] || "advanced topics"} via structured roadmap.`,
  ];
  return {
    summary,
    keywordsToAdd: missing.slice(0, 8),
    rewrittenBullets: bullets,
    originalLength: resumeText.length,
  };
}

/* ---------------- Mock interview ---------------- */
function buildMockInterview(roleKey, matched, missing) {
  const generic = [
    "Walk me through your most challenging project.",
    "How do you approach debugging a production issue?",
    "Tell me about a time you disagreed with a teammate. How did you resolve it?",
    "What does clean code mean to you?",
  ];
  const technical = [];
  if (matched.includes("react")) technical.push("Explain the difference between useMemo and useCallback.");
  if (matched.includes("javascript")) technical.push("Explain event loop, microtasks, and macrotasks.");
  if (matched.includes("nodejs")) technical.push("How does Node.js handle concurrency without threads?");
  if (matched.includes("sql")) technical.push("Difference between INNER JOIN and LEFT JOIN with an example.");
  if (matched.includes("python")) technical.push("Explain Python decorators with a real-world use case.");
  if (matched.includes("docker")) technical.push("What is the difference between an image and a container?");
  if (roleKey.includes("data")) technical.push("How do you handle missing data in a dataset?");
  if (roleKey.includes("machine") || roleKey.includes("data scientist")) technical.push("Bias-variance tradeoff — explain with an example.");

  const gap = missing.slice(0, 2).map((m) => `If you don't know ${m} yet, how would you learn it in 30 days?`);

  return [...technical, ...generic, ...gap].slice(0, 10).map((q, i) => ({ id: i + 1, question: q }));
}

/* ---------------- Chatbot ---------------- */
function chatbotReply(message, ctx) {
  const m = normalize(message);
  if (!m) return "Ask me anything about your resume, target role, or learning plan.";
  if (m.includes("improve") || m.includes("better"))
    return `To improve, focus on: ${ctx.missingSkills.slice(0, 5).join(", ") || "advanced topics in your stack"}. Add a project for each.`;
  if (m.includes("salary") || m.includes("pay"))
    return `Expected range for you as a ${ctx.jobRole}: ${ctx.salaryInsights.expectedForYou}. ${ctx.salaryInsights.note}`;
  if (m.includes("job") || m.includes("role"))
    return `Top matches: ${ctx.jobRecommendations.slice(0, 3).map((j) => j.title).join(", ")}.`;
  if (m.includes("skill") || m.includes("gap"))
    return `Missing skills: ${ctx.missingSkills.join(", ") || "none — great coverage!"}. Matched: ${ctx.matchedSkills.slice(0, 6).join(", ")}.`;
  if (m.includes("learn") || m.includes("roadmap") || m.includes("course"))
    return `Start here: ${ctx.learningRoadmap.slice(0, 3).map((r) => r.title).join(" • ")}.`;
  if (m.includes("interview"))
    return `Practice: "${ctx.mockInterviewQuestions[0]?.question || "Tell me about yourself."}"`;
  if (m.includes("score"))
    return `Your match score is ${ctx.score}/100. ${ctx.score >= 70 ? "Strong!" : ctx.score >= 45 ? "Decent — close the gaps." : "Build the basics first."}`;
  if (m.includes("hi") || m.includes("hello") || m.includes("hey"))
    return `Hello! I analyzed your resume for "${ctx.jobRole}". Ask about skills, salary, jobs, or how to improve.`;
  return `I'm focused on your ${ctx.jobRole} journey. Try asking: "How can I improve?", "What's my salary?", or "Show jobs".`;
}

/* ---------------- Routes ---------------- */
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "AI Resume Analyzer API", endpoints: ["POST /analyze", "POST /chat"] });
});

app.post("/analyze", (req, res) => {
  try {
    const { resumeText, jobRole } = req.body || {};
    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      return res.status(400).json({ error: "resumeText must be a string of at least 20 characters." });
    }
    if (!jobRole || typeof jobRole !== "string") {
      return res.status(400).json({ error: "jobRole is required." });
    }

    const { key: roleKey, skills: required } = getRoleSkills(jobRole);
    const found = extractSkills(resumeText);
    const matched = found.filter((s) => required.includes(s));
    const missing = required.filter((s) => !found.includes(s));
    const score = Math.round((matched.length / required.length) * 100);

    const learningRoadmap = buildRoadmap(missing);
    const jobRecommendations = buildJobRecommendations(roleKey, matched, score);
    const salaryInsights = buildSalary(roleKey, score);
    const suggestions = buildSuggestions(missing, matched, jobRole);
    const modifiedResume = buildModifiedResume(resumeText, jobRole, matched, missing);
    const mockInterviewQuestions = buildMockInterview(roleKey, matched, missing);

    const result = {
      jobRole,
      roleKey,
      score,
      matchedSkills: matched,
      missingSkills: missing,
      requiredSkills: required,
      extractedSkills: found,
      suggestions,
      jobRecommendations,
      salaryInsights,
      learningRoadmap,
      modifiedResume,
      mockInterviewQuestions,
      chatbotResponse: `Hi! I analyzed your resume for the role of "${jobRole}". You scored ${score}/100. Ask me how to improve.`,
    };
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error", details: String(err && err.message) });
  }
});

app.post("/chat", (req, res) => {
  try {
    const { message, context } = req.body || {};
    if (!message) return res.status(400).json({ error: "message required" });
    if (!context) return res.status(400).json({ error: "context required (analysis result)" });
    const reply = chatbotReply(message, context);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Internal error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Resume Analyzer API running at http://localhost:${PORT}`);
});