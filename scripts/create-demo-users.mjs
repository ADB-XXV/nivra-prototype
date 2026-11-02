
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const password = "1234567890";

const accounts = [
  ...Array.from({ length: 4 }, (_, i) => ({
    email: `employer${i + 1}@example.com`,
    role: "employer",
    full_name: `Employer ${i + 1}`,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    email: `student${i + 1}@example.com`,
    role: "student",
    full_name: `Student ${i + 1}`,
  })),
];

async function getExistingUsers() {
  const users = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) throw error;

    users.push(...data.users);

    if (data.users.length < 1000) break;
    page++;
  }

  return users;
}

async function main() {
  console.log("===== NIVRA DEMO ACCOUNT CREATION =====");

  const existingUsers = await getExistingUsers();
  const existingEmails = new Set(
    existingUsers.map((user) => user.email?.toLowerCase())
  );

  const alreadyCreated = accounts.filter((account) =>
    existingEmails.has(account.email.toLowerCase())
  );

  if (alreadyCreated.length > 0) {
    console.log("Some demo accounts already exist; they will be skipped.");
  }

  let created = 0;
  let skipped = 0;

  for (const account of accounts) {
    if (existingEmails.has(account.email.toLowerCase())) {
      console.log(`Already exists: ${account.email}`);
      skipped++;
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password,
      email_confirm: true,
      user_metadata: {
        role: account.role,
        full_name: account.full_name,
        demo_account: true,
      },
    });

    if (error) {
      console.error(`Failed to create ${account.email}:`, error.message);
      console.log(`Created before failure: ${created}`);
      process.exit(1);
    }

    console.log(`Created: ${data.user.email} (${account.role})`);
    created++;
  }

  console.log("\n===== RESULT =====");
  console.log(`Created: ${created}`);
  console.log(`Already existed: ${skipped}`);
  console.log(`Total demo accounts: ${created + skipped}`);
  console.log("All accounts use the same demo password.");
  console.log("No profile rows or jobs were created in this step.");
}

main().catch((error) => {
  console.error("Account creation failed:", error.message);
  process.exit(1);
});
