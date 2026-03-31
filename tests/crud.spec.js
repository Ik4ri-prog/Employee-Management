const { test, expect } = require("@playwright/test");

const API_URL = "http://localhost:5000/api/dynamic/employees";

let createdId = null;

test.describe("Employee CRUD + Audit Logs", () => {

  test("CREATE employee", async ({ request }) => {
    const res = await request.post(API_URL, {
      data: {
        name: "Test User",
        position: "QA",
        department: "Testing",
        salary: 5000,
        createdBy: "test@playwright.com",
      },
    });

    expect(res.status()).toBe(201);

    const body = await res.json();
    expect(body.name).toBe("Test User");

    createdId = body._id;
  });

  test("READ employees", async ({ request }) => {
    const res = await request.get(API_URL);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test("UPDATE employee", async ({ request }) => {
    const res = await request.put(`${API_URL}/${createdId}`, {
      data: {
        position: "Senior QA",
        updatedBy: "test@playwright.com",
      },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.position).toBe("Senior QA");
  });

  test("SOFT DELETE employee", async ({ request }) => {
    const res = await request.delete(`${API_URL}/${createdId}`, {
      data: {
        deletedBy: "test@playwright.com",
      },
    });

    expect(res.status()).toBe(200);
  });

});