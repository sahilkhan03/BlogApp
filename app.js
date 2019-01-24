var express = require('express'),
    mongoose= require('mongoose'),
    bodyParser=require('body-parser'),
    app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:3000/blog_app');

var blogSchema={
                   title : String,
                   image: String,
                   desc: String,
                    date:Date.now();
                }
var blogdb=mongoose.model('blogdb',blogSchema);

app.get('/',function (req,res) {
res.send('Hello');
});

app.listen(3000,function () {
    console.log("Server started at port 3000");
});

