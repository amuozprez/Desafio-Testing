const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

  it("GET /cafes devuelve un status code 200 y un arreglo con al menos 1 objeto", async () => {
    const response = await request(server).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(typeof response.body[0]).toBe("object");
  });

  it("DELETE /cafes/:id devuelve un status code 404 si el café no existe", async () => {
    const cafeIdInexistente = 999; 
    const response = await request(server)
      .delete(`/cafes/${cafeIdInexistente}`)
      .set("Authorization", "token"); 

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No se encontró ningún cafe con ese id");
  });

  it("POST /cafes agrega un nuevo café y devuelve un status code 201", async () => {
    const nuevoCafe = { id: 5, nombre: "Latte" };
    const response = await request(server).post("/cafes").send(nuevoCafe);

    expect(response.status).toBe(201);
    expect(response.body).toContainEqual(nuevoCafe);
  });

  it("PUT /cafes/:id devuelve un status code 400 si el id del parámetro no coincide con el id del payload", async () => {
    const cafeModificado = { id: 5, nombre: "Latte Modificado" };
    const idDiferente = 6;

    const response = await request(server).put(`/cafes/${idDiferente}`).send(cafeModificado);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El id del parámetro no coincide con el id del café recibido");
  });
});