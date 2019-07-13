var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
    app = express()
    methodOverride= require("method-override")

mongoose.connect("mongodb://localhost:27017/CricBlog", {useNewUrlParser: true})

var blogSchema= new mongoose.Schema({
    title : String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog= mongoose.model("Blog", blogSchema)

app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"))

//ROUTES
app.get("/", function (req, res) {
    res.redirect("/blogs")
})
app.get("/blogs", function (req, res) {
    Blog.find(function (err, blogs) {
        if (err){
            console.log(err)
        } else{
            res.render("index", {blogs:blogs})
        }
    })
})

app.get("/blogs/new", function (req, res) {
    res.render("new")
})

app.post("/blogs", function (req, res) {
    if (req.body.body=="" || req.body.image=="" || req.body.title=="") {
        alert("Missing Values, Cannot Add Blog")
        res.redirect("/blogs")
    }
    Blog.create(req.body.body, function (err, blog) {
        if (err){
            console.log(err)
        } else{
            res.redirect("/blogs")
        }
    })
})

app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err){
            console.log(err)
        } else{
            res.render("show", {blog:blog})
        }
    })
})

//UPDATE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, blog) {
        if (err){
            console.log(err)
        } else{
            res.render("edit", {blog:blog})
        }
    })
})

app.put("/blogs/:id", function (req, res) {
    if (req.body.body=="" || req.body.image=="" || req.body.title=="") {
        alert("Missing Values, Cannot Update")
        res.redirect("/blogs/"+req.params.id)
    }
    Blog.findByIdAndUpdate(req.params.id, req.body.body, function (err, blog) {
        if(err){
            console.log(err)
        } else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err, blog) {
        if(err){
            console.log(err)
        } else{
            res.redirect("/blogs")
        }
    })
})

app.listen(3000, function () {
    console.log("Server Started")
})