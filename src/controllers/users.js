const database = require("../../database");

// const getUser = (req, res) => {
//   database
//     .query("select * from users")
//     .then(([users]) => {
//       res.json(users); // use res.json instead of console.log
//     })
//     .catch((err) => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// };

// const getUserById = (req, res) => {
//   const id = parseInt(req.params.id);

//   database
//     .query("select * from users where id = ?", [id])
//     .then(([users]) => {
//       if (users[0] != null) {
//         res.json(users[0]);
//       } else {
//         res.sendStatus(404);
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.sendStatus(500);
//     });
// };

// const getMovies = (req, res) => {
//   res.json(movies);
// };

// const getMovieById = (req, res) => {
//   const id = parseInt(req.params.id);

//   const movie = movies.find((movie) => movie.id === id);

//   if (movie != null) {
//     res.json(movie);
//   } else {
//     res.status(404).send("Not Found");
//   }
// };

// module.exports = {
//   getUser,
//   getUserById,
// };
