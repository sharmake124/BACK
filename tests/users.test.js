const request = require("supertest");
const database = require("../database");
afterAll(() => database.end());
const app = require("../src/app");
const crypto = require("node:crypto");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/2");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUtilasateur = {
      firstname: "yoyo",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUtilasateur);
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );
    const [userInDatabase] = result;

    expect(userInDatabase).toMatchObject(newUtilasateur);
  });

  it("should return an error for incomplete user data", async () => {
    const userWithMissingProps = {
      firstname: "shakashakeboom",
    };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
    expect(response.status).toEqual(422);
  });
});

/** put  */

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUtilasateur = {
      firstname: "Patric",
      lastname: "Alain",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "lyon",
      language: "anglais",
    };

    const [result] = await database.query(
      "INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUtilasateur.firstname,
        newUtilasateur.lastname,
        newUtilasateur.email,
        newUtilasateur.city,
        newUtilasateur.language,
      ]
    );

    const id = result.insertId;

    const updateUser = {
      firstname: "Avatar",
      lastname: "Cameron",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "Japonais",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updateUser);

    expect(response.status).toEqual(204);

    const [res2] = await database.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);

    const [userInDatabase] = res2;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updateUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updateUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updateUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updateUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updateUser.language);
  });

  it("should return no user", async () => {
    const newtt = {
      firstname: "Harry Potter",
      lastname: "hhhhhhh",
      email: "ffffff",
      city: "llll",
      language: "ffff",
    };

    const response = await request(app).put("/api/users/0").send(newtt);

    expect(response.status).toEqual(404);
  });
});


/** DELETE USER */

/* DELETE DELETE DELETE ===== DELETE */
describe("DELETE /api/users/:id", () => {
  it("should delete a user", async () => {
    // Insert a movie into the database to delete later
    const [insertResult] = await database.query(
      "INSERT INTO users(firstname, lastname, email,city , language) VALUES (?, ?, ?, ?, ?)",
      ["To be deleted", "Director", "2000", "1", "hhhh"]
    );
    const idToDelete = insertResult.insertId;

    const response = await request(app).delete(`/api/users/${idToDelete}`);

    expect(response.status).toEqual(204);

    // Verify that the movie has been deleted from the database
    const [selectResult] = await database.query(
      "SELECT * FROM users WHERE id=?",
      idToDelete
    );

    expect(selectResult.length).toEqual(0);
  });

  it("should return 404 for non-existing movie", async () => {
    const nonExistingId = 999;

    const response = await request(app).delete(`/api/users/${nonExistingId}`);

    expect(response.status).toEqual(404);
  });
});
