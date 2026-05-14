import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

async function seed() {
  await connectDB();

  const existing = await User.findOne({ email: "admin@ccll.com" });
  if (existing) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("Admin@1234", 10);

  await User.create({
    name: "CCLL Admin",
    email: "admin@ccll.com",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin created successfully!");
  console.log("Email: admin@ccll.com");
  console.log("Password: Admin@1234");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});