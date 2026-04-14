// // filelocation: Final_Year_Project/Backend/controllers/chatbotProductController.js

// const Product = require("../models/Product");

// // Fields safe to expose to the chatbot / end users
// // Excludes: oldPrice, image2, image3, trending, topPick, policies, timestamps, __v
// const SAFE_PROJECTION = {
//   name: 1,
//   category: 1,
//   subtitle: 1,
//   price: 1,
//   stock: 1,
//   tags: 1,
//   onSale: 1,
//   image1: 1,
//   "care.level": 1,
//   "care.sunlight": 1,
//   "care.water": 1,
//   "care.temp": 1,
//   "care.tips": 1,
// };

// /**
//  * GET /api/products/chatbot
//  * Query params:
//  *   category  – filter by category name (case-insensitive)
//  *   name      – search by plant name (partial match)
//  *   onSale    – "true" → only sale items
//  *   inStock   – "false" to include out-of-stock (default: only in-stock)
//  *   limit     – max results (default 6, max 10)
//  */
// const getChatbotProducts = async (req, res) => {
//   try {
//     const { category, name, onSale, inStock, limit } = req.query;

//     const filter = {};

//     // Always show only in-stock items unless explicitly asked otherwise
//     if (inStock !== "false") {
//       filter.stock = { $gt: 0 };
//     }

//     // Category filter — map common chatbot terms to DB category values
//     if (category) {
//       const categoryMap = {
//         indoor: "Indoor",
//         outdoor: "Outdoor",
//         succulent: "Succulent",
//         succulents: "Succulent",
//         cactus: "Succulent",
//         flowering: "Flowering",
//         "air purifying": "Air Purifying",
//         "air-purifying": "Air Purifying",
//         airpurifying: "Air Purifying",
//       };
//       const mapped = categoryMap[category.toLowerCase()] || category;
//       filter.category = { $regex: new RegExp(mapped, "i") };
//     }

//     // Name search — partial, case-insensitive
//     if (name) {
//       filter.$or = [
//         { name: { $regex: new RegExp(name, "i") } },
//         { tags: { $in: [new RegExp(name, "i")] } },
//         { subtitle: { $regex: new RegExp(name, "i") } },
//       ];
//     }

//     // Sale filter
//     if (onSale === "true") {
//       filter.onSale = true;
//     }

//     const maxLimit = Math.min(parseInt(limit) || 6, 10);

//     const plants = await Product.find(filter)
//       .select(SAFE_PROJECTION)
//       .limit(maxLimit)
//       .lean();

//     return res.json({ plants, total: plants.length });
//   } catch (err) {
//     console.error("Chatbot product fetch error:", err.message);
//     return res.status(500).json({ error: "Could not fetch products." });
//   }
// };

// /**
//  * GET /api/products/chatbot/availability?name=monstera
//  * Used by the Rasa action server to check a specific plant
//  */
// const checkChatbotAvailability = async (req, res) => {
//   try {
//     const { name } = req.query;

//     if (!name) {
//       return res.status(400).json({ error: "Plant name is required." });
//     }

//     const plant = await Product.findOne({
//       $or: [
//         { name: { $regex: new RegExp(name, "i") } },
//         { tags: { $in: [new RegExp(name, "i")] } },
//       ],
//     })
//       .select(SAFE_PROJECTION)
//       .lean();

//     if (!plant) {
//       return res.json({ found: false, available: false });
//     }

//     return res.json({
//       found: true,
//       available: plant.stock > 0,
//       name: plant.name,
//       price: plant.price,
//       stock: plant.stock,
//       onSale: plant.onSale,
//       care: plant.care,
//       image: plant.image1 || null,
//     });
//   } catch (err) {
//     console.error("Chatbot availability error:", err.message);
//     return res.status(500).json({ error: "Could not check availability." });
//   }
// };

// module.exports = { getChatbotProducts, checkChatbotAvailability };

const Product = require("../models/Product");

// Fields safe to expose to the chatbot / end users
const SAFE_PROJECTION = {
  name: 1,
  category: 1,
  subtitle: 1,
  price: 1,
  stock: 1,
  tags: 1,
  onSale: 1,
  image1: 1,
  "care.level": 1,
  "care.sunlight": 1,
  "care.water": 1,
  "care.temp": 1,
  "care.tips": 1,
};

/**
 * GET /api/products/chatbot
 */
const getChatbotProducts = async (req, res) => {
  try {
    const { category, name, onSale, inStock, limit } = req.query;
    const filter = {};

    // Filter in-stock unless explicitly asked otherwise
    if (inStock !== "false") {
      filter.stock = { $gt: 0 };
    }

    // Category mapping
    if (category) {
      const categoryMap = {
        indoor: "Indoor",
        outdoor: "Outdoor",
        succulent: "Succulent",
        succulents: "Succulent",
        cactus: "Succulent",
        flowering: "Flowering",
        "air purifying": "Air Purifying",
        "air-purifying": "Air Purifying",
        airpurifying: "Air Purifying",
      };
      const mapped = categoryMap[category.toLowerCase()] || category;
      filter.category = { $regex: new RegExp(mapped, "i") };
    }

    // Name search
    if (name) {
      filter.$or = [
        { name: { $regex: new RegExp(name, "i") } },
        { tags: { $in: [new RegExp(name, "i")] } },
        { subtitle: { $regex: new RegExp(name, "i") } },
      ];
    }

    // Sale filter
    if (onSale === "true") {
      filter.onSale = true;
    }

    const maxLimit = Math.min(parseInt(limit) || 6, 10);

    // Try fetching plants
    let plants = await Product.find(filter).select(SAFE_PROJECTION).limit(maxLimit).lean();

    // If none found, try removing stock filter
    if (!plants.length && inStock !== "false") {
      const retryFilter = { ...filter };
      delete retryFilter.stock;
      plants = await Product.find(retryFilter).select(SAFE_PROJECTION).limit(maxLimit).lean();
    }

    return res.json({ plants, total: plants.length });
  } catch (err) {
    console.error("Chatbot product fetch error:", err.message);
    return res.status(500).json({ error: "Could not fetch products." });
  }
};

/**
 * GET /api/products/chatbot/availability?name=monstera
 */
const checkChatbotAvailability = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) return res.status(400).json({ error: "Plant name is required." });

    const plant = await Product.findOne({
      $or: [
        { name: { $regex: new RegExp(name, "i") } },
        { tags: { $in: [new RegExp(name, "i")] } },
      ],
    })
      .select(SAFE_PROJECTION)
      .lean();

    if (!plant) return res.json({ found: false, available: false });

    return res.json({
      found: true,
      available: plant.stock > 0,
      name: plant.name,
      price: plant.price,
      stock: plant.stock,
      onSale: plant.onSale,
      care: plant.care,
      image: plant.image1 || null,
    });
  } catch (err) {
    console.error("Chatbot availability error:", err.message);
    return res.status(500).json({ error: "Could not check availability." });
  }
};

module.exports = { getChatbotProducts, checkChatbotAvailability };