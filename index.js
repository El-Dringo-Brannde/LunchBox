const express = require("express")
const app = express()
const path = require('path');
app.use(express.static(__dirname))

// app.get("/:route/:name", function(req, res) {
//    console.log(req.params.name, req.params.route)
//    res.sendFile(path.join(__dirname + '/ClientSide/' + req.params.route + '/' + req.params.name))
// })
app.get("/Controllers/:name", function(req, res) {
   console.log(req.params.name)
   res.sendFile(path.join(__dirname + '/ClientSide/js/Controllers/' + req.params.name))
})
app.get("/app.js", function(req, res) {
   res.sendFile(path.join(__dirname + '/ClientSide/js/app.js'))
});
app.get("/", function(req, res) {
   res.sendFile(path.join(__dirname + '/ClientSide/html/home.html'))
});

app.get("/angularjs", function(req, res) {
   res.sendFile(path.join(__dirname + '/node_modules/angular/angular.js'))
});

app.get("/login", function(req, res) {
   res.sendFile(path.join(__dirname + '/ClientSide/html/login.html'))
});


app.listen(3000, function() {
   console.log("Server running at port 3000...")
});