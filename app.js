const express= require("express");
const app = express();
const path = require("path");
const apipath = path.join(__dirname, "backend", "api");
const api = require(apipath);

app.use(express.static(path.join(__dirname, "build")));
app.use(api);


app.listen(3000, () =>{
    console.log("Listening on 3000");
})