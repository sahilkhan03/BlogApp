var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost/blog_app', {useNewUrlParser: true});

var blogSchema = {
    title: String,
    image: String,
    desc: String,
    date: {type: Date, default: Date.now}
};
var blogdb = mongoose.model('blogdb', blogSchema);
blogdb.create({
    title: 'New',
    image: 'sadfnn',
    desc: 'safnv'
});

app.get('/', function (req, res) {
    blogdb.find({}, function (err, blogs) {
        if (err)
            console.log(err);
        else
            res.render('index', {blogs: blogs});
    });

});

app.listen(3000, function () {
    console.log("Server started at port 3000");
});

