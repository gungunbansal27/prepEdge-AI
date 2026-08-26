import admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";
import { env } from "./env.js";

let serviceAccount;

const rawValue = (env.FIREBASE_SERVICE_ACCOUNT || "").trim();

if (rawValue.startsWith("{")) {
  serviceAccount = JSON.parse(rawValue);
} else if (rawValue) {
  const serviceAccountPath = path.resolve(process.cwd(), rawValue);
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
} else {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not configured.");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;