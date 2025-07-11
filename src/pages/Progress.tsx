import React, { useState, useEffect } from "react";

interface WeekProgress {
  year: number;
  week: number;
  lossKg: number;
}

interface MonthProgress {
  year: number;
  month: number;
  lossKg: number;
}

interface ProgressData {
  weeks: WeekProgress[];
  months: MonthProgress[];
}

interface DailyEntry {
  id: number;
  date: string;
  weightKg: number;
  calories: number;
}

interface WeekBlock {
  date: string;
  dayName: string;
  weight?: number;
  calories?: number;
}

function Progress() {
  const [progress, setProgress] = useState<ProgressData>({
    weeks: [],
    months: [],
  });
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [weeklyBlocks, setWeeklyBlocks] = useState<WeekBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
    fetchDailyEntries();
  }, []);

  useEffect(() => {
    if (dailyEntries.length > 0) {
      generateWeeklyBlocks();
    }
  }, [dailyEntries]);

  const fetchProgress = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/progress");
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      } else {
        setError("Failed to load progress data");
      }
    } catch (error) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyEntries = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/entries");
      if (response.ok) {
        const data = await response.json();
        setDailyEntries(data);
      }
    } catch (error) {
      console.error("Error fetching daily entries:", error);
    }
  };

  const generateWeeklyBlocks = () => {
    const today = new Date();
    const currentWeek = getWeekStart(today);
    const weekBlocks: WeekBlock[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + i);

      const dateString = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });

      const entry = dailyEntries.find(
        (e) => e.date.split("T")[0] === dateString
      );

      weekBlocks.push({
        date: dateString,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        weight: entry?.weightKg,
        calories: entry?.calories,
      });
    }

    setWeeklyBlocks(weekBlocks);
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para segunda-feira
    return new Date(d.setDate(diff));
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month - 1];
  };

  const isGoalAchieved = (lossKg: number, targetKg: number = 0.5) => {
    return lossKg >= targetKg;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading progress data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Weekly Blocks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          This Week's Progress
        </h2>
        <div className="grid grid-cols-7 gap-3">
          {weeklyBlocks.map((block, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm p-4 text-center ${
                block.weight
                  ? "border-2 border-indigo-200"
                  : "border-2 border-gray-100"
              }`}
            >
              <div className="text-sm font-medium text-gray-600 mb-2">
                {block.dayName}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                {new Date(block.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </div>
              {block.weight ? (
                <>
                  <div className="text-lg font-bold text-indigo-600">
                    {block.weight} kg
                  </div>
                  <div className="text-xs text-gray-500">
                    {block.calories} cal
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-400">No data</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Entries */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          All Daily Entries
        </h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calories
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.weightKg} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.calories} cal
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Weekly Progress Summary
        </h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight Loss (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {progress.weeks.length > 0 ? (
                progress.weeks.map((week, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Week {week.week}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {week.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {week.lossKg.toFixed(2)} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isGoalAchieved(week.lossKg)
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isGoalAchieved(week.lossKg)
                          ? "Goal Met"
                          : "Goal Missed"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No weekly progress data available yet. Add more entries to
                    see progress.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Monthly Progress Summary
        </h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight Loss (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {progress.months.length > 0 ? (
                progress.months.map((month, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getMonthName(month.month)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {month.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month.lossKg.toFixed(2)} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isGoalAchieved(month.lossKg, 2.0)
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isGoalAchieved(month.lossKg, 2.0)
                          ? "Goal Met"
                          : "Goal Missed"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No monthly progress data available yet. Add more entries to
                    see progress.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white shadow sm:rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Goals</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>• Weekly goal: 0.5 kg weight loss</div>
          <div>• Monthly goal: 2.0 kg weight loss</div>
          <div className="flex items-center space-x-4 mt-3">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Goal Met
            </span>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Goal Missed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
