/**
 * Root Admin account তৈরি করতে একবার run করো:
 *   npx ts-node -r tsconfig-paths/register src/scripts/seed-admin.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Admin", "Manager", "Staff"], default: "Staff" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");

  const existing = await User.findOne({ role: "Admin" });
  if (existing) {
    console.log("✅ Admin already exists:", existing.email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash("Admin@ccll2026", 12);
  const admin = await User.create({
    name: "Super Admin",
    email: "admin@ccll.com.bd",
    password: hashed,
    role: "Admin",
    isActive: true,
  });

  console.log("✅ Root Admin created!");
  console.log("   Email:", admin.email);
  console.log("   Password: Admin@ccll2026");
  console.log("   ⚠️  First login এর পরে password পরিবর্তন করুন!");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
