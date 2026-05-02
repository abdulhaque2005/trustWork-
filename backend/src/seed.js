const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");
const User = require("./models/User.model");
const Project = require("./models/Project.model");
const Milestone = require("./models/Milestone.model");
const Payment = require("./models/Payment.model");
const Activity = require("./models/Activity.model");

dotenv.config();

const DUMMY_API = "https://dummyjson.com/products?limit=12";

const scopeOptions = ["small", "medium", "large", "enterprise"];
const statusOptions = ["open", "in-progress", "completed", "open", "in-progress", "open"];
const skillSets = [
  ["React", "Node.js", "MongoDB"],
  ["Python", "Django", "PostgreSQL"],
  ["Flutter", "Firebase", "Dart"],
  ["Vue.js", "Laravel", "MySQL"],
  ["Swift", "iOS", "CoreData"],
  ["TypeScript", "Next.js", "Prisma"],
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Milestone.deleteMany({});
    await Payment.deleteMany({});
    await Activity.deleteMany({});

    // Create Admin (fixed credentials)
    const admin = await User.create({
      name: "Admin",
      email: "admin@escrowflow.com",
      password: "Admin@123",
      role: "admin",
      bio: "Platform administrator with full system control.",
    });

    // Create Test Client
    const client = await User.create({
      name: "John Client",
      email: "client@test.com",
      password: "Test@123",
      role: "client",
      bio: "Serial entrepreneur looking for talented developers.",
      skills: ["Business Strategy", "Product Management"],
    });

    // Create Test Freelancer
    const freelancer = await User.create({
      name: "Alex Dev",
      email: "freelancer@test.com",
      password: "Test@123",
      role: "freelancer",
      bio: "Full-stack developer with 5+ years of experience.",
      skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    });

    console.log("✅ Users created");

    // Fetch dummyjson products and map to projects
    const { data } = await axios.get(DUMMY_API);
    const products = data.products;

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const status = statusOptions[i % statusOptions.length];
      const budget = Math.round(p.price * 100); // e.g. $7.69 -> $769
      const daysAhead = 15 + Math.floor(Math.random() * 45);
      const deadline = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

      // Some projects get expired deadlines for testing
      const isExpired = i === 3 || i === 7;
      const finalDeadline = isExpired
        ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        : deadline;

      const hasFreelancer = status === "in-progress" || status === "completed";

      const project = await Project.create({
        title: p.title,
        description: p.description,
        budget,
        deadline: finalDeadline,
        scope: scopeOptions[i % scopeOptions.length],
        skills: skillSets[i % skillSets.length],
        clientId: client._id,
        freelancerId: hasFreelancer ? freelancer._id : null,
        status: isExpired ? "expired" : status,
        progress: status === "completed" ? 100 : status === "in-progress" ? Math.floor(Math.random() * 60) + 20 : 0,
      });

      // Create milestones for each project
      const milestoneCount = 3;
      const milestoneAmount = Math.round(budget / milestoneCount);
      const msStatuses =
        status === "completed"
          ? ["completed", "completed", "completed"]
          : status === "in-progress"
          ? ["completed", "in-progress", "pending"]
          : ["pending", "pending", "pending"];

      const milestones = [];
      for (let j = 0; j < milestoneCount; j++) {
        const ms = await Milestone.create({
          projectId: project._id,
          title: ["Design & Planning", "Core Development", "Testing & Delivery"][j],
          description: [
            "Wireframes, mockups, and architecture planning",
            "Implementation of core features and integrations",
            "QA testing, bug fixes, and final deployment",
          ][j],
          amount: j === milestoneCount - 1 ? budget - milestoneAmount * (milestoneCount - 1) : milestoneAmount,
          status: isExpired ? "pending" : msStatuses[j],
          dueDate: new Date(finalDeadline.getTime() - (milestoneCount - j - 1) * 10 * 24 * 60 * 60 * 1000),
          order: j,
        });
        milestones.push(ms);

        // Create locked payments for milestones
        if (hasFreelancer || status === "completed") {
          const payStatus = msStatuses[j] === "completed" ? "released" : "locked";
          await Payment.create({
            projectId: project._id,
            milestoneId: ms._id,
            clientId: client._id,
            freelancerId: payStatus === "released" ? freelancer._id : null,
            amount: ms.amount,
            status: isExpired ? "locked" : payStatus,
            releasedAt: payStatus === "released" ? new Date() : null,
          });
        }
      }

      // Create activity log
      await Activity.create({
        projectId: project._id,
        userId: client._id,
        type: "project_created",
        message: `Project "${p.title}" created by ${client.name}`,
      });

      if (hasFreelancer) {
        await Activity.create({
          projectId: project._id,
          userId: freelancer._id,
          type: "freelancer_assigned",
          message: `${freelancer.name} accepted the project`,
        });
      }

      if (status === "completed") {
        await Activity.create({
          projectId: project._id,
          userId: client._id,
          type: "project_completed",
          message: `All milestones completed — project finished!`,
        });
      }
    }

    console.log(`✅ ${products.length} projects seeded from dummyjson.com`);
    console.log("\n🔑 Login Credentials:");
    console.log("Admin:      admin@escrowflow.com / Admin@123");
    console.log("Client:     client@test.com / Test@123");
    console.log("Freelancer: freelancer@test.com / Test@123");

    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
