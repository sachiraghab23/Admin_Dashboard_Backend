const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
var mySalt = 'secretkey';
const productSchema = require('./productSchema');
const dotenv = require('dotenv');
import connectDB from './config/db.js';

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
  // const product_details = {
  //   id: "LU_01",
  //   category: "Electronics",
  //   name: "Headphone",
  //   quantity: 20,
  //   price: 300,
  //   shipping: 5,
  //   unitsSold: 15,
  // };
  // const product = new productSchema(product_details);
  // const add = await product.save();
  // console.log(add);
  const products = await productSchema.find({});
  // console.log(products);
  res.status(200).send(products);
});