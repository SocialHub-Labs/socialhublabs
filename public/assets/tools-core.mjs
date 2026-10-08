import { safeUrl } from "./core.mjs";
export function createCampaignUrl(destination, values) {
  const clean = safeUrl(destination);
  if (!clean) throw new Error("Enter a valid http:// or https:// destination URL.");
  for (const required of ["source", "medium", "campaign"]) {
    if (!String(values[required] ?? "").trim()) {
      throw new Error("UTM " + required + " is required.");
    }
  }
  const url = new URL(clean);
  for (const name of ["source", "medium", "campaign", "content", "term"]) {
    const value = String(values[name] ?? "").trim().slice(0, 200);
    if (value) url.searchParams.set("utm_" + name, value);
    else url.searchParams.delete("utm_" + name);
  }
  return url.toString();
}
