const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());

const movieControllers = require("./controllers/movieControllers");
const validateMovie = require("./middleware/validateMovie");
const validateUsers = require("./middleware/validateUsers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);
app.get("/api/users", movieControllers.getUser);
app.get("/api/users/:id", movieControllers.getUserById);


app.post("/api/movies", validateMovie, movieControllers.postMovie);
app.post("/api/users", validateUsers, movieControllers.postUsers);


app.put("/api/movies/:id", validateMovie, movieControllers.updateMovie);
app.put("/api/users/:id", validateUsers, movieControllers.updateUser);
module.exports = app;
