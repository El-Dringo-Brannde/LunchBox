const express = require("express")
const app = express()
const path = require('path');
app.use(express.static(__dirname))

app.get("/:route/:name", function(req, res) {
  console.log(req.params.name, req.params.route)
  res.sendFile(path.join(__dirname + '/ClientSide/' + req.params.route + '/' + req.params.name))
})

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + '/ClientSide/html/home.html'))
});

app.listen(3000, function() {
  console.log("Server running at port 3000...")
});