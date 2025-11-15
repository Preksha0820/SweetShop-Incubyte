import Sweet from "../models/Sweet.js";
import User from "../models/User.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------- CREATE SWEET ----------------------
export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    
    const imageUrl = req.file ? `/public/uploads/${req.file.filename}` : null;

    const sweet = new Sweet({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl
    });

    await sweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- LIST ALL SWEETS ----------------------
export const listSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- SEARCH SWEETS ----------------------
export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = category;

    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const sweets = await Sweet.find(filter);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- UPDATE SWEET ----------------------
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    const { name, category, price, quantity } = req.body;

    if (name != null) sweet.name = name;
    if (category != null) sweet.category = category;
    if (price != null) sweet.price = parseFloat(price);
    if (quantity != null) sweet.quantity = parseInt(quantity);
    
    if (req.file) {
      if (sweet.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../', sweet.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      sweet.imageUrl = `/public/uploads/${req.file.filename}`;
    }

    await sweet.save();
    res.json(sweet);
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- DELETE SWEET ----------------------
export const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    if (sweet.imageUrl) {
      const imagePath = path.join(__dirname, '../../', sweet.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await sweet.deleteOne();
    res.json({ message: "Sweet deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- PURCHASE SWEET ----------------------
export const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    const qty = parseInt(req.body.quantity || "1");
    if (qty <= 0) return res.status(400).json({ message: "Invalid quantity" });
    if (sweet.quantity < qty)
      return res.status(400).json({ message: "Not enough stock" });

    // Decrease sweet quantity
    sweet.quantity -= qty;
    await sweet.save();

    // Add order to user's order history
    const user = await User.findById(req.user._id);
    if (user) {
      user.orders.push({
        sweetId: sweet._id,
        sweetName: sweet.name,
        quantity: qty,
        price: sweet.price,
        totalPrice: sweet.price * qty,
        purchaseDate: new Date()
      });
      await user.save();
    }

    res.json({ message: "Purchase successful", sweet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- RESTOCK SWEET ----------------------
export const restockSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    const qty = parseInt(req.body.quantity || "1");
    if (qty <= 0) return res.status(400).json({ message: "Invalid quantity" });

    sweet.quantity += qty;
    await sweet.save();
    res.json({ message: "Restocked", sweet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------- GET USER ORDERS ----------------------
export const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('orders');
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Sort orders by most recent first
    const sortedOrders = user.orders.sort((a, b) => 
      new Date(b.purchaseDate) - new Date(a.purchaseDate)
    );
    
    res.json(sortedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};