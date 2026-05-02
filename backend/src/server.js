const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const User = require("./models/User.model");
const Project = require("./models/Project.model");
const Milestone = require("./models/Milestone.model");
const Payment = require("./models/Payment.model");
const Activity = require("./models/Activity.model");
const axios = require("axios");

// Auto-create default admin if not exists
const ensureAdmin = async () => {
  try {
    const existing = await User.findOne({ email: "admin@escrowflow.com" });
    if (!existing) {
      await User.create({
        name: "Admin",
        email: "admin@escrowflow.com",
        password: "Admin@123",
        role: "admin",
        bio: "Platform administrator with full system control.",
      });
      console.log("🔐 Default admin created: admin@escrowflow.com / Admin@123");
    }
  } catch (err) {
    console.error("Admin creation error:", err.message);
  }
};

// Auto-seed default projects from dummyjson.com if DB is empty
const ensureDefaultProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count > 0) return; // DB already has projects

    console.log("📦 No projects found — seeding from dummyjson.com...");

    // Ensure we have a client and freelancer
    let client = await User.findOne({ role: "client" });
    if (!client) {
      client = await User.create({
        name: "John Client",
        email: "client@test.com",
        password: "Test@123",
        role: "client",
        bio: "Serial entrepreneur looking for talented developers.",
        skills: ["Business Strategy", "Product Management"],
      });
    }

    let freelancer = await User.findOne({ role: "freelancer" });
    if (!freelancer) {
      freelancer = await User.create({
        name: "Alex Dev",
        email: "freelancer@test.com",
        password: "Test@123",
        role: "freelancer",
        bio: "Full-stack developer with 5+ years of experience.",
        skills: ["React", "Node.js", "MongoDB", "TypeScript"],
      });
    }

    const { data } = await axios.get("https://dummyjson.com/products?limit=12");
    const products = data.products;
    const scopeOpts = ["small", "medium", "large", "enterprise"];
    const statusOpts = ["open", "in-progress", "completed", "open", "in-progress", "open"];
    const skillSets = [
      ["React", "Node.js", "MongoDB"],
      ["Python", "Django", "PostgreSQL"],
      ["Flutter", "Firebase", "Dart"],
      ["Vue.js", "Laravel", "MySQL"],
      ["Swift", "iOS", "CoreData"],
      ["TypeScript", "Next.js", "Prisma"],
    ];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const status = statusOpts[i % statusOpts.length];
      const budget = Math.round(p.price * 100);
      const daysAhead = 15 + Math.floor(Math.random() * 45);
      const deadline = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

      // Make a couple of projects expired for testing
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
        scope: scopeOpts[i % scopeOpts.length],
        skills: skillSets[i % skillSets.length],
        clientId: client._id,
        freelancerId: hasFreelancer ? freelancer._id : null,
        status: isExpired ? "expired" : status,
        progress: status === "completed" ? 100 : status === "in-progress" ? Math.floor(Math.random() * 60) + 20 : 0,
      });

      // Create 3 milestones per project
      const milestoneAmount = Math.round(budget / 3);
      const msStatuses =
        status === "completed"
          ? ["completed", "completed", "completed"]
          : status === "in-progress"
          ? ["completed", "in-progress", "pending"]
          : ["pending", "pending", "pending"];

      for (let j = 0; j < 3; j++) {
        const ms = await Milestone.create({
          projectId: project._id,
          title: ["Design & Planning", "Core Development", "Testing & Delivery"][j],
          description: [
            "Wireframes, mockups, and architecture planning",
            "Implementation of core features and integrations",
            "QA testing, bug fixes, and final deployment",
          ][j],
          amount: j === 2 ? budget - milestoneAmount * 2 : milestoneAmount,
          status: isExpired ? "pending" : msStatuses[j],
          dueDate: new Date(finalDeadline.getTime() - (2 - j) * 10 * 24 * 60 * 60 * 1000),
          order: j,
        });

        // Create payments for assigned projects
        if (hasFreelancer || isExpired) {
          const payStatus = msStatuses[j] === "completed" && !isExpired ? "released" : "locked";
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

      // Activity log
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
    }

    console.log(`✅ ${products.length} default projects seeded from dummyjson.com`);
    console.log("🔑 Client: client@test.com / Test@123");
    console.log("🔑 Freelancer: freelancer@test.com / Test@123");
  } catch (err) {
    console.error("Auto-seed error:", err.message);
  }
};

const startServer = async () => {
  await connectDB();
  await ensureAdmin();
  await ensureDefaultProjects();

  app.listen(PORT, () => {
    console.log(`\n🚀 EscrowFlow API running on http://localhost:${PORT}`);
    console.log(`📋 Health: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
    console.log(`📁 Projects: http://localhost:${PORT}/api/projects`);
    console.log(`💰 Payments: http://localhost:${PORT}/api/payments`);
    console.log(`⚖️  Disputes: http://localhost:${PORT}/api/disputes`);
  });
};

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
