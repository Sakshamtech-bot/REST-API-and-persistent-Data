const { connectDB, getDB } = require("../src/db");

async function seedDatabase() {
  await connectDB();

  const db = getDB();

  await db.run("DELETE FROM internships");

  const internships = [
    {
      title: "Web Development Intern",
      company: "Google",
      location: "Bangalore",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      stipend: 25000,
      description: "Frontend and web development internship",
      status: "applied"
    },
    {
      title: "Backend Development Intern",
      company: "Microsoft",
      location: "Hyderabad",
      startDate: "2026-07-15",
      endDate: "2026-09-15",
      stipend: 30000,
      description: "Backend API development internship",
      status: "interview"
    },
    {
      title: "Frontend Developer Intern",
      company: "Amazon",
      location: "Remote",
      startDate: "2026-08-01",
      endDate: "2026-10-31",
      stipend: 20000,
      description: "Build responsive web interfaces",
      status: "selected"
    },
    {
      title: "Software Engineering Intern",
      company: "TCS",
      location: "Noida",
      startDate: "2026-09-01",
      endDate: "2026-11-30",
      stipend: 15000,
      description: "Software development and testing",
      status: "applied"
    }
  ];

  for (const internship of internships) {
    await db.run(
      `
      INSERT INTO internships
      (
        title,
        company,
        location,
        startDate,
        endDate,
        stipend,
        description,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        internship.title,
        internship.company,
        internship.location,
        internship.startDate,
        internship.endDate,
        internship.stipend,
        internship.description,
        internship.status
      ]
    );
  }

  console.log("Seed data inserted successfully!");
  process.exit(0);
}

seedDatabase();