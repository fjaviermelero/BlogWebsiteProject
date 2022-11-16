//jshint esversion:6

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/BlogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: {
      type: String,
      required:true
  },
  text: String
});

const Post = mongoose.model("post", postSchema);

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Lodash

const _ = require("lodash");
app.locals._ = _;

//Global Variables

let posts = [];

//GETS

app.get('/', (req,res) => {

  Post.find(
    (err,foundPosts)=>{
      if (err){
        console.log(err);
      } else {
      console.log(foundPosts);
      posts = foundPosts;
      res.render('home.ejs', {postsVar: posts});
      }
    }
  )
})

app.get('/about', (req,res) => {

  res.render('about.ejs', {aboutContentVar: aboutContent});
})

app.get('/contact', (req,res) => {

  res.render('contact.ejs', {contactContentVar: contactContent});
})

app.get('/compose', (req,res) => {

  res.render('compose.ejs');
})

app.get('/posts/:postId', (req,res) => {

  posts.forEach( post =>{

    if (_.lowerCase(req.params.postId) === _.lowerCase(post._id)){

      res.render('post.ejs', {postTitleVar: post.title, postTextVar: post.text});

    }
    else {
      console.log("Not match");
    }
  })

})

//POSTS

app.post('/compose', (req,res) => {

  const newPost = new Post({
    title: req.body.composeTitle,
    text: req.body.composeText
  })

  newPost.save();

  res.redirect('/');
})

//PORT

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

