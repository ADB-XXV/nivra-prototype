
import { createClient } from "@supabase/supabase-js";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TABLES = [
  "payments",
  "saved_jobs",
  "applications",
  "jobs",
  "profiles",
];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing Supabase URL or service-role key.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];

async function getAuthUsers() {
  const users = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;

    users.push(...data.users);

    if (data.users.length < perPage) break;
    page++;
  }

  return users;
}

async function getTableCount(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

async function deleteTable(table) {
  const { error, count } = await supabase
    .from(table)
    .delete({ count: "exact" })
    .not("id", "is", null);

  if (error) throw error;

  console.log(`Deleted ${count ?? "?"} rows from ${table}`);
}

async function main() {
  console.log("\n===== NIVRA DATABASE RESET =====");
  console.log("Project reference:", projectRef);
  console.log("Mode:", process.argv.includes("--execute") ? "EXECUTE" : "DRY RUN");

  console.log("\nChecking existing records...");

  for (const table of TABLES) {
    const count = await getTableCount(table);
    console.log(`${table}: ${count} records`);
  }

  const users = await getAuthUsers();
  console.log(`Auth accounts: ${users.length}`);

  if (!process.argv.includes("--execute")) {
    console.log("\nDRY RUN COMPLETE.");
    console.log("Nothing has been deleted.");
    console.log("Review the counts above before proceeding.");
    return;
  }

  console.log("\nWARNING: THIS WILL PERMANENTLY DELETE ALL DATA AND AUTH ACCOUNTS.");
  console.log("Project:", projectRef);

  const rl = readline.createInterface({ input, output });

  const answer = await rl.question(
    `\nTo confirm, type RESET ${projectRef}: `
  );

  rl.close();

  if (answer.trim() !== `RESET ${projectRef}`) {
    console.log("Confirmation did not match. Nothing deleted.");
    return;
  }

  console.log("\nStarting deletion...");

  for (const table of TABLES) {
    await deleteTable(table);
  }

  console.log("\nDeleting Auth accounts...");

  for (const user of users) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      console.error(`Failed to delete ${user.email ?? user.id}:`, error.message);
      throw error;
    }

    console.log(`Deleted account: ${user.email ?? user.id}`);
  }

  console.log("\nRESET COMPLETE.");
  console.log("All five public tables and listed Auth accounts were deleted.");
  console.log("No new demo data has been created yet.");
}

main().catch((error) => {
  console.error("\nRESET STOPPED:", error.message);
  process.exit(1);
});
