import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Simple function to get ISO week
function getISOWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

app.post("/api/entries", async (req, res) => {
  try {
    const { date, weightKg, calories } = req.body;
    const entry = await prisma.entry.upsert({
      where: { date: new Date(date) },
      update: { weightKg, calories },
      create: { date: new Date(date), weightKg, calories },
    });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/entries", async (_req, res) => {
  try {
    const entries = await prisma.entry.findMany({ orderBy: { date: "asc" } });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  try {
    const entries = await prisma.entry.findMany({ orderBy: { date: "asc" } });
    if (!entries.length) return res.json({ weeks: [], months: [] });

    const byWeek = new Map();
    const byMonth = new Map();

    entries.forEach((e) => {
      const d = new Date(e.date);
      const weekKey = `${d.getFullYear()}-${getISOWeek(d)}`;
      const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;

      if (!byWeek.has(weekKey))
        byWeek.set(weekKey, { startKg: e.weightKg, endKg: e.weightKg });
      else byWeek.get(weekKey).endKg = e.weightKg;

      if (!byMonth.has(monthKey))
        byMonth.set(monthKey, { startKg: e.weightKg, endKg: e.weightKg });
      else byMonth.get(monthKey).endKg = e.weightKg;
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));
