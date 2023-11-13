const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
var mySalt = 'secretkey';
// const productSchema = require('./schemas/productSchema.js');
const userSchema = require('./schemas/userSchema');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
var temp = 0;
const port = 8080;

dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("server started successfully");
});

//login api
app.post('/login', (req, res) => {
  const loginCredentials = {
    username: "Letsupgrade", password: "password222"
  }
  const userDetails = {
    FullName: "Student letsupgrade",
    Username: "letsupgrade",
    DOB: "24-03-1994",
    City: "Bangalore",
    Email: "student@letsupgrade.com",
    Phone: "9999999999",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfE5wxi0M7x5aK418lpGUQhiWxMUFiFSP6hw&usqp=CAU"
  };
  const { username, password } = req.body;
  if (username === loginCredentials.username) {
    if (password === loginCredentials.password) {
      var token = jwt.sign(userDetails, mySalt);
      res.status(200).send(token);
    }
  }
});

//dp removing api
app.post('/removedp', (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mySalt);
  if (decoded) {
    let updatedDetails = { ...userDetails };
    updatedDetails.avatar = "";
    let token = jwt.sign(updatedDetails, mySalt);
    res.status(200).send({ msg: 'Dp removed successfully', token: token });
  } else {
    res.status(401).send({ msg: 'Unauthorized request for DP removal' });
  }
});

//getting product list
app.post('/getproducts', async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mySalt);
  const products = await userSchema.find({
    username: decoded.username
  });
  res.status(200).send(products);
});

//filtering product list by category
app.post('/filter-by-category', async (req, res) => {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, mySalt);
  var username = decoded.username;
  if (req.body.category == "") {
    var products = await userSchema.find({
      username: username,
    });
    const prodArr = products.map((elem) => {
      return elem.associatedProducts;
    });
    res.status(200).send(prodArr);
  }
  else {
    var products = await userSchema.find({
      username: username, "associatedProducts.category": req.body.category,
    });
    var prodArr = products.map((elem) => {
      return elem.associatedProducts;
    });
    res.status(200).send(prodArr);
  }
});

//adding product into database
app.post('/addproduct', async (req, res) => {
  try {
    const { name, shipping, category, quantity, price } = req.body;
    var token = req.header.authorization;
    var decoded = jwt.verify(token, mySalt);
    console.log(decoded);
    const username = decoded.username;
    var newProduct = {
      username: username,
      associatedProducts: {
        name: name,
        id: "LU_" + (++temp),
        shipping: shipping,
        category: category,
        quantity: quantity,
        price: price
      }
    };
    const product = new userSchema(newProduct);
    const stocked = await product.save();
    if (stocked) {
      res.status(200).send({ message: "product added successfully" });
    }
  } catch (err) {
    res.status(500).send({ message: "Some error occurred", error: err });
  }
});