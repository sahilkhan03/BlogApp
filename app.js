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

//index
app.get('/', function (req, res) {
    blogdb.find({}, function (err, blogs) {
        if (err)
            console.log(err);
        else
            res.render('index', {blogs: blogs});
    });

});

//new
app.get('/new', function (req, res) {
    res.render('new');
});
//post
app.post('/', function (req, res) {
    blogdb.create(req.body.blog, function (err, blog) {
        if (err)
            console.log(err);
        else
            console.log(blog);
    });
    res.redirect('/');
});


app.listen(3000, function () {
    console.log("Server started at port 3000");
});

