const request = require("supertest");
const app = require("../app");

describe("GET /api/movies", () => {
  it("should return all movies", async () => {
    const response = await request(app).get("/api/movies");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return film id or details", async () => {
    const response = await request(app).get("/api/movies/1");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });
  it("it should return  as Json format the film with id 1", async () => {
    const response = await request(app).get("/api/movies/1");
    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return 404 because there no Id 0", async () => {
    const response = await request(app).get("/api/movies/0");
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Aucun film trouvé avec cet ID.");
  });
});

// expect(response.headers["content-type"]).toMatch(/json/);
