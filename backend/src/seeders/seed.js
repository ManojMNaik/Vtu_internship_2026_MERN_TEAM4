require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const ServiceCategory = require("../models/ServiceCategory");

const CATEGORIES = [
  { name: "Electrician", slug: "electrician", description: "Electrical wiring, repairs, and installations" },
  { name: "Plumber", slug: "plumber", description: "Pipe fitting, leak repair, and plumbing installations" },
  { name: "Cleaning", slug: "cleaning", description: "Home and office deep cleaning services" },
  { name: "AC Repair", slug: "ac-repair", description: "Air conditioner servicing, repair, and installation" },
  { name: "Appliance Repair", slug: "appliance-repair", description: "Washing machine, refrigerator, and appliance repair" },
  { name: "Painting", slug: "painting", description: "Interior and exterior painting services" },
  { name: "Carpentry", slug: "carpentry", description: "Furniture repair, woodwork, and carpentry services" },
  { name: "Pest Control", slug: "pest-control", description: "Termite, cockroach, and general pest control" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // ── Seed admin user ───────────────────────────────────────────
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@servicemate.com",
        password: "Admin@1234",
        role: "admin",
        isVerified: true,
      });
      console.log("✔ Admin user created (admin@servicemate.com / Admin@1234)");
    } else {
      console.log("• Admin user already exists");
    }

    // ── Seed service categories ───────────────────────────────────
    for (const cat of CATEGORIES) {
      const exists = await ServiceCategory.findOne({ slug: cat.slug });
      if (!exists) {
        await ServiceCategory.create(cat);
        console.log(`✔ Category created: ${cat.name}`);
      } else {
        console.log(`• Category exists: ${cat.name}`);
      }
    }

    console.log("\nSeeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
