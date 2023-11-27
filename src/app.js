const express = require("express");
require("dotenv").config();
const app = express();

const port = process.env.APP_PORT;
const movieControllers = require("./controllers/movieControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", movieControllers.getUser);
app.get("/api/users/:id", movieControllers.getUserById);

module.exports = app;
