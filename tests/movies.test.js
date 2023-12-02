const request = require("supertest");
const database = require("../database");
afterAll(() => database.end());
const app = require("../src/app");

/*  GET  GET  GET ===== READ  */
describe("GET /api/movies", () => {
  it("should return all movies", async () => {
    const response = await request(app).get("/api/movies");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return one movie", async () => {
    const response = await request(app).get("/api/movies/1");
    console.log(response.body)
    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no movie", async () => {
    const response = await request(app).get("/api/movies/0");

    expect(response.status).toEqual(404);
  });
});

/*  POST POST POST ===== CREATE  */

describe("POST /api/movies", () => {
  it("should return created movie", async () => {
    const newMovie = {
      title: "Star Wars",
      director: "George Lucas",
      year: "1977",
      color: true,
      duration: 120,
    };

    const response = await request(app).post("/api/movies").send(newMovie);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      response.body.id
    );

    const [movieInDatabase] = result;

    expect(movieInDatabase).toHaveProperty("id");

    expect(movieInDatabase).toHaveProperty("title");
    expect(movieInDatabase.title).toStrictEqual(newMovie.title);
  });

  it("should return an error", async () => {
    const movieWithMissingProps = { title: "Harry Potter" };

    const response = await request(app)
      .post("/api/movies")
      .send(movieWithMissingProps);
    expect(response.status).toEqual(422);
  });
});

/*  PUT PUT PUT ===== UPDATE  */

describe("PUT /api/movies/:id", () => {
  it("should edit movie", async () => {
    const newMovie = {
      title: "shakashakaboom",
      director: "Alan jjj",
      year: "2023",
      color: "0",
      duration: 120,
    };

    const [result] = await database.query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [
        newMovie.title,
        newMovie.director,
        newMovie.year,
        newMovie.color,
        newMovie.duration,
      ]
    );

    const id = result.insertId;

    const updatedMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2010",
      color: "1",
      duration: 162,
    };

    const response = await request(app)
      .put(`/api/movies/${id}`)
      .send(updatedMovie);

    expect(response.status).toEqual(204);

    const [resultRes] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      id
    );

    const [movieInDatabase] = resultRes;

    expect(movieInDatabase).toHaveProperty("id");

    expect(movieInDatabase).toHaveProperty("title");
    expect(movieInDatabase.title).toStrictEqual(updatedMovie.title);

    expect(movieInDatabase).toHaveProperty("director");
    expect(movieInDatabase.director).toStrictEqual(updatedMovie.director);

    expect(movieInDatabase).toHaveProperty("year");
    expect(movieInDatabase.year).toStrictEqual(updatedMovie.year);

    expect(movieInDatabase).toHaveProperty("color");
    expect(movieInDatabase.color).toStrictEqual(updatedMovie.color);

    expect(movieInDatabase).toHaveProperty("duration");
    expect(movieInDatabase.duration).toStrictEqual(updatedMovie.duration);
  });

  it("should return no movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };

    const response = await request(app).put("/api/movies/0").send(newMovie);

    expect(response.status).toEqual(404);
  });
});

/** DELETE MOVIES  */

describe("DELETE /api/movies/:id", () => {
  it("should delete a movie", async () => {
    
    const [insertResult] = await database.query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      ["To be deleted", "Director", "2000", "1", 120]
    );
    const idToDelete = insertResult.insertId;

    const response = await request(app).delete(`/api/movies/${idToDelete}`);

    expect(response.status).toEqual(204);

    // Verify that the movie has been deleted from the database
    const [selectResult] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      idToDelete
    );

    expect(selectResult.length).toEqual(0);
  });

  it("should return 404 for non-existing movie", async () => {
    const nonExistingId = 999;

    const response = await request(app).delete(`/api/movies/${nonExistingId}`);

    expect(response.status).toEqual(404);
  });
});
