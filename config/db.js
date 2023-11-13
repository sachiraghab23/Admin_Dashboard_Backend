const mongoose = require('mongoose');
// const dbURL = 'mongodb+srv://sachiraghab:<password>@cluster0.0rf1haf.mongodb.net/?retryWrites=true&w=majority'

// mongoose.set('strictQuery', false);
const connectDB = async () => {
  mongoose.connect(process.env.dbURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log(`Server running on ${mongoose.connection.host}`);
  }
  )
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connectDB;