// seedModules.js
const mongoose = require("mongoose");
const Module = require("./models/Module");

const DB_URI = "mongodb://127.0.0.1:27017/authdb";

const modules = [
  {
    name: "products",
    label: "Product Management",
    defaultPermissions: { view: true, create: false, edit: false, delete: false },
  },
  {
    name: "users",
    label: "User Management",
    defaultPermissions: { view: true, create: false, edit: false, delete: false },
  },
  {
    name: "payments",
    label: "Payment & Delivery",
    defaultPermissions: { view: true, create: false, edit: false, delete: false },
  },
  {
    name: "content",
    label: "Content Management",
    defaultPermissions: { view: true, create: false, edit: false, delete: false },
  },
];

mongoose
  .connect(DB_URI)
  .then(async () => {
    console.log("Connected to DB");

    for (const mod of modules) {
      // check if module already exists to avoid duplicates
      const exists = await Module.findOne({ name: mod.name });
      if (!exists) {
        await Module.create(mod);
        console.log(`Inserted module: ${mod.name}`);
      } else {
        console.log(`Module already exists: ${mod.name}`);
      }
    }

    console.log("Seeding finished");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
