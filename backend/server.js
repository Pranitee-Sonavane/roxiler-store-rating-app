const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());


app.get("/", (req, res) => {
res.send("Roxiler Store Rating API is running!!");});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});