// // seedModules.js
// const mongoose = require("mongoose");
// const Module = require("./models/Module");

// const DB_URI = "mongodb://127.0.0.1:27017/authdb";

// const modules = [
//   {
//     name: "products",
//     label: "Product Management",
//     defaultPermissions: { view: true, create: false, edit: false, delete: false },
//   },
//   {
//     name: "users",
//     label: "User Management",
//     defaultPermissions: { view: true, create: false, edit: false, delete: false },
//   },
//   {
//     name: "payments",
//     label: "Payment & Delivery",
//     defaultPermissions: { view: true, create: false, edit: false, delete: false },
//   },
//   {
//     name: "content",
//     label: "Content Management",
//     defaultPermissions: { view: true, create: false, edit: false, delete: false },
//   },
//   {
//     name: "marketing",                // NEW MODULE
//     label: "Marketing Management",    // Display label
//     defaultPermissions: {             // Default permissions
//       view: true,
//       create: false,
//       edit: false,
//       delete: false
//     },
//   },
// ];


// mongoose
//   .connect(DB_URI)
//   .then(async () => {
//     console.log("Connected to DB");

//     for (const mod of modules) {
//       // check if module already exists to avoid duplicates
//       const exists = await Module.findOne({ name: mod.name });
//       if (!exists) {
//         await Module.create(mod);
//         console.log(`Inserted module: ${mod.name}`);
//       } else {
//         console.log(`Module already exists: ${mod.name}`);
//       }
//     }

//     console.log("Seeding finished");
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error("DB connection error:", err);
//   });



// seedModules.js
const mongoose = require("mongoose");
const Module = require("./models/Module");

const DB_URI = "mongodb://127.0.0.1:27017/authdb";

// 🔥 ALL MODULES (FINAL STRUCTURE)
const modules = [
  {
    name: "products",
    label: "Product Management",
    defaultPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  },
  {
    name: "users",
    label: "User Management",
    defaultPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      ban: false, // 🔥 extra
    },
  },
  {
    name: "payments",
    label: "Payment & Delivery",
    defaultPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  },
  {
    name: "content",
    label: "Content Management",
    defaultPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      publish: false, // 🔥 optional
    },
  },
  // 🔥🔥 NEW — COMMUNITY / MODERATION SYSTEM
  {
    name: "community",
    label: "Community Moderation",
    defaultPermissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  },
];

// 🔥 MAIN FUNCTION
const seedModules = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("✅ Connected to DB");

    for (const mod of modules) {
      const result = await Module.findOneAndUpdate(
        { name: mod.name },
        mod,
        {
          upsert: true,   // insert if not exists
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`✅ Upserted module: ${result.name}`);
    }

    console.log("\n🎉 Module seeding completed successfully!");
  } catch (err) {
    console.error("❌ Error seeding modules:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  }
};

// 🔥 RUN
seedModules();