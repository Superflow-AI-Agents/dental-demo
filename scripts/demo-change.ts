// Applies or removes a known demo change in content/, so a push to main makes Vercel deploy
// and Site Care re-check the changed page. The "Demo change" GitHub Action runs this.
// Run locally:  pnpm demo:change <type>
//
// Types:
//   broken-link       /new-patients button points at a page that does not exist
//   missing-alt-text  /about hero photo loses its alt text
//   low-contrast      /insurance-and-financing intro text turns pale grey on the light background
//   typo              /services intro paragraph gets three spelling mistakes
//   content-update    / gets a numbered, dated update line (a new number on every run, no issue)
//   all-issues        every issue type above in one go (not content-update)
//   reset             removes every demo change, so content/ is back to the clean files
//
// Every edit is an exact string swap. If neither the clean text nor the changed text is found,
// the script stops with an error instead of guessing. Applying a type twice changes nothing.
//
// Inside GitHub Actions it writes the commit message to $GITHUB_OUTPUT (key "message") and a
// plain-words report to $GITHUB_STEP_SUMMARY. Locally it prints both.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_URL = "https://dental-demo-coral.vercel.app";
const DEPLOYMENTS_URL = "https://vercel.com/velt-team-eng/dental-demo/deployments";

type Edit = { file: string; clean: string; changed: string };
type Issue = {
  file: string;
  page: string;
  what: string;
  check: string;
  edits: Edit[];
};

const ISSUES: Record<string, Issue> = {
  "broken-link": {
    file: "content/pages/new-patients.md",
    page: "/new-patients",
    what: 'The "Book your first visit" button now goes to /book-online-now, a page that does not exist.',
    check: "Link Checker",
    edits: [
      {
        file: "content/pages/new-patients.md",
        clean: '<a class="btn" href="/book">Book your first visit</a>',
        changed: '<a class="btn" href="/book-online-now">Book your first visit</a>',
      },
    ],
  },
  "missing-alt-text": {
    file: "content/pages/about.md",
    page: "/about",
    what: "The photo at the top of the page no longer has alt text.",
    check: "Accessibility Checker and Image Inspector",
    edits: [
      {
        file: "content/pages/about.md",
        clean: '<img src="/media/pages/about.jpg" alt="Clean treatment room with a dental chair facing a large window" width="1200" height="800">',
        changed: '<img src="/media/pages/about.jpg" width="1200" height="800">',
      },
    ],
  },
  "low-contrast": {
    file: "content/pages/insurance-and-financing.md",
    page: "/insurance-and-financing",
    what: "The intro sentence under the main heading is now pale grey on the light background and hard to read.",
    check: "Accessibility Checker",
    edits: [
      {
        file: "content/pages/insurance-and-financing.md",
        clean: '<p class="hero-sub">We check your benefits',
        changed: '<p class="hero-sub" style="color: #cfd3d1">We check your benefits',
      },
    ],
  },
  typo: {
    file: "content/pages/services.md",
    page: "/services",
    what: 'The intro paragraph now has three spelling mistakes: "tretment", "optoins" and "writen".',
    check: "Proofreader",
    edits: [
      {
        file: "content/pages/services.md",
        clean:
          "Every treatment starts with an exam and a plain-words conversation about your options, including the option to wait. Before we begin anything beyond a routine visit, you get a written plan with costs",
        changed:
          "Every tretment starts with an exam and a plain-words conversation about your optoins, including the option to wait. Before we begin anything beyond a routine visit, you get a writen plan with costs",
      },
    ],
  },
};
const ISSUE_TYPES = Object.keys(ISSUES);

// content-update: a numbered line on the home page. Each run raises the number, so there is
// always a real diff. It sits between the whitening banner and the stats row.
const UPDATE_FILE = "content/pages/index.md";
const UPDATE_ANCHOR = '</div>\n\n<div class="stat-row">';
const UPDATE_LINE = /<\/div>\n\n<p>Practice update (\d+), [^<\n]*<\/p>\n\n<div class="stat-row">/;

const TYPES = [...ISSUE_TYPES, "content-update", "all-issues", "reset"];

function fail(message: string): never {
  console.error(`demo-change: ${message}`);
  process.exit(1);
}

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

const files = new Map<string, string>();
function read(file: string): string {
  if (!files.has(file)) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) fail(`${file} does not exist. Run this from the repo root.`);
    files.set(file, fs.readFileSync(full, "utf8"));
  }
  return files.get(file)!;
}

// Returns true when the file text changed.
function swap(edit: Edit, direction: "apply" | "revert"): boolean {
  const from = direction === "apply" ? edit.clean : edit.changed;
  const to = direction === "apply" ? edit.changed : edit.clean;
  const text = read(edit.file);
  const fromCount = count(text, from);
  const toCount = count(text, to);
  if (fromCount === 1) {
    files.set(edit.file, text.replace(from, to));
    return true;
  }
  if (fromCount === 0 && toCount === 1) return false;
  fail(
    `expected exactly one of these in ${edit.file} and found ${fromCount} and ${toCount}. ` +
      `The content changed since this script was written, so update scripts/demo-change.ts.\n` +
      `  looking for: ${JSON.stringify(from)}\n  or already:  ${JSON.stringify(to)}`,
  );
}

function contentUpdate(): { number: number; line: string } {
  const text = read(UPDATE_FILE);
  const match = text.match(UPDATE_LINE);
  const number = match ? Number(match[1]) + 1 : 1;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const line = `<p>Practice update ${number}, ${date}: we refreshed the details on this page.</p>`;
  const replacement = `</div>\n\n${line}\n\n<div class="stat-row">`;
  if (match) {
    files.set(UPDATE_FILE, text.replace(UPDATE_LINE, replacement));
  } else {
    if (count(text, UPDATE_ANCHOR) !== 1) {
      fail(`expected the banner and stats row once in ${UPDATE_FILE}. Update scripts/demo-change.ts.`);
    }
    files.set(UPDATE_FILE, text.replace(UPDATE_ANCHOR, replacement));
  }
  return { number, line };
}

function removeContentUpdate(): boolean {
  const text = read(UPDATE_FILE);
  if (!UPDATE_LINE.test(text)) {
    if (count(text, UPDATE_ANCHOR) !== 1) {
      fail(`expected the banner and stats row once in ${UPDATE_FILE}. Update scripts/demo-change.ts.`);
    }
    return false;
  }
  files.set(UPDATE_FILE, text.replace(UPDATE_LINE, UPDATE_ANCHOR));
  return true;
}

function writeAll() {
  for (const [file, text] of files) {
    const full = path.join(ROOT, file);
    if (fs.readFileSync(full, "utf8") !== text) fs.writeFileSync(full, text);
  }
}

function pageLink(page: string): string {
  return `[${page}](${SITE_URL}${page === "/" ? "" : page})`;
}

function main() {
  const type = process.argv[2];
  if (!type || !TYPES.includes(type)) fail(`unknown type "${type ?? ""}". Use one of: ${TYPES.join(", ")}`);

  let message = "";
  const rows: string[] = [];

  if (type === "reset") {
    const reverted: string[] = [];
    for (const key of ISSUE_TYPES) {
      const changed = ISSUES[key].edits.map((e) => swap(e, "revert")).some(Boolean);
      if (changed) reverted.push(key);
    }
    if (removeContentUpdate()) reverted.push("content-update");
    message = `demo(reset): remove demo changes (${reverted.join(", ") || "none"})`;
    for (const key of reverted) {
      const page = key === "content-update" ? "/" : ISSUES[key].page;
      const what = key === "content-update" ? "Removed the practice update line." : `Removed: ${ISSUES[key].what}`;
      rows.push(`| ${key} | ${pageLink(page)} | ${what} | Its earlier finding should no longer appear on this page. |`);
    }
  } else if (type === "content-update") {
    const { number } = contentUpdate();
    message = `demo(content-update): practice update ${number} line on the home page`;
    rows.push(
      `| content-update | ${pageLink("/")} | Added or renumbered the line "Practice update ${number}" under the whitening banner. | Nothing new. This change has no issue in it. |`,
    );
  } else {
    const keys = type === "all-issues" ? ISSUE_TYPES : [type];
    const applied: string[] = [];
    for (const key of keys) {
      const changed = ISSUES[key].edits.map((e) => swap(e, "apply")).some(Boolean);
      if (changed) applied.push(key);
      const issue = ISSUES[key];
      rows.push(`| ${key} | ${pageLink(issue.page)} | ${issue.what}${changed ? "" : " (already in place)"} | ${issue.check} |`);
    }
    message =
      type === "all-issues"
        ? `demo(all-issues): ${applied.join(", ") || "none"} on ${keys.map((k) => ISSUES[k].page).join(", ")}`
        : `demo(${type}): ${ISSUES[type].page} ${type.replace(/-/g, " ")}`;
  }

  writeAll();

  const summary = [
    `## Demo change: ${type}`,
    "",
    "| Type | Page | What changed | Check that should flag it |",
    "|---|---|---|---|",
    ...rows,
    "",
    `Live site: ${SITE_URL}`,
    "",
    `Deployments: ${DEPLOYMENTS_URL}`,
    "",
  ].join("\n");

  const out = process.env.GITHUB_OUTPUT;
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (out) fs.appendFileSync(out, `message=${message}\n`);
  else console.log(message);
  if (summaryFile) fs.appendFileSync(summaryFile, summary);
  else console.log(summary);
}

main();
