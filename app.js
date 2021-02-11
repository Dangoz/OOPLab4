/*
 Authors: Jason
 Your name and student #: A01249922
 Your Partner's Name and student #: Hailey A01242295
 (Make sure you also specify on the Google Doc)
*/
const express = require("express");
const fsP = require("fs").promises;

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// set default movies for home page
let defaultMovieList = ["potato", "tomato", "carrot"];
app.get("/", (req, res) => res.render("pages/index", { movieNames: defaultMovieList }));

app.get("/myForm", (req, res) => res.render("pages/myForm"));

app.post("/myForm", (req, res) => {

  // clean up movie names to movieList, then respond to index page
  let movieList = req.body.movieNames.split(',').map((movie)=> movie.trim());
  res.render("pages/index", { movieNames: movieList });
});

app.get("/myListQueryString", (req, res) => {
  let movie1 = req.query.movie1;
  let movie2 = req.query.movie2;
  res.render("pages/index", { movieNames: [movie1, movie2] });
});

app.get("/search/:movieName", (req, res) => {
  let movie = req.params.movieName;

  // read text content from movie Descriptions
  fsP.readFile("./movieDescriptions.txt", "utf-8")
  .then((content) => {

    // search through each line for matching movie
    for (let line of content.split('\n')) {
      let movieDescription = line.split(':');
      if (movieDescription[0].toLowerCase() == movie.toLowerCase()) {

        // upon movie found, render page with description
        res.render("pages/searchResult", {
          movieFound: true,
          movieName: movieDescription[0],
          homePage: 'http://localhost:3000',
          movieDescription: movieDescription[1]
        });

        return;
      }
    }

    res.render("pages/searchResult", {
      movieFound: false
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});