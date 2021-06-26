/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// eslint-disable-next-line prettier/prettier
dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB CONNECTION SUCCESFUL');
  });

const port = process.env.PORT || 3000;
// eslint-disable-next-line prettier/prettier
app.listen(port, ()=>{
  console.log(`Running on port ${port}`);
});
