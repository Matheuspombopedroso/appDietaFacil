import request from "supertest";
import app from "../src/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/entries", () => {
  afterAll(async () => {
    await prisma.entry.deleteMany({ where: { date: new Date("2100‑01‑01") } });
    await prisma.$disconnect();
  });

  it("creates a new entry", async () => {
    const res = await request(app).post("/api/entries").send({
      date: "2100‑01‑01T00:00:00.000Z",
      weightKg: 100,
      calories: 2500,
    });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ weightKg: 100, calories: 2500 });
  });
});
