import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

// Fuso horário de São Paulo
const TIMEZONE = "America/Sao_Paulo";

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
    const { date, weight, calories } = req.body;
    // Usar o horário atual de São Paulo
    const now = new Date();
    const spTime = utcToZonedTime(now, TIMEZONE);
    const entryDate = new Date(date);
    entryDate.setHours(
      spTime.getHours(),
      spTime.getMinutes(),
      spTime.getSeconds()
    );

    // Converter para UTC antes de salvar
    const utcDate = zonedTimeToUtc(entryDate, TIMEZONE);
    const entry = await prisma.entry.upsert({
      where: { date: utcDate },
      update: { weightKg: weight, calories },
      create: { date: utcDate, weightKg: weight, calories },
    });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/entries", async (req, res) => {
  try {
    const { date } = req.query;
    if (date) {
      const utcDate = zonedTimeToUtc(new Date(date), TIMEZONE);
      const entry = await prisma.entry.findUnique({
        where: { date: utcDate },
      });
      if (entry) {
        // Converter de volta para o fuso horário local
        const localDate = utcToZonedTime(entry.date, TIMEZONE);
        const formattedEntry = {
          ...entry,
          date: format(localDate, "yyyy-MM-dd", { timeZone: TIMEZONE }),
        };
        res.json([formattedEntry]);
      } else {
        res.json([]);
      }
    } else {
      const entries = await prisma.entry.findMany({ orderBy: { date: "asc" } });
      // Converter todas as datas para o fuso horário local
      const formattedEntries = entries.map((entry) => {
        const localDate = utcToZonedTime(entry.date, TIMEZONE);
        return {
          ...entry,
          date: format(localDate, "yyyy-MM-dd", { timeZone: TIMEZONE }),
          time: format(localDate, "HH:mm", { timeZone: TIMEZONE }),
          fullDateTime: format(localDate, "yyyy-MM-dd HH:mm", {
            timeZone: TIMEZONE,
          }),
        };
      });
      res.json(formattedEntries);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/entries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, weight, calories } = req.body;
    // Usar o horário atual de São Paulo
    const now = new Date();
    const spTime = utcToZonedTime(now, TIMEZONE);
    const entryDate = new Date(date);
    entryDate.setHours(
      spTime.getHours(),
      spTime.getMinutes(),
      spTime.getSeconds()
    );

    const utcDate = zonedTimeToUtc(entryDate, TIMEZONE);
    const entry = await prisma.entry.update({
      where: { id: parseInt(id) },
      data: { date: utcDate, weightKg: weight, calories },
    });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/progress", async (_req, res) => {
  try {
    const entries = await prisma.entry.findMany({ orderBy: { date: "asc" } });
    if (!entries.length)
      return res.json({
        weeklyWeightLoss: 0,
        monthlyWeightLoss: 0,
        weeklyCalorieAvg: 0,
        monthlyCalorieAvg: 0,
      });

    // Calculate weekly and monthly weight loss using São Paulo timezone
    const now = utcToZonedTime(new Date(), TIMEZONE);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentEntries = entries.filter((e) => new Date(e.date) >= weekAgo);
    const monthlyEntries = entries.filter((e) => new Date(e.date) >= monthAgo);

    const weeklyWeightLoss =
      recentEntries.length >= 2
        ? recentEntries[0].weightKg -
          recentEntries[recentEntries.length - 1].weightKg
        : 0;

    const monthlyWeightLoss =
      monthlyEntries.length >= 2
        ? monthlyEntries[0].weightKg -
          monthlyEntries[monthlyEntries.length - 1].weightKg
        : 0;

    const weeklyCalorieAvg =
      recentEntries.length > 0
        ? recentEntries.reduce((sum, e) => sum + e.calories, 0) /
          recentEntries.length
        : 0;

    const monthlyCalorieAvg =
      monthlyEntries.length > 0
        ? monthlyEntries.reduce((sum, e) => sum + e.calories, 0) /
          monthlyEntries.length
        : 0;

    res.json({
      weeklyWeightLoss: +weeklyWeightLoss.toFixed(1),
      monthlyWeightLoss: +monthlyWeightLoss.toFixed(1),
      weeklyCalorieAvg: +weeklyCalorieAvg.toFixed(0),
      monthlyCalorieAvg: +monthlyCalorieAvg.toFixed(0),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/goals", async (_req, res) => {
  try {
    const goals = await prisma.goal.findMany();
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/goals", async (req, res) => {
  try {
    const { type, targetWeightLoss, targetCalories, startDate, endDate } =
      req.body;
    const goal = await prisma.goal.create({
      data: {
        year: new Date(startDate).getFullYear(),
        month: new Date(startDate).getMonth() + 1,
        weekOfYear: getISOWeek(new Date(startDate)),
        weeklyTargetKg: type === "weekly" ? targetWeightLoss : 0,
        monthlyTargetKg: type === "monthly" ? targetWeightLoss : 0,
      },
    });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/goals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.goal.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));
