const mongoose = require("mongoose");
const logger = require("./logger");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      logger.info("Successfully connected to Mongo database");
    })
    .catch((error) => {
      logger.error(error.message);
      process.exit(1);
    });
};