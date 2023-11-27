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
    const response = await request(app).get("/api/users/1");

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
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUser);

    // Vérifie que la réponse a un statut HTTP 201
    expect(response.status).toBe(201);

    // Vérifie que le corps de la réponse contient une propriété "id" de type nombre
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    // Récupère l'utilisateur créé depuis la base de données
    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );
    const [userInDatabase] = result;

    // Vérifie que les données de la base de données correspondent aux données envoyées
    expect(userInDatabase).toMatchObject(newUser);
  });

  it("should return an error for incomplete user data", async () => {
    // Crée un objet avec des données d'utilisateur manquantes
    const userWithMissingProps = {
      firstname: "Marie",
      lastname: "Martin",
    };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
    expect(response.status).toEqual(500);
  });
});
