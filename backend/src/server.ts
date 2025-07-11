import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { getISOWeek } from "./utils/getISOWeek";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const entrySchema = z.object({
  date: z.string().datetime(),
  weightKg: z.number().positive(),
  calories: z.number().int().nonnegative(),
});

app.post("/api/entries", async (req, res) => {
  const parsed = entrySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { date, weightKg, calories } = parsed.data;
  const entry = await prisma.entry.upsert({
    where: { date: new Date(date) },
    update: { weightKg, calories },
    create: { date: new Date(date), weightKg, calories },
  });
  res.json(entry);
});

app.get("/api/entries", async (_req, res) => {
  const entries = await prisma.entry.findMany({ orderBy: { date: "asc" } });
  res.json(entries);
});

app.get("/api/entries/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const entry = await prisma.entry.findUnique({
      where: { date: new Date(date) },
    });
    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid date format" });
  }
});

app.get("/api/progress", async (_req, res) => {
  const entries = await prisma.entry.findMany({ orderBy: { date: "asc" } });
  if (!entries.length) return res.json({ weeks: [], months: [] });

  const byWeek = new Map<string, { startKg: number; endKg: number }>();
  const byMonth = new Map<string, { startKg: number; endKg: number }>();

  entries.forEach((e) => {
    const d = new Date(e.date);
    const weekKey = `${d.getFullYear()}-${getISOWeek(d)}`;
    const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;

    if (!byWeek.has(weekKey))
      byWeek.set(weekKey, { startKg: e.weightKg, endKg: e.weightKg });
    else byWeek.get(weekKey)!.endKg = e.weightKg;

    if (!byMonth.has(monthKey))
      byMonth.set(monthKey, { startKg: e.weightKg, endKg: e.weightKg });
    else byMonth.get(monthKey)!.endKg = e.weightKg;
  });

  const weeks = Array.from(byWeek.entries()).map(([key, v]) => {
    const [year, week] = key.split("-");
    return {
      year: +year,
      week: +week,
      lossKg: +(v.startKg - v.endKg).toFixed(2),
    };
  });

  const months = Array.from(byMonth.entries()).map(([key, v]) => {
    const [year, month] = key.split("-");
    return {
      year: +year,
      month: +month,
      lossKg: +(v.startKg - v.endKg).toFixed(2),
    };
  });

  res.json({ weeks, months });
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));

export default app; // for tests
