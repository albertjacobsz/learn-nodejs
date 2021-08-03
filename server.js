/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('Uncaught exception, shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
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
const server = app.listen(port, ()=>{
  console.log(`Running on port ${port}`);
});
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection, shutting down');
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received shutting down...')
  server.close(() => {
    
  })
})