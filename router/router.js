const express = require("express");
const router = express.Router();
const { login, register } = require("../Controllers/user");
const {
  addProduct,
  deleteProduct,
  product,
  viewProduct,
  updateProduct,
} = require("../Controllers/product");
const { addOrder, deleteOrder, viewOrder } = require("../Controllers/order");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  generateTopSellingReport,
} = require("../Controllers/report");

const prisma = new PrismaClient();
//building the jwt middleware
const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const authToken = req.headers["authorization"];
    if (!authToken) {
      return res
        .status(400)
        .json({ error: "Invalid authentication. Token required" });
    }
    const token = authToken.split(" ")[1];
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
      }
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Invalid token" });
  }
};
//handeling request
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Hi This is home page!" });
});


//login route handler
router.post("/login", login);

//register route handler
router.post("/register", register);

//product router handle -show all the products
router.get("/product", verifyToken, product);

// add product route handler
router.post("/product/add", verifyToken, addProduct);

//update product route handler
router.post("/product/:id/update", updateProduct);

//view single product route handler - show specific product.
router.get("/product/view/:id", viewProduct);

//delete product route handler
router.post("/product/:id/delete", verifyToken, deleteProduct);

//ordering the product route handler
router.post("/product/:id/order/:quantity", verifyToken, addOrder);

//view all the orders route handler
router.get("/order", verifyToken, viewOrder);

//remove order route handler
router.post("/order/:id/remove", verifyToken, deleteOrder);

//report handler - daily, weekly, monthly.
router.get("/reports/daily", verifyToken, getDailyReport);
router.get("/reports/weekly", verifyToken, getWeeklyReport);
router.get("/reports/monthly", verifyToken, getMonthlyReport);

//report handler - topselling
router.get("/reports/topselling", verifyToken, generateTopSellingReport);

module.exports = router;
