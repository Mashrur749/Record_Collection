
var express = require('express');
var app = express();

var PORT = process.env.PORT || "60000";

app.set('view engine', 'ejs');

app.get('/',function(req, res){
    res.send('Hello world');
});



app.listen(PORT, ()=>{
    console.log(`Server started on port: ${PORT}`);
})


