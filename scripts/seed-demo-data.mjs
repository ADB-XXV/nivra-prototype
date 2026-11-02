import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  throw new Error("Missing Supabase URL or service role key in .env.local");
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const employerEmails = [1, 2, 3, 4].map(
  (n) => `employer${n}@example.com`
);
const studentEmails = [1, 2, 3, 4, 5, 6, 7, 8].map(
  (n) => `student${n}@example.com`
);

const employers = [
  {
    email: "employer1@example.com",
    full_name: "Arjun Menon",
    business: "Malabar Events Co.",
    industry: "Events and Entertainment",
    company_size: "Small business",
    website: "https://example.com",
    city: "Kozhikode",
    description: "Event planning and on-ground event management team.",
    team_size: "10-20",
    contact_person: "Arjun Menon",
    phone: "9000000001",
    business_category: "Events",
  },
  {
    email: "employer2@example.com",
    full_name: "Nisha Thomas",
    business: "Coastline Cafe",
    industry: "Food and Hospitality",
    company_size: "Small business",
    website: "https://example.com",
    city: "Kozhikode",
    description: "Local cafe serving students, families and working professionals.",
    team_size: "5-10",
    contact_person: "Nisha Thomas",
    phone: "9000000002",
    business_category: "Hospitality",
  },
  {
    email: "employer3@example.com",
    full_name: "Rahul Nair",
    business: "PixelCraft Studio",
    industry: "Technology and Design",
    company_size: "Small business",
    website: "https://example.com",
    city: "Kozhikode",
    description: "Digital design and technology studio working with local businesses.",
    team_size: "5-10",
    contact_person: "Rahul Nair",
    phone: "9000000003",
    business_category: "Technology",
  },
  {
    email: "employer4@example.com",
    full_name: "Meera Krishnan",
    business: "Northgate Retail",
    industry: "Retail",
    company_size: "Medium business",
    website: "https://example.com",
    city: "Kozhikode",
    description: "Retail and merchandising business with seasonal staffing needs.",
    team_size: "20-50",
    contact_person: "Meera Krishnan",
    phone: "9000000004",
    business_category: "Retail",
  },
];

const students = [
  {
    email: "student1@example.com",
    full_name: "Ananya Suresh",
    college: "National Institute of Technology Calicut",
    city: "Kozhikode",
    education: "B.Tech Computer Science",
    skills: "JavaScript, React, HTML, CSS",
    experience: "Built two academic web projects.",
    preferred_categories: "Technology, Marketing",
    availability: "Weekends and evenings",
    phone: "9100000001",
  },
  {
    email: "student2@example.com",
    full_name: "Adithya Raj",
    college: "National Institute of Technology Calicut",
    city: "Kozhikode",
    education: "B.Tech Electrical Engineering",
    skills: "Communication, Event coordination, Excel",
    experience: "Volunteered at college technical events.",
    preferred_categories: "Event assistance, Hospitality",
    availability: "Weekends",
    phone: "9100000002",
  },
  {
    email: "student3@example.com",
    full_name: "Sneha Pillai",
    college: "University of Calicut",
    city: "Kozhikode",
    education: "B.Com",
    skills: "Customer service, Sales, Communication",
    experience: "Part-time retail experience.",
    preferred_categories: "Retail, Marketing",
    availability: "Flexible",
    phone: "9100000003",
  },
  {
    email: "student4@example.com",
    full_name: "Vishnu Prasad",
    college: "National Institute of Technology Calicut",
    city: "Kozhikode",
    education: "B.Tech Information Technology",
    skills: "Python, Data entry, Excel",
    experience: "Completed academic data analysis projects.",
    preferred_categories: "Technology, Education",
    availability: "Evenings and weekends",
    phone: "9100000004",
  },
  {
    email: "student5@example.com",
    full_name: "Fathima N",
    college: "Farook College",
    city: "Kozhikode",
    education: "BA English",
    skills: "Writing, Social media, Communication",
    experience: "Managed social media for a student club.",
    preferred_categories: "Marketing, Education",
    availability: "Weekends",
    phone: "9100000005",
  },
  {
    email: "student6@example.com",
    full_name: "Kiran Das",
    college: "National Institute of Technology Calicut",
    city: "Kozhikode",
    education: "B.Tech Mechanical Engineering",
    skills: "Photography, Teamwork, Event support",
    experience: "Volunteered for campus events.",
    preferred_categories: "Event assistance, Retail",
    availability: "Flexible",
    phone: "9100000006",
  },
  {
    email: "student7@example.com",
    full_name: "Devika Mohan",
    college: "Providence Women's College",
    city: "Kozhikode",
    education: "B.Sc Mathematics",
    skills: "Tutoring, Mathematics, Presentation",
    experience: "Tutored school students.",
    preferred_categories: "Education, Technology",
    availability: "Evenings",
    phone: "9100000007",
  },
  {
    email: "student8@example.com",
    full_name: "Akhil Varma",
    college: "National Institute of Technology Calicut",
    city: "Kozhikode",
    education: "B.Tech Electronics",
    skills: "Customer service, Communication, MS Office",
    experience: "Helped coordinate student club activities.",
    preferred_categories: "Hospitality, Event assistance",
    availability: "Weekends and holidays",
    phone: "9100000008",
  },
];

const jobSpecs = [
  {
    key: "event1",
    employer: 0,
    title: "Event Registration Assistant",
    category: "Event assistance",
    workers: 3,
    description: "Help guests register, verify tickets and guide attendees at a local business event. Training and instructions will be provided.",
    skills: "Communication, Basic computer skills",
    location: "Hilite Mall, Kozhikode",
    date: "2026-11-08",
    hours: "9:00 AM - 5:00 PM",
    amount: 900,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "cafe1",
    employer: 1,
    title: "Weekend Cafe Assistant",
    category: "Hospitality",
    workers: 2,
    description: "Assist with customer orders, table setup and general cafe operations during the weekend rush.",
    skills: "Communication, Customer service",
    location: "Kozhikode Beach",
    date: "2026-11-07",
    hours: "4:00 PM - 10:00 PM",
    amount: 700,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "tech1",
    employer: 2,
    title: "Website Content Assistant",
    category: "Technology",
    workers: 2,
    description: "Help update website content, check page formatting and organise basic product information.",
    skills: "HTML, Writing, Attention to detail",
    location: "Cyberpark, Kozhikode",
    date: "2026-11-10",
    hours: "10:00 AM - 4:00 PM",
    amount: 850,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "retail1",
    employer: 3,
    title: "Store Promotion Assistant",
    category: "Retail",
    workers: 3,
    description: "Assist customers, arrange promotional displays and distribute information about store offers.",
    skills: "Communication, Customer service",
    location: "Mavoor Road, Kozhikode",
    date: "2026-11-09",
    hours: "11:00 AM - 7:00 PM",
    amount: 800,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "marketing1",
    employer: 2,
    title: "Social Media Research Intern",
    category: "Marketing",
    workers: 2,
    description: "Research local business pages, collect content ideas and prepare a short competitor summary.",
    skills: "Research, Writing, Social media",
    location: "Remote",
    date: "2026-11-12",
    hours: "2:00 PM - 6:00 PM",
    amount: 500,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "education1",
    employer: 0,
    title: "School Activity Workshop Helper",
    category: "Education",
    workers: 2,
    description: "Support facilitators during a student workshop by arranging materials and helping participants.",
    skills: "Communication, Organisation",
    location: "Kunnamangalam, Kozhikode",
    date: "2026-11-14",
    hours: "9:00 AM - 2:00 PM",
    amount: 750,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "event2",
    employer: 0,
    title: "Campus Fest Operations Crew",
    category: "Event assistance",
    workers: 4,
    description: "Assist with venue setup, attendee directions and coordination between event stalls.",
    skills: "Teamwork, Event coordination",
    location: "NIT Calicut",
    date: "2026-11-16",
    hours: "8:00 AM - 6:00 PM",
    amount: 1000,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "cafe2",
    employer: 1,
    title: "Cafe Counter Support",
    category: "Hospitality",
    workers: 2,
    description: "Support the counter team with order handling, packaging and customer assistance.",
    skills: "Customer service, Basic numeracy",
    location: "Palazhi, Kozhikode",
    date: "2026-11-18",
    hours: "10:00 AM - 4:00 PM",
    amount: 650,
    basis: "Per day",
    status: "Active",
  },
  {
    key: "retail2",
    employer: 3,
    title: "Festive Display Setup",
    category: "Retail",
    workers: 2,
    description: "Help arrange seasonal product displays and organise shelves before the store opens.",
    skills: "Organisation, Teamwork",
    location: "SM Street, Kozhikode",
    date: "2026-10-20",
    hours: "9:00 AM - 5:00 PM",
    amount: 800,
    basis: "Per day",
    status: "Closed",
  },
  {
    key: "event3",
    employer: 0,
    title: "Conference Guest Support",
    category: "Event assistance",
    workers: 3,
    description: "Welcomed guests, managed registration and helped speakers find their assigned rooms.",
    skills: "Communication, Organisation",
    location: "Kozhikode",
    date: "2026-10-17",
    hours: "8:00 AM - 4:00 PM",
    amount: 1000,
    basis: "Per day",
    status: "Closed",
  },
  {
    key: "tech2",
    employer: 2,
    title: "Product Data Entry Assistant",
    category: "Technology",
    workers: 2,
    description: "Organised product details in a spreadsheet and checked entries for missing information.",
    skills: "Excel, Data entry, Attention to detail",
    location: "Cyberpark, Kozhikode",
    date: "2026-10-23",
    hours: "10:00 AM - 3:00 PM",
    amount: 700,
    basis: "Per day",
    status: "Closed",
  },
  {
    key: "marketing2",
    employer: 3,
    title: "Local Promotion Survey Assistant",
    category: "Marketing",
    workers: 2,
    description: "Collected customer feedback and summarised responses for a local promotional campaign.",
    skills: "Communication, Research",
    location: "Kozhikode",
    date: "2026-10-25",
    hours: "10:00 AM - 4:00 PM",
    amount: 900,
    basis: "Fixed amount",
    status: "Closed",
  },
];

const applicationSpecs = [
  // Completed historical gigs
  { job: "retail2", student: 2, status: "Completed", rating: 5, review: "Friendly, punctual and quick to learn. Helped us finish the display setup on time.", tags: ["Punctual", "Hardworking"], paid: true },
  { job: "event3", student: 1, status: "Completed", rating: 5, review: "Handled guest registration confidently and communicated well with the team.", tags: ["Reliable", "Good communication"], paid: true },
  { job: "tech2", student: 3, status: "Completed", rating: 4, review: "Careful with data entry and completed the assigned spreadsheet work accurately.", tags: ["Detail oriented", "Reliable"], paid: false },
  { job: "marketing2", student: 4, status: "Completed", rating: 5, review: "Collected useful feedback and delivered a clear summary.", tags: ["Efficient", "Good communication"], paid: true },

  // Active opportunities
  { job: "event1", student: 1, status: "Shortlisted" },
  { job: "event1", student: 5, status: "Applied" },
  { job: "event1", student: 7, status: "Under Review" },
  { job: "cafe1", student: 7, status: "Applied" },
  { job: "cafe1", student: 2, status: "Shortlisted" },
  { job: "tech1", student: 0, status: "Under Review" },
  { job: "tech1", student: 3, status: "Applied" },
  { job: "retail1", student: 2, status: "Applied" },
  { job: "retail1", student: 5, status: "Under Review" },
  { job: "marketing1", student: 4, status: "Shortlisted" },
  { job: "marketing1", student: 0, status: "Applied" },
  { job: "education1", student: 6, status: "Applied" },
  { job: "education1", student: 4, status: "Rejected" },
  { job: "event2", student: 5, status: "Under Review" },
  { job: "event2", student: 1, status: "Applied" },
  { job: "cafe2", student: 7, status: "Applied" },
  { job: "cafe2", student: 2, status: "Rejected" },
];

const savedSpecs = [
  { student: 0, job: "event1" },
  { student: 0, job: "tech1" },
  { student: 1, job: "event2" },
  { student: 2, job: "retail1" },
  { student: 3, job: "tech1" },
  { student: 4, job: "marketing1" },
  { student: 5, job: "event1" },
  { student: 7, job: "cafe2" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function checkEmpty(table) {
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error) throw new Error(`${table}: ${error.message}`);
  assert(count === 0, `${table} is not empty (${count} rows). Seed cancelled.`);
}

async function insert(table, rows) {
  const { data, error } = await supabase
    .from(table)
    .insert(rows)
    .select("*");

  if (error) throw new Error(`Insert into ${table} failed: ${error.message}`);
  return data || [];
}

async function main() {
  console.log("===== NIVRA DEMO DATA SEED =====");

  console.log("\nChecking that all demo tables are empty...");
  for (const table of ["payments", "saved_jobs", "applications", "jobs", "profiles"]) {
    await checkEmpty(table);
    console.log(`${table}: empty`);
  }

  console.log("\nFinding the 12 existing Auth accounts...");
  const { data: authData, error: authError } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (authError) throw authError;

  const userMap = new Map(
    (authData.users || []).map((user) => [user.email, user.id])
  );

  const missing = [...employerEmails, ...studentEmails].filter(
    (email) => !userMap.has(email)
  );

  assert(
    missing.length === 0,
    `Missing Auth accounts: ${missing.join(", ")}. No data inserted.`
  );

  const employerRows = employers.map((profile) => {
    const { email, ...fields } = profile;
    return {
      id: userMap.get(email),
      role: "employer",
      ...fields,
    };
  });

  const studentRows = students.map((profile) => {
    const { email, ...fields } = profile;
    return {
      id: userMap.get(email),
      role: "student",
      ...fields,
    };
  });

  const created = {
    profiles: [],
    jobs: [],
    applications: [],
    payments: [],
    saved_jobs: [],
  };

  try {
    console.log("\nCreating profiles...");
    const profileRows = await insert(
      "profiles",
      [...employerRows, ...studentRows]
    );
    created.profiles = profileRows.map((row) => row.id);
    console.log(`Profiles created: ${profileRows.length}`);

    const employerIds = employers.map((e) => userMap.get(e.email));
    const studentIds = students.map((s) => userMap.get(s.email));

    console.log("\nCreating jobs...");
    const jobRows = [];
    for (const spec of jobSpecs) {
      const { key, employer, ...fields } = spec;
      jobRows.push({
        ...fields,
        employer_id: employerIds[employer],
      });
    }

    const insertedJobs = await insert("jobs", jobRows);
    created.jobs = insertedJobs.map((row) => row.id);

    const jobMap = new Map(
      jobSpecs.map((spec) => [
        spec.key,
        insertedJobs.find((row) => row.title === spec.title)?.id,
      ])
    );

    assert(
      [...jobMap.values()].every(Boolean),
      "Could not map all inserted jobs to their IDs."
    );
    console.log(`Jobs created: ${insertedJobs.length}`);

    console.log("\nCreating applications...");
    const now = new Date();
    const applicationRows = applicationSpecs.map((spec, index) => {
      const isCompleted = spec.status === "Completed";
      const completedAt = isCompleted
        ? new Date(Date.UTC(2026, 9, 20 + index, 10, 0, 0)).toISOString()
        : null;
      const verifiedAt = isCompleted
        ? new Date(Date.UTC(2026, 9, 21 + index, 10, 0, 0)).toISOString()
        : null;

      return {
        job_id: jobMap.get(spec.job),
        student_id: studentIds[spec.student],
        status: spec.status,
        applied_at: isCompleted
          ? new Date(Date.UTC(2026, 9, 10 + index, 9, 0, 0)).toISOString()
          : new Date(now.getTime() - (index + 1) * 3600 * 1000).toISOString(),
        completed_at: completedAt,
        verified_at: verifiedAt,
        paid_at: isCompleted && spec.paid
          ? new Date(Date.UTC(2026, 9, 22 + index, 12, 0, 0)).toISOString()
          : null,
        rating: isCompleted ? spec.rating : null,
        review: isCompleted ? spec.review : null,
        review_tags: isCompleted ? spec.tags : [],
        review_reported: false,
      };
    });

    const insertedApplications = await insert("applications", applicationRows);
    created.applications = insertedApplications.map((row) => row.id);

    const applicationMap = new Map(
      insertedApplications.map((row) => [
        `${row.job_id}:${row.student_id}`,
        row,
      ])
    );

    console.log(`Applications created: ${insertedApplications.length}`);

    console.log("\nCreating demo payment records...");
    const completedSpecs = applicationSpecs
      .map((spec, index) => ({ ...spec, index }))
      .filter((spec) => spec.status === "Completed");

    const paymentRows = completedSpecs.map((spec, index) => {
      const application = applicationMap.get(
        `${jobMap.get(spec.job)}:${studentIds[spec.student]}`
      );

      assert(application, `Could not find application for ${spec.job}.`);
      const job = jobSpecs.find((item) => item.key === spec.job);
      const amount = job.amount;
      const fee = Math.round(amount * 0.03 * 100) / 100;

      return {
        application_id: application.id,
        job_id: jobMap.get(spec.job),
        employer_id: employerIds[job.employer],
        student_id: studentIds[spec.student],
        amount,
        commission_rate: 3.00,
        platform_fee: fee,
        student_amount: amount - fee,
        status: spec.paid ? "Paid" : "Pending",
        payment_reference: spec.paid ? `DEMO-NIVRA-${index + 1}` : null,
        paid_at: spec.paid
          ? new Date(Date.UTC(2026, 9, 24 + index, 12, 0, 0)).toISOString()
          : null,
      };
    });

    const insertedPayments = await insert("payments", paymentRows);
    created.payments = insertedPayments.map((row) => row.id);
    console.log(`Payment records created: ${insertedPayments.length}`);

    console.log("\nCreating saved jobs...");
    const savedRows = savedSpecs.map((spec) => ({
      student_id: studentIds[spec.student],
      job_id: jobMap.get(spec.job),
    }));

    const insertedSaved = await insert("saved_jobs", savedRows);
    created.saved_jobs = insertedSaved.map((row) => row.id);
    console.log(`Saved jobs created: ${insertedSaved.length}`);

    console.log("\n===== SEED COMPLETE =====");
    console.log(`Employer profiles: ${employerRows.length}`);
    console.log(`Student profiles: ${studentRows.length}`);
    console.log(`Jobs: ${insertedJobs.length}`);
    console.log(`Applications: ${insertedApplications.length}`);
    console.log(`Payments: ${insertedPayments.length}`);
    console.log(`Saved jobs: ${insertedSaved.length}`);
    console.log("\nDemo password for all accounts: 1234567890");
    console.log("Paid payment rows are simulated demo records.");
  } catch (error) {
    console.error("\nSEED FAILED:", error.message);
    console.error("Attempting to roll back rows inserted by this run...");

    const cleanupOrder = [
      ["payments", created.payments],
      ["saved_jobs", created.saved_jobs],
      ["applications", created.applications],
      ["jobs", created.jobs],
      ["profiles", created.profiles],
    ];

    for (const [table, ids] of cleanupOrder) {
      if (ids.length === 0) continue;

      const { error: cleanupError } = await supabase
        .from(table)
        .delete()
        .in("id", ids);

      if (cleanupError) {
        console.error(`Rollback warning for ${table}: ${cleanupError.message}`);
      } else {
        console.log(`Rolled back ${table}: ${ids.length}`);
      }
    }

    throw error;
  }
}

main().catch((error) => {
  console.error("\nSeed script stopped:", error.message);
  process.exit(1);
});
