const express =  require("express");
const router = express.Router();
const {login, register}= require("../Controllers/user");
const {addProduct, deleteProduct, product, viewProduct, updateProduct}= require("../Controllers/product");
const {addOrder, deleteOrder} =  require("../Controllers/order")
require('dotenv').config()
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');

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
    jwt.verify(token, secretKey, (err, decoded)=>{
      if(err){
        return res.status(400).json({ error: "Invalid token" });
      }
      next();
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Invalid token" });
  }
};
                                                                              //handeling request
router.get("/", (req, res)=>{
    res.status(200).json({msg: "Hi This is home page!"});
})



router.post("/login", login);

router.post("/register", register);

router.get("/product", verifyToken, product);

router.post("/product/:id/update", updateProduct);

router.get("/product/view/:id", viewProduct);

router.post("/product/add", verifyToken, addProduct);

router.post("/product/:id/delete", verifyToken, deleteProduct);

router.post("/product/:id/order/:quantity", verifyToken, addOrder );

router.post("/product/:id/remove", verifyToken, deleteOrder );

module.exports = router;