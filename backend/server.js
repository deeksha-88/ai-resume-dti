/**
 * AI Resume Analyzer - Express Backend
 *
 * Run:
 *   cd backend && npm install && npm start
 * Server runs on http://localhost:5000
 */

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

/* ---------------- Skill database per role ---------------- */
const ROLE_SKILLS = {
  "frontend developer": ["html","css","javascript","typescript","react","redux","tailwind","nextjs","git","rest api","responsive design","accessibility"],
  "backend developer": ["nodejs","express","mongodb","sql","postgresql","rest api","graphql","docker","redis","authentication","git","typescript"],
  "full stack developer": ["html","css","javascript","typescript","react","nodejs","express","mongodb","sql","git","docker","rest api"],
  "data scientist": ["python","pandas","numpy","scikit-learn","tensorflow","pytorch","sql","statistics","machine learning","deep learning","data visualization","jupyter"],
  "data analyst": ["excel","sql","python","tableau","power bi","pandas","statistics","data visualization","etl","reporting"],
  "machine learning engineer": ["python","tensorflow","pytorch","scikit-learn","mlops","docker","kubernetes","aws","sql","deep learning","nlp","computer vision"],
  "devops engineer": ["linux","docker","kubernetes","aws","azure","terraform","jenkins","ci/cd","bash","python","ansible","monitoring"],
  "android developer": ["kotlin","java","android studio","jetpack compose","xml","firebase","rest api","git","mvvm"],
  "ios developer": ["swift","swiftui","xcode","objective-c","core data","rest api","git","uikit"],
  "ui ux designer": ["figma","adobe xd","sketch","wireframing","prototyping","user research","design systems","html","css"],
};

// Skill aliases — many resumes write "Node" not "nodejs", "JS" not "javascript"
const SKILL_ALIASES = {
  "javascript": ["javascript","js","ecmascript","es6","es2015"],
  "typescript": ["typescript","ts"],
  "nodejs": ["nodejs","node.js","node js","node"],
  "reactjs": ["reactjs","react.js","react"],
  "react": ["react","reactjs","react.js"],
  "nextjs": ["nextjs","next.js","next js"],
  "express": ["express","express.js","expressjs"],
  "mongodb": ["mongodb","mongo"],
  "postgresql": ["postgresql","postgres","psql"],
  "rest api": ["rest api","restful","rest","api"],
  "machine learning": ["machine learning","ml"],
  "deep learning": ["deep learning","dl","neural network","neural networks"],
  "scikit-learn": ["scikit-learn","scikit learn","sklearn"],
  "ci/cd": ["ci/cd","cicd","ci cd","continuous integration"],
  "power bi": ["power bi","powerbi"],
  "html": ["html","html5"],
  "css": ["css","css3"],
  "tailwind": ["tailwind","tailwindcss","tailwind css"],
  "data visualization": ["data visualization","data viz","matplotlib","seaborn","ggplot"],
  "responsive design": ["responsive design","responsive","mobile first","mobile-first"],
  "user research": ["user research","ux research"],
  "design systems": ["design systems","design system"],
  "objective-c": ["objective-c","objective c","objc"],
  "core data": ["core data","coredata"],
  "android studio": ["android studio","android"],
  "jetpack compose": ["jetpack compose","compose"],
  "adobe xd": ["adobe xd","xd"],
};

// Skills that don't appear directly in SKILL_ALIASES — generate sensible defaults
function getVariants(skill) {
  if (SKILL_ALIASES[skill]) return SKILL_ALIASES[skill];
  const v = new Set([skill]);
  v.add(skill.replace(/[-/]/g, " "));
  v.add(skill.replace(/\s+/g, ""));
  v.add(skill.replace(/\s+/g, "-"));
  return Array.from(v);
}

const DEFAULT_SKILLS = ["communication","teamwork","problem solving","git","rest api","javascript","python","sql"];

function normalize(str) { return (str || "").toLowerCase(); }

/* Robust skill extraction with aliases */
function extractSkills(resumeText) {
  const text = " " + normalize(resumeText).replace(/[^\w\s./+#-]/g, " ").replace(/\s+/g, " ") + " ";
  const allSkills = new Set();
  Object.values(ROLE_SKILLS).forEach((arr) => arr.forEach((s) => allSkills.add(s)));
  DEFAULT_SKILLS.forEach((s) => allSkills.add(s));

  const found = new Set();
  for (const skill of allSkills) {
    const variants = getVariants(skill);
    for (const v of variants) {
      const esc = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`(^|[^a-z0-9+#])${esc}([^a-z0-9+#]|$)`, "i");
      if (re.test(text)) { found.add(skill); break; }
    }
  }
  return Array.from(found);
}

function getRoleSkills(jobRole) {
  const key = normalize(jobRole).trim();
  if (ROLE_SKILLS[key]) return { key, skills: ROLE_SKILLS[key] };
  for (const k of Object.keys(ROLE_SKILLS)) {
    if (key.includes(k) || k.includes(key)) return { key: k, skills: ROLE_SKILLS[k] };
  }
  // Token fallback
  const tokens = key.split(/\s+/);
  for (const k of Object.keys(ROLE_SKILLS)) {
    if (tokens.some((t) => t && k.includes(t))) return { key: k, skills: ROLE_SKILLS[k] };
  }
  return { key: key || "generic", skills: DEFAULT_SKILLS };
}

/* ---------------- Learning roadmap ---------------- */
const LEARNING_LINKS = {
  javascript: { title: "Learn JavaScript", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
  typescript: { title: "TypeScript Handbook", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  html: { title: "HTML Tutorial", link: "https://www.w3schools.com/html/" },
  css: { title: "CSS Tutorial", link: "https://www.w3schools.com/css/" },
  react: { title: "Learn React", link: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
  redux: { title: "Redux Basics", link: "https://www.freecodecamp.org/news/tag/redux/" },
  tailwind: { title: "Tailwind via CSS", link: "https://www.w3schools.com/css/" },
  nextjs: { title: "Next.js & React", link: "https://www.freecodecamp.org/news/tag/next-js/" },
  nodejs: { title: "Node.js Tutorial", link: "https://www.w3schools.com/nodejs/" },
  express: { title: "Express on Node.js", link: "https://www.w3schools.com/nodejs/nodejs_modules.asp" },
  mongodb: { title: "MongoDB Basics", link: "https://www.w3schools.com/mongodb/" },
  sql: { title: "SQL Tutorial", link: "https://www.w3schools.com/sql/" },
  postgresql: { title: "PostgreSQL via SQL", link: "https://www.w3schools.com/sql/" },
  graphql: { title: "GraphQL Intro", link: "https://www.freecodecamp.org/news/tag/graphql/" },
  docker: { title: "Docker for Devs", link: "https://www.freecodecamp.org/news/tag/docker/" },
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
  "machine learning": { title: "Machine Learning", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
  "deep learning": { title: "Deep Learning", link: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
  "data visualization": { title: "Data Viz with Python", link: "https://www.w3schools.com/python/matplotlib_intro.asp" },
  jupyter: { title: "Python in Jupyter", link: "https://www.w3schools.com/python/" },
  excel: { title: "Excel Tutorial", link: "https://www.w3schools.com/excel/" },
  tableau: { title: "Data Analysis with Python", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
  "power bi": { title: "Data Analysis", link: "https://www.freecodecamp.org/learn/data-analysis-with-python/" },
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
  firebase: { title: "Firebase Basics", link: "https://www.freecodecamp.org/news/tag/firebase/" },
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
  for (const skill of missing) if (LEARNING_LINKS[skill]) items.push(LEARNING_LINKS[skill]);
  const seen = new Set(); const out = [];
  for (const it of items) if (!seen.has(it.link)) { seen.add(it.link); out.push(it); }
  if (!out.length) out.push(
    { title: "Web Development Basics", link: "https://www.w3schools.com/" },
    { title: "freeCodeCamp Curriculum", link: "https://www.freecodecamp.org/learn/" },
    { title: "MDN Web Docs", link: "https://developer.mozilla.org/en-US/docs/Learn" },
  );
  return out.slice(0, 10);
}

/* ---------------- Job recommendations ---------------- */
function buildJobRecommendations(roleKey, matched, score, jobRole) {
  const titles = {
    "frontend developer": ["Frontend Developer","React Developer","UI Engineer","Web Developer"],
    "backend developer": ["Backend Developer","Node.js Engineer","API Developer","Platform Engineer"],
    "full stack developer": ["Full Stack Developer","Software Engineer","Web App Developer","Product Engineer"],
    "data scientist": ["Data Scientist","ML Researcher","Applied Scientist","Quantitative Analyst"],
    "data analyst": ["Data Analyst","Business Analyst","BI Analyst","Reporting Analyst"],
    "machine learning engineer": ["ML Engineer","AI Engineer","MLOps Engineer","Applied ML Engineer"],
    "devops engineer": ["DevOps Engineer","SRE","Cloud Engineer","Platform Engineer"],
    "android developer": ["Android Developer","Mobile Engineer","Kotlin Developer"],
    "ios developer": ["iOS Developer","Mobile Engineer","Swift Developer"],
    "ui ux designer": ["UI/UX Designer","Product Designer","Interaction Designer"],
  };
  const list = titles[roleKey] || [jobRole, `Associate ${jobRole}`, `Junior ${jobRole}`, "Technical Analyst"];
  const companies = ["Acme Corp","Globex","Initech","Umbrella","Hooli","Stark Industries","Wayne Enterprises"];
  const levels = score >= 75 ? ["Senior","Mid-level"] : score >= 50 ? ["Mid-level","Junior"] : ["Junior","Trainee"];
  return list.map((t, i) => ({
    title: `${levels[i % levels.length]} ${t}`,
    company: companies[(i * 3) % companies.length],
    matchPercent: Math.max(35, Math.min(98, score - 5 + i * 4)),
    keySkills: matched.slice(0, 5),
    location: ["Remote","Bangalore, IN","Hyderabad, IN","Pune, IN"][i % 4],
  }));
}

/* ---------------- Salary insights (INR / LPA) ---------------- */
function buildSalary(roleKey, score, jobRole) {
  // Indian market base in LPA (lakhs per annum)
  const baseLPA = {
    "frontend developer": 8,
    "backend developer": 10,
    "full stack developer": 12,
    "data scientist": 14,
    "data analyst": 7,
    "machine learning engineer": 16,
    "devops engineer": 14,
    "android developer": 9,
    "ios developer": 10,
    "ui ux designer": 7,
  }[roleKey] || 6;

  const factor = 0.7 + (score / 100) * 0.8;
  const expected = +(baseLPA * factor).toFixed(1);
  const fmt = (n) => `₹${(+n.toFixed(1))} LPA`;
  const range = (a, b) => `₹${+a.toFixed(1)} - ₹${+b.toFixed(1)} LPA`;

  return {
    currency: "INR",
    role: jobRole,
    junior: range(expected * 0.5, expected * 0.8),
    mid: range(expected * 0.95, expected * 1.3),
    senior: range(expected * 1.5, expected * 2.2),
    expectedForYou: range(expected * 0.9, expected * 1.15),
    average: fmt(expected),
    note:
      score >= 70 ? "Strong match — you can target the upper bands."
      : score >= 45 ? "Decent match — target mid bands while closing skill gaps."
      : "Build foundational skills first to unlock higher bands.",
  };
}

/* ---------------- Suggestions / modified resume ---------------- */
function buildSuggestions(missing, matched, jobRole) {
  const out = [];
  if (missing.length) {
    out.push(`Add hands-on projects demonstrating: ${missing.slice(0, 4).join(", ")}.`);
    out.push(`Take a focused course on ${missing[0]} and showcase a project on your resume.`);
  }
  if (matched.length) out.push(`Quantify your impact with metrics for ${matched.slice(0, 3).join(", ")}.`);
  out.push(`Tailor your resume summary toward "${jobRole}" using role-specific keywords.`);
  out.push("Use strong action verbs (Built, Led, Shipped, Optimized) and start bullets with outcomes.");
  out.push("Keep your resume to 1 page if you have under 5 years of experience.");
  return out;
}

/* Generate improved bullet points dynamically based on resume content */
function buildModifiedResume(resumeText, jobRole, matched, missing) {
  const text = resumeText.toLowerCase();
  // Detect experience signals
  const hasInternship = /intern(ship)?/.test(text);
  const hasProject = /project|portfolio|github/.test(text);
  const hasLeadership = /lead|led|managed|mentor|head/.test(text);
  const hasTeam = /team|collaborat|cross[- ]functional/.test(text);
  const yearsMatch = text.match(/(\d+)\s*\+?\s*years?/);
  const years = yearsMatch ? parseInt(yearsMatch[1], 10) : null;

  const top = matched.slice(0, 3);
  const stack = top.length ? top.join(", ") : "modern technologies";
  const seniorityHint = years ? `${years}+ years` : (matched.length >= 5 ? "solid" : "emerging");

  const summary = `${seniorityHint} ${jobRole} with hands-on experience in ${stack}${
    matched.length > 3 ? ` and ${matched.slice(3, 6).join(", ")}` : ""
  }. Focused on shipping production-grade work, with active learning in ${missing.slice(0, 3).join(", ") || "advanced topics"} to align with ${jobRole} expectations.`;

  const bullets = [];
  if (top[0]) bullets.push(`Built and shipped features using ${top[0]}, improving performance by ~30% and reducing user-reported bugs.`);
  if (top[1]) bullets.push(`Implemented ${top[1]}-based modules that handle 10k+ requests/day with 99.9% reliability.`);
  if (top[2]) bullets.push(`Designed and tested ${top[2]} workflows, cutting delivery time by ~25% across the team.`);
  if (hasProject) bullets.push(`Delivered end-to-end ${jobRole} projects from design to deployment, documented on GitHub for peer review.`);
  if (hasInternship) bullets.push(`During internship, contributed to live ${stack} codebase used by paying customers, merging 20+ pull requests.`);
  if (hasLeadership) bullets.push(`Led a small squad through agile sprints, mentoring juniors and unblocking technical decisions on ${stack}.`);
  if (hasTeam) bullets.push(`Collaborated cross-functionally with design, product, and QA to ship ${jobRole}-aligned releases on schedule.`);
  if (missing[0]) bullets.push(`Currently upskilling in ${missing.slice(0, 2).join(" and ")} via structured roadmap, with weekly project deliverables.`);
  bullets.push(`Wrote clean, tested, documented code following ${jobRole} industry best practices and code-review standards.`);

  // Deduplicate & cap
  const seen = new Set(); const uniq = [];
  for (const b of bullets) if (!seen.has(b)) { seen.add(b); uniq.push(b); }

  return {
    summary,
    keywordsToAdd: missing.slice(0, 8),
    rewrittenBullets: uniq.slice(0, 7),
    skillsSection: matched.length
      ? `Skills: ${matched.join(", ")}${missing.length ? ` | Learning: ${missing.slice(0,4).join(", ")}` : ""}.`
      : `Skills: actively building foundations in ${missing.slice(0,5).join(", ") || jobRole + " stack"}.`,
    experienceSection: uniq.slice(0, 5).map((b) => `• ${b}`).join("\n"),
    fullResume: [
      `=== ${jobRole.toUpperCase()} — IMPROVED RESUME ===`,
      ``,
      `SUMMARY`,
      summary,
      ``,
      `SKILLS`,
      matched.length ? matched.join(", ") : "(building foundations)",
      missing.length ? `Currently learning: ${missing.slice(0,5).join(", ")}` : "",
      ``,
      `EXPERIENCE / PROJECTS`,
      ...uniq.slice(0, 6).map((b) => `• ${b}`),
      ``,
      `KEYWORDS TO INCLUDE`,
      (missing.slice(0, 8).join(", ")) || "(your resume already covers role keywords)",
    ].filter(Boolean).join("\n"),
    originalLength: resumeText.length,
  };
}

/* ---------------- Mock interview question bank ---------------- */
function buildMockInterview(roleKey, matched, missing, jobRole) {
  const generic = [
    "Tell me about yourself and why you're interested in this role.",
    "Walk me through your most challenging project and what you learned from it.",
    "How do you approach debugging a production issue under time pressure?",
    "Tell me about a time you disagreed with a teammate. How did you resolve it?",
    "What does clean, maintainable code mean to you?",
    "Where do you see yourself in 3 years, and how does this role fit in?",
  ];
  const technical = [];
  if (matched.includes("react")) technical.push("Explain the difference between useMemo and useCallback with an example.");
  if (matched.includes("javascript")) technical.push("Explain the JavaScript event loop, microtasks, and macrotasks.");
  if (matched.includes("typescript")) technical.push("When would you use generics in TypeScript? Give a real example.");
  if (matched.includes("nodejs")) technical.push("How does Node.js handle concurrency without threads?");
  if (matched.includes("express")) technical.push("Walk through how you'd structure error handling middleware in Express.");
  if (matched.includes("sql") || matched.includes("postgresql")) technical.push("Explain the difference between INNER JOIN and LEFT JOIN with an example.");
  if (matched.includes("mongodb")) technical.push("When would you choose MongoDB over a relational database?");
  if (matched.includes("python")) technical.push("Explain Python decorators with a real-world use case.");
  if (matched.includes("docker")) technical.push("What's the difference between an image and a container?");
  if (matched.includes("kubernetes")) technical.push("Explain Pods, Deployments, and Services in Kubernetes.");
  if (matched.includes("git")) technical.push("Walk through how you'd resolve a difficult merge conflict.");
  if (matched.includes("rest api")) technical.push("How do you design a REST API that's versionable and backwards-compatible?");
  if (roleKey.includes("data")) technical.push("How do you handle missing data in a real-world dataset?");
  if (roleKey.includes("machine") || roleKey.includes("data scientist")) technical.push("Explain the bias-variance tradeoff with an example.");
  if (roleKey.includes("devops")) technical.push("How would you set up a zero-downtime CI/CD pipeline?");

  const gap = missing.slice(0, 2).map((m) => `If you don't know ${m} yet, how would you learn it in 30 days?`);

  const scenario = [
    `Imagine you're a ${jobRole} and a stakeholder asks for a feature that violates best practices. How do you respond?`,
    `You inherit a legacy ${matched[0] || "codebase"} with no tests. What's your first 2 weeks?`,
  ];

  // Mix: 2 generic + all relevant technical + scenarios + gap
  const ordered = [generic[0], generic[1], ...technical.slice(0, 4), scenario[0], ...generic.slice(2, 4), ...gap, scenario[1], ...technical.slice(4)];
  const seen = new Set(); const uniq = [];
  for (const q of ordered) if (q && !seen.has(q)) { seen.add(q); uniq.push(q); }
  return uniq.slice(0, 10).map((question, i) => ({ id: i + 1, question }));
}

/* ---------------- Chatbot (rich keyword + dynamic) ---------------- */
function chatbotReply(message, ctx) {
  const m = normalize(message);
  if (!m) return "Ask me anything about your resume, target role, salary, jobs, or how to improve.";

  const has = (...words) => words.some((w) => m.includes(w));

  if (has("hi","hello","hey","yo","hola"))
    return `Hello! I analyzed your resume for "${ctx.jobRole}" — you scored ${ctx.score}/100. Ask about skills, salary, jobs, interview, or how to improve.`;

  if (has("score","rating","match"))
    return `Your match score is ${ctx.score}/100 for ${ctx.jobRole}. ${ctx.score >= 70 ? "That's strong — you're competitive." : ctx.score >= 45 ? "Decent base — close 2-3 key gaps to push past 70." : "Foundational gaps — start with the roadmap."}`;

  if (has("improve","better","upgrade","enhance","optimi"))
    return `Top 3 ways to improve for ${ctx.jobRole}: 1) Build projects in ${ctx.missingSkills.slice(0,2).join(", ") || "your weak areas"}. 2) Add quantified bullet points (numbers, %). 3) Use the keywords: ${ctx.modifiedResume.keywordsToAdd.slice(0,5).join(", ") || "role-specific terms"}.`;

  if (has("salary","pay","ctc","package","lpa","compensation","earn"))
    return `For ${ctx.jobRole} in India: expected for you ${ctx.salaryInsights.expectedForYou}. Junior ${ctx.salaryInsights.junior}, Mid ${ctx.salaryInsights.mid}, Senior ${ctx.salaryInsights.senior}. ${ctx.salaryInsights.note}`;

  if (has("job","role","position","openings","hiring","vacancy","apply"))
    return `Top matches for you: ${ctx.jobRecommendations.slice(0,3).map((j)=>`${j.title} @ ${j.company} (${j.matchPercent}%)`).join(" • ")}.`;

  if (has("skill","gap","missing","required","tech","stack"))
    return `Required skills for ${ctx.jobRole}: ${ctx.requiredSkills.join(", ")}. ✅ You have: ${ctx.matchedSkills.join(", ") || "—"}. ⚠️ Missing: ${ctx.missingSkills.join(", ") || "none, great coverage!"}.`;

  if (has("learn","roadmap","course","study","tutorial","resource"))
    return `Start here: ${ctx.learningRoadmap.slice(0,4).map((r)=>`${r.title} (${r.link})`).join(" • ")}.`;

  if (has("interview","question","prepare","practice"))
    return `Interview prep for ${ctx.jobRole}: practice these — ${ctx.mockInterviewQuestions.slice(0,3).map((q,i)=>`Q${i+1}: ${q.question}`).join(" | ")}. Open the Mock Interview tab for the full interactive flow with feedback.`;

  if (has("demand","market","trend","scope","future","growth","hiring trend"))
    return `Job demand for ${ctx.jobRole}: this role is actively hired across India (Bangalore, Hyderabad, Pune, Remote). Your match (${ctx.score}/100) means ${ctx.score>=70?"you can apply now to mid/senior roles.":ctx.score>=45?"you're competitive for junior/mid roles — close 1-2 gaps for better offers.":"focus on building 2-3 portfolio projects in "+(ctx.missingSkills.slice(0,2).join(", ")||"core skills")+" before applying."}`;

  if (has("resume","cv","bullet","summary","rewrite","modify"))
    return `Improved summary: "${ctx.modifiedResume.summary}" — Top rewritten bullet: "${ctx.modifiedResume.rewrittenBullets?.[0]||"see Modified Resume tab"}". Keywords to add: ${ctx.modifiedResume.keywordsToAdd.slice(0,5).join(", ")||"(none — good coverage!)"}.`;

  if (has("project","build","portfolio"))
    return `Build a project that uses ${ctx.missingSkills[0] || ctx.matchedSkills[0] || "your stack"} end-to-end and ship it publicly. Document the trade-offs in the README.`;

  if (has("thank","thanks","thx"))
    return `You're welcome! Anything else about your ${ctx.jobRole} journey?`;

  if (has("who","what are you","your name"))
    return `I'm your AI Resume Assistant, focused on your ${ctx.jobRole} goals. Ask about skills, salary, jobs, interview, or improvements.`;

  // Fallback: try to use any resume keyword the user mentioned
  const mentioned = ctx.requiredSkills.find((s) => m.includes(s));
  if (mentioned) {
    const have = ctx.matchedSkills.includes(mentioned);
    return have
      ? `${mentioned} is already on your resume — good. To stand out, add a project metric (e.g., "${mentioned}: cut latency by 30%").`
      : `${mentioned} is a gap for ${ctx.jobRole}. Plan: 1) take a short course, 2) build a small project, 3) add a quantified bullet point.`;
  }

  return `I focus on your ${ctx.jobRole} journey. Try: "How can I improve?", "What's my salary?", "Show jobs", "Show roadmap", "What's my score?", "Interview question".`;
}

/* ---------------- Routes ---------------- */
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "AI Resume Analyzer API", endpoints: ["POST /analyze","POST /chat","POST /interview/next"] });
});

app.post("/analyze", (req, res) => {
  try {
    const { resumeText, jobRole } = req.body || {};
    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20)
      return res.status(400).json({ error: "resumeText must be a string of at least 20 characters." });
    if (!jobRole || typeof jobRole !== "string")
      return res.status(400).json({ error: "jobRole is required." });

    const { key: roleKey, skills: required } = getRoleSkills(jobRole);
    const found = extractSkills(resumeText);
    const matched = found.filter((s) => required.includes(s));
    const missing = required.filter((s) => !found.includes(s));

    // Score is STRICTLY derived from matched vs required role skills.
    // Invariants:
    //   - matched.length === 0  =>  score === 0
    //   - score > 0             =>  matched.length > 0
    const matchedPercentage = required.length ? Math.round((matched.length / required.length) * 100) : 0;
    const missingPercentage = required.length ? (100 - matchedPercentage) : 0;
    let score = matched.length === 0 ? 0 : matchedPercentage;
    score = Math.max(0, Math.min(100, score));

    const skillDistribution = {
      matchedPercentage,
      missingPercentage,
      pieData: [
        { name: "Matched", value: matched.length, percentage: matchedPercentage },
        { name: "Missing", value: missing.length, percentage: missingPercentage },
      ],
    };

    const learningRoadmap = buildRoadmap(missing);
    const jobRecommendations = buildJobRecommendations(roleKey, matched, score, jobRole);
    const salaryInsights = buildSalary(roleKey, score, jobRole);
    const suggestions = buildSuggestions(missing, matched, jobRole);
    const modifiedResume = buildModifiedResume(resumeText, jobRole, matched, missing);
    const mockInterviewQuestions = buildMockInterview(roleKey, matched, missing, jobRole);

    res.json({
      jobRole, roleKey, score,
      matchedSkills: matched, missingSkills: missing,
      requiredSkills: required, extractedSkills: found,
      matchedPercent: matchedPercentage,
      missingPercent: missingPercentage,
      skillDistribution,
      suggestions, jobRecommendations, salaryInsights,
      learningRoadmap, modifiedResume, mockInterviewQuestions,
      chatbotResponse: `Hi! I analyzed your resume for "${jobRole}". You scored ${score}/100. Ask me how to improve, your salary range, or top job matches.`,
    });
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
    res.json({ reply: chatbotReply(message, context) });
  } catch {
    res.status(500).json({ error: "Internal error" });
  }
});

/* Interactive interview: returns next question + optional feedback on previous answer */
app.post("/interview/next", (req, res) => {
  try {
    const { questions, currentIndex, answer, jobRole } = req.body || {};
    if (!Array.isArray(questions) || !questions.length)
      return res.status(400).json({ error: "questions array required" });

    const idx = Number.isInteger(currentIndex) ? currentIndex : -1;
    let feedback = null;

    if (idx >= 0 && answer && typeof answer === "string") {
      const len = answer.trim().length;
      const hasNumbers = /\d/.test(answer);
      const hasExample = /(e\.g\.|for example|such as|like when|once|i built|i led|i made)/i.test(answer);
      if (len < 30) feedback = "Your answer is quite short. Add a specific example and the impact you delivered.";
      else if (!hasExample) feedback = "Good start — strengthen it with a concrete example or project you worked on.";
      else if (!hasNumbers) feedback = "Solid answer. Add a metric (numbers, %, time saved) to make it more impactful.";
      else feedback = "Strong answer — specific, with example and metrics. Keep this style for the next one.";
    }

    const nextIndex = idx + 1;
    const finished = nextIndex >= questions.length;
    res.json({
      feedback,
      finished,
      nextIndex: finished ? null : nextIndex,
      nextQuestion: finished ? null : questions[nextIndex],
      summary: finished
        ? `You've completed the mock interview for ${jobRole || "your role"}. Review the feedback above and refine the weakest answers.`
        : null,
    });
  } catch {
    res.status(500).json({ error: "Internal error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Resume Analyzer API on http://localhost:${PORT}`));
