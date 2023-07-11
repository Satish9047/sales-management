const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;


//handeling product request
const product = async (req, res) => {
  try {
    const resData = await prisma.product.findMany({});
    const data = resData;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

//handeling each product
const viewProduct = async (req, res) => {
  const productId = parseInt(req.query.id);
    try {
      const productInfo = await prisma.product.findUnique({where: { id: productId }});
      if (!productInfo) {
        return res.status(400).json({ error: "No product found" });
      }
      const data = productInfo;
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "internal server error" });
    }
};

//handeling addproduct
const addProduct = async (req, res) => {
    const verifyAuthJWT = (req, res) => {
        //verifying jwt
        jwt.verify(
          req.headers.authorization.split(" ")[1],
          secretKey,
          (err, data) => {
            if (err) {
              return res.send({ error: "invalid token" });
            }
            res.json({
              message: "profile accessed",
              data,
            });
          }
        );
      };
    
    let { productName, price, description } = req.query;
  
    // Check if the variables exist
    if (!productName || !price || !description) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
  
    // Sanitizing the input value
    productName = validator.escape(productName);
    price = validator.escape(price);
    description = validator.escape(description);
  
    try {
      // Validating the input value
      if (typeof productName !== "string") {
        return res.status(400).json({ error: "Invalid product name type" });
      }
      if (isNaN(parseFloat(price)) || !isFinite(price)) {
        return res.status(400).json({ error: "Invalid price type" });
      }
      if (typeof description !== "string") {
        return res.status(400).json({ error: "Invalid description type" });
      }
  
      // Adding the product into the database
      const newProduct = await prisma.product.create({
        data: {
          name: productName,
          price: parseFloat(price),
          description,
        },
      });
      res.status(200).json({ message: "Product added successfully", product: newProduct });
      
    } catch (error) {
      console.error(error);
    }
  };
  
  

  

//handleing update request
const updateProduct = async (req, res) => {
    const verifyAuthJWT = (req, res) => {
        //verifying jwt
        jwt.verify(
          req.headers.authorization.split(" ")[1],
          secretKey,
          (err, data) => {
            if (err) {
              return res.send({ error: "invalid token" });
            }
            res.json({
              message: "profile accessed",
              data,
            });
          }
        );
      };
  let { name, price, description } = req.query;
  if (!name || !price || !description) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  let productId = req.params.id;
  productId = validator.escape(productId);
  name = validator.escape(name);
  price = parseFloat(price);
  description = validator.escape(description);

  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
  });
  if (!product) {
    return res.status(400).json({ error: "product not found" });
  }
  const updateProductInfo = await prisma.product.update({
    where: { id: parseInt(productId) },
    data: {
      name,
      price,
      description,
    },
  });
  return res.status(200).json({ message: "Product updated successfully", product: updateProductInfo });
};

//handeling delete request
const deleteProduct = async (req, res) => {
    const verifyAuthJWT = (req, res) => {
        //verifying jwt
        jwt.verify(
          req.headers.authorization.split(" ")[1],
          secretKey,
          (err, data) => {
            if (err) {
              return res.send({ error: "invalid token" });
            }
            res.json({
              message: "profile accessed",
              data,
            });
          }
        );
      };

    let id = req.params.id;
  
    //sanitizing the input value
    id = validator.escape(id);
    id = parseInt(id);
  
    try {
      const existProduct = await prisma.product.findUnique({ where: { id } });
      if (!existProduct) {
        return res.status(400).json({ error: "There is no such product" });
      }
      await prisma.product.delete({ where: { id } });
      res.json({ message: "The product deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal error occurred" });
    }
  };

//exporting the prduct functationality
module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  product,
  viewProduct,
};
