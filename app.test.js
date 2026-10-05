const request = require("supertest");
const app = require("./app");

describe("Node application", () => {

    test("GET / should return success", async () => {

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Hello from Node.js");

    });

    test("GET /health should return UP", async () => {

        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("UP");

    });

});