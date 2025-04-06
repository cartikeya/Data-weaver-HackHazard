const express = require("express");
const app = express();
const port = 8080;
const path = require('path');


app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("src")); 
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));



app.get("/", (req, res) => {
    res.render("index"); 
});

app.get("/urlscrape", (req, res) => {
    res.render("./URLscraping/urlscraping"); 
});

app.get("/promptscrape", (req, res) => {
    res.render("./promptscraping/promptscraping"); 
});

app.listen(port, () => {
    console.log("Server is listening on port", port);
});
