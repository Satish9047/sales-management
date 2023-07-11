const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt =  require("bcrypt");
const saltRounds = 5;

const secretKey = process.env.SECRET_KEY;
                                                                 //handling login request
const login = async (req, res) => {
  let { email, password } = req.query;
                                                             // Sanitizing email and password
    email = validator.escape(email);
    password = validator.escape(password);
  try {
                                                             //validating email and password
                                                                      // Validate email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

                                                                    // Validate password
    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }


    const existUser = await prisma.user.findUnique({where: {email}});
    if(!existUser){
        return res.status(400).json({message: "account didn't exist"});
    }

    bcrypt.compare(password, existUser.password, (error, result)=>{
      if(result!==true){
        return res.status(400).json({error: "password didn't match"});
      }
      const token = jwt.sign({userId: existUser.id}, secretKey, { expiresIn: '24h'});
      res.status(200).json({message: "login successful ", token});
    })
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "internal server errror"});
  }
};

                                                                //handling registration request
const register = async (req, res) => {
  let { email, password } = req.query;
  console.log(req.query);
                                                               // Sanitizing email and password

  email = validator.escape(email);
  password = validator.escape(password);

  try {
                                                                //Validating email and password
                                                                        // Validate email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

                                                                        // Validate password
    if (!validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      return res.json({ error: "Already have an account with this email!" });
    }

    bcrypt.hash(password, saltRounds, async (error, hash)=>{
      if(error){
        return console.error(error)
      }
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hash,
        },
      });
    })

    

    res.status(200).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

                                                                    //exporting controllers
module.exports = {
  login,
  register,
};
