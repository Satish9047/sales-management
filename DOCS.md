requirement:
install
xammp having mysql and appache server running,
latest version node.js


how to run:

1. npm install.
2. create .env file 
	in the .env file provide PORT, DATABASE_URL, SECRET_KEY 
		PORT=3005
		DATABASE_URL=mysql://<username>:<passwor>@localhost:3306/<database name>
		SECRET_KEY=secretkeyForJWT
	use you own database's username, password, and database name

3. after that run "node app.js" in your terminal.


features:
 you can you postman application to take advantage more effeciently.
1 user register:
  	http://localhost:5000/register?email=satish123@gmail.com&password=satish123
	handle by: router.post("/register", register);

2 user login
  	http://localhost:5000/login?email=satish123@gmail.com&password=satish123
	handle by: router.post("/login", login);

3.view all product:
 	http://localhost:5000/product
	handle by: router.get("/product", verifyToken, product);

4.view particular product
 	http://localhost:5000/product/1   
	handle by: router.get("/product/view/:id", viewProduct);

5. add product
  	http://localhost:5000/product/add?productName=sony&price=1500&description=flagship phone
	handle by: router.post("/product/add", verifyToken, addProduct);

6. delete product
  eg: http://localhost:5000/product/1/delete  
  handle by: router.post("/product/:id/delete", verifyToken, deleteProduct);

7. update product
  	 http://localhost:5000/product/2/update?name=realme 13&price=340&description=midrange       
	 handle by: router.post("/product/:id/update", updateProduct);

8. order product
	http://localhost:5000/product/4/order/3
	handle by: router.post("/product/:id/order/:quantity", verifyToken, addOrder);

9. delete ordered product
	http://localhost:5000/product/8/remove
	handle by: router.post("/product/:id/remove", verifyToken, deleteOrder );

Note: you have to add (Authorization section in the headers) and the provide the value of "bearer jwt-token" for the autherization to access the add, update, delete operation. 
eg: Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY4OTA1NTgxNH0.4oaABt-HjvLactRxZD87KVyu-X4R-qJ0q2hCqeY4Fpg


security features:
1. jsonwebtoken
2. bcrypt
3. validator


technology use:

1. node.js
2. express.js
3. xammp mysql and appache server
4. prisma
5. validtor
6. cors
7. express Router
8. jsonwebtoken
9. bcrypt

