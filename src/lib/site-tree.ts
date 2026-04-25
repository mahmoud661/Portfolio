import { projects } from "../data/projects";

// Derived from actual filenames in assets/certificates/ via the same formatTitle()
// logic used by certificates.ts — kept here so this file works in production builds
// where import.meta.glob is resolved at build time, not runtime.
const CERTIFICATE_TITLES = [
  "Advanced Learning Algorithms",
  "Attention models",
  "Coursera LZLWH8F64RNV",
  "Full stack",
  "Game Develpoment 2D",
  "GitHub foundation DATA CAMP",
  "Machine Learning specialization",
  "NLP Sequence models",
  "NLP with Probabilistic models",
  "Natural Language Processing with Classification",
  "Natural Language processing specialization",
  "Programming with JavaScript",
  "Social Media",
  "Supervised Learning with scikit Learn",
  "Supervised Machine Learning",
  "Unsupervised Learning, Recommenders",
  "Version Control",
  "Certificate",
];

const SKILLS = [
  "JavaScript", "React.js", "TypeScript", "Node.js", "Express.js",
  "MongoDB", "Git & GitHub", "PostgreSQL", "FAST API", "TensorFlow",
  "Socket IO", "CNN", "RNN", "Machine Learning", "Vite", "NLP",
  "pandas", "numpy", "matplotlib", "NestJS", "Tailwind", "NoSQL",
  "Next.js", "UE5",
];

const TIMELINE = [
  "Bachelor of AI & Data Science — Al Hussain Bin Talal University (2021–2025)",
  "Marketing Internship — Pioneer Academy (Jul–Sep 2023)",
  "Web Development Internship — Jordan Webmaster (Jul–Sep 2022)",
  "AI & Data Science Internship — Estarta Solutions (Jul–Sep 2024): face recognition system, NLP autocomplete, React frontends",
];

/**
 * Walk the live DOM and report where each heading/section sits relative to
 * the page top. Called alongside getSiteTree() so the agent knows what
 * is currently visible vs what requires scrolling, on whichever page is loaded.
 */
export function getPagePositions(): string {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const chatbot = document.getElementById("ai-chatbot-container");

  const entries = Array.from(document.querySelectorAll("h1, h2, h3, section"))
    .filter((el) => !chatbot?.contains(el))
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const absTop = Math.round(rect.top + scrollY);
      const inView = rect.top >= -20 && rect.top < vh;
      const text = (el as HTMLElement).innerText
        ?.trim()
        .replace(/\s+/g, " ")
        .slice(0, 70);
      return { tag: el.tagName, text, absTop, inView };
    })
    .filter((e) => e.text && e.text.length > 1);

  if (entries.length === 0) {
    return `## Live Positions (${window.location.pathname})\n  No headings found on this page.`;
  }

  const lines = entries.map((e) =>
    e.inView
      ? `  ${e.tag}: "${e.text}" — visible in viewport`
      : `  ${e.tag}: "${e.text}" — scroll to ~${e.absTop}px from page top`,
  );

  return (
    `## Live Element Positions\n` +
    `   Page: ${window.location.pathname} | Current scroll: ${Math.round(scrollY)}px | Viewport height: ${vh}px\n` +
    lines.join("\n")
  );
}

export function getSiteTree(): string {
  const projectList = projects
    .map(
      (p, i) =>
        `  ${i + 1}. ${p.title} [${p.technologies.join(", ")}]` +
        (p.demo ? ` — Live: ${p.demo}` : "") +
        (p.github ? ` — GitHub: ${p.github}` : "") +
        `\n     ${p.description}`,
    )
    .join("\n");

  return `
# Spotlight Selectors
Use these with spotlight_element(selector, label). Two formats are supported:
  CSS selector:  "div.rounded-xl.bg-card.cursor-pointer"
  Text search:   "text:TAG:content"  →  finds first <TAG> whose text contains "content"

## Home page (/)
  Hero section (name + rotating roles):  "div.flex.flex-col.mb-60"
  Skills overview heading:               "text:h2:What I Do Best"
  Featured projects section:             "section.bg-secondary\\/50"
  Featured certificates heading:         "text:h2:Featured Certificates"
  Download Resume button:                "text:button:Download Resume"

## About page (/about)
  Page hero (My Journey):                "section.text-center.max-w-3xl"
  Skills cloud (24 technology tags):     "div.flex.flex-wrap.justify-center.gap-3"
  Timeline section:                      "section.space-y-24"

## Projects page (/projects)
  Any project card by title:             "text:h3:<project title>"
    e.g. "text:h3:Schema Forge"  or  "text:h3:DevPath"  or  "text:h3:AHU Thesis"
  All project cards container:           "div.grid.grid-cols-1"

## Certificates page (/certificates)
  Any certificate card by title:         "text:h3:<certificate title>"
    e.g. "text:h3:Machine Learning"  or  "text:h3:Advanced Learning Algorithms"

## Contact page (/contact)
  Contact info section:                  "text:h2:Get In Touch"
  Contact form:                          "form"

---

# Portfolio Site Tree

## Navigation
Routes: / (Home)  /about  /projects  /certificates  /contact
trigger_ui_action labels: navigate_home, navigate_about, navigate_projects,
  navigate_certificates, navigate_contact

---

## / — Home
Sections (top to bottom; scroll required past the hero):
  1. HERO (visible on load)
     Name: "Mahmoud Zuriqi"
     Rotating roles: Full Stack Developer / Data Scientist / React Developer
     Download Resume button
  2. SKILLS OVERVIEW (scroll required)
     4 cards: Web Development · UI/UX Design · Backend Development · AI Integration
  3. FEATURED PROJECTS (scroll required)
     Shows only the first 2 projects: AHU Thesis, DevPath
     "View All Projects" link navigates to /projects
  4. FEATURED CERTIFICATES (scroll required)
     Shows only the first 3 certificates
     "View All Certificates" link navigates to /certificates

---

## /about — About
Sections (top to bottom):
  1. BIO (visible on load)
     "As an ambitious fourth-year IT student at Alhussain Bin Talal University, I excel in
     blending academic rigor with practical experience. My focus on AI, data science, and
     full-stack MERN development drives me to create innovative, intelligent solutions while
     delivering seamless user experiences."
  2. SKILLS CLOUD (scroll required)
     ${SKILLS.length} technology tags: ${SKILLS.join(", ")}
  3. JOURNEY TIMELINE (scroll required)
${TIMELINE.map((t) => "     - " + t).join("\n")}

---

## /projects — Projects
  Filter bar (by technology, auto-extracted)
  ${projects.length} projects total — scroll to see all:
${projectList}
  INTERACTION: Each project card is clickable — opens a dialog overlay with full
  description, all technology tags, GitHub link, and live demo link.

---

## /certificates — Certificates
  ${CERTIFICATE_TITLES.length} certificates total — scroll to see all:
${CERTIFICATE_TITLES.map((t, i) => `  ${i + 1}. ${t}`).join("\n")}
  Each certificate opens an inline PDF viewer + "View Full PDF" link.

---

## /contact — Contact
  Entire page visible without scrolling.
  Contact Info:
    Email:    mahmoudzuriqi8@gmail.com
    Phone:    +962776230806
    Location: Jordan
    GitHub:   github.com/mahmoud661
    LinkedIn: linkedin.com/in/mahmoudzuriqi/
  Contact Form: Name field · Email field · Message field · Send button
`.trim();
}
