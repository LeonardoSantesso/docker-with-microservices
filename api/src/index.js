const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const { port, host, db, authApiUrl } = require("./configuration");
const { connectDb } = require("./helpers/db");

const app = express();

const kittySchema = new mongoose.Schema({
    name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

app.get("/test", (req, res) => {
  res.send("Our api server is working correctly");
});

app.get("/api/testApiData", (req, res) => {
  res.json({
    testApiData: true   
  })
});

app.get("/testwithcurrentuser", (req, res) => {
  axios.get(authApiUrl + '/currentUser')
  .then(function (response) {
    res.json({
      testwithcurrentuser: true,
      currentUserFromAuth: response.data
    })
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
});

const startServer = () => {
  app.listen(port, () => {
    console.log(`Started api service on port ${port}`);
    console.log(`Our host is ${host}`);
    console.log(`Database URL ${ db }`);
    console.log(`Auth api URL ${ authApiUrl }`);

    const silence = new Kitten({ name: 'Tigreza' });
    silence.save();    
    console.log("Result", silence);            
  });
};

connectDb()
  .on("error", console.log)
  .on("disconnected", connectDb)
  .once("open", startServer);