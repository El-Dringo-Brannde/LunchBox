const express = require("express")
const app = express()
const path = require('path');
const mongoose = require('mongoose')
var mongoURL = "monogdb://10.0.0.10:27017/lunchBox"
app.use(express.static(__dirname))

var mongo = require('mongodb').MongoClient
// Connection URL
var url = 'mongodb://localhost:27017/lunchBox';

// Use connect method to connect to the server
mongo.connect(url, function(err, db) {
   var collection = db.collection('lunchBoxMain');
   console.log("Connected successfully to server");
});


app.get("/:route/:name", function(req, res) {
   console.log(req.params.name, req.params.route)
   res.sendFile(path.join(__dirname + '/ClientSide/' + req.params.route + '/' + req.params.name))
})

app.get("/", function(req, res) {
   res.sendFile(path.join(__dirname + '/ClientSide/html/home.html'))
});

app.get("/", function(req, res) {
   res.sendFile(path.join(__dirname + '/ClientSide/html/login.html'))
});


app.listen(3000, function() {
   console.log("Server running at port 3000...")
});