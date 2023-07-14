const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

//add order handler
const addOrder = async (req, res) => {
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
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, secretKey);
  const userId = decodedToken.userId;
  console.log(userId);

  let { id, quantity } = req.params;

  id = parseInt(id);
  quantity = parseInt(quantity);

  try {
    const existProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existProduct) {
      return res.status(400).json({ error: "Didn't found product" });
    }
    if (typeof quantity !== "number") {
      return res.status(400).json({ error: "invalid order quantity" });
    }
    const newOrder = await prisma.order.create({
      data: {
        quantity,
        order_date: new Date(),
        userId,
        productId: parseInt(id),
      },
    });
    res.status(200).json({ msg: "successfully ordered the product!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
//view order handler
const viewOrder = async (req, res)=>{
  const orderDetails = await prisma.order.findMany({
    include: {
      user: true,
      product: true,
    },
  });
  const viewOrderDetails = orderDetails.map((order)=>({
    id: order.id,
    userName: order.user.email,
    productName: order.product.name,
    date: order.order_date,
    quantity: order.quantity
  }))
  res.status(200).json(viewOrderDetails);
}

//delete order handler 
 const deleteOrder = async (req, res)=>{
  const {id}=req.params;
  const parseId = parseInt(id);
  try {
      if (isNaN(parseId)) {
        return res.status(400).json({ error: "Invalid input" });
      }
      const existProduct = await prisma.product.findUnique({where: {id: parseId}});
      if(!existProduct){
        return res.status(400).json({error: "Product didn't exist!"});
      }
      if(typeof parseId!=="number"){
        return res.status(400).json({error: "invalid input"});
      }
      await prisma.order.deleteMany({where: {productId: parseId}});
      const removeOrder = await prisma.product.delete({where: {id: parseId}});
      res.status(200).json({msg: "order successfull removed"})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "server error"});
  }
}
  

module.exports = {
  addOrder,
  deleteOrder,
  viewOrder,
};
