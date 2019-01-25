var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride=require('method-override'),
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
mongoose.connect('mongodb://localhost/blog_app', {useNewUrlParser: true});

var blogSchema = {
    title: String,
    image: String,
    desc: String,
    date: {type: Date, default: Date.now}
};
var blogdb = mongoose.model('blogdb', blogSchema);

app.get('/', function (req, res) {
    res.render('index');
});

//index
app.get('/blogs', function (req, res) {
    blogdb.find({}, function (err, blogs) {
        if (err)
            console.log(err);
        else
            res.render('blogs', {blogs: blogs});
    });

});

//new blog
app.get('/blogs/new', function (req, res) {
    res.render('new');
});

//add new blog and display in index
app.post('/blogs', function (req, res) {
    blogdb.create(req.body.blog, function (err, blog) {
        if (err)
            console.log(err);
        else
            console.log(blog);
    });
    res.redirect('/blogs');
});

//show individual blog
app.get('/blogs/:id', function (req, res) {
    blogdb.findById(req.params.id, function (err, blog) {
        if (err)
            console.log(err);
        else
            res.render('show', {blog: blog});
    });
});
//edit
app.get('/blogs/:id/edit',function (req,res) {
    blogdb.findById(req.params.id, function (err, blog) {
        if (err)
            console.log(err);
        else
            res.render('update', {blog: blog});
    });
});

//update
app.put('/blogs/:id',function (req,res) {
   blogdb.findByIdAndUpdate(req.params.id,req.body.blog,function (err,blog) {
       if(err)
           console.log(err);
       else
       {console.log(blog);
       res.redirect('/blogs/'+req.params.id);}
   });
});

//delete
app.delete('/blogs/:id',function (req,res) {
   blogdb.findByIdAndRemove(req.params.id,function (err,blog) {
       if(err)
           console.log(err);
       else
           res.redirect('/blogs');
   }) ;
});

app.listen(3000, function () {
    console.log("Server started at port 3000");
});

