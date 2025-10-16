import fs from "fs";
import path from "path";

const counterFile = path.resolve("./utils/emailCounter.txt");
export function generateUniqueEmail(baseName = "nikhil.gupta", domain = "yopmail.com") {
  let count = 0;

  if (fs.existsSync(counterFile)) {
    const data = fs.readFileSync(counterFile, "utf-8");
    count = parseInt(data.trim(), 10) || 0;
  }
  count += 1;
  fs.writeFileSync(counterFile, String(count));

  const email = `${baseName}${count}@${domain}`;
  return email;
}
