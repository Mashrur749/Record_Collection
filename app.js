var express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const albumService = require('./album-service');

var PORT = process.env.PORT || "60000";

app.set('view engine', 'ejs');



app.get('/', function (req, res) {
    res.render('index.ejs');
});




app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});