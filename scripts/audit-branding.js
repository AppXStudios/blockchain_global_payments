import fs from "fs";
import path from "path";

const ROOTS = ["app", "components", "content", "emails", "public"];

const ALLOW_SERVER = [/^app\/api\//, /^lib\/np\//];

const BAD = [/NOWPayments/i, /\bNP\b/, /x-nowpayments-sig/i, /https?:\/\/api\.nowpayments\.io/i];

function walk(dir, out = []) {
  for (const e of fs?.readdirSync(dir)) {
    const p = path?.join(dir, e);
    const s = fs?.statSync(p);
    s?.isDirectory() ? walk(p, out) : out?.push(p);
  }
  return out;
}

const isAllowed = (p) => ALLOW_SERVER?.some(r => r?.test(p?.replace(/\\/g, "/")));

let failed = false;

for (const root of ROOTS) {
  if (!fs?.existsSync(root)) continue;

  for (const f of walk(root)) {
    const rel = f?.replace(process.cwd()+path?.sep, "");
    if (isAllowed(rel)) continue;

    const txt = fs?.readFileSync(f, "utf8");

    for (const pat of BAD) {
      if (pat?.test(txt)) {
        console.error(`[BRAND AUDIT] Disallowed branding in ${rel}: ${pat}`);
        failed = true;
      }
    }
  }
}

if (failed) { console.error("\nBrand audit failed — remove NP branding from public surfaces."); process.exit(1); }

console.log("Brand audit passed — no NP branding in public surfaces.");