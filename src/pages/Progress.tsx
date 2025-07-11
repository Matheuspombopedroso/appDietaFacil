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

function Progress() {
  const [progress, setProgress] = useState<ProgressData>({
    weeks: [],
    months: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Weekly Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Weekly Progress
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
              {progress.weeks.map((week, index) => (
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
                      {isGoalAchieved(week.lossKg) ? "Goal Met" : "Goal Missed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Progress */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Monthly Progress
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
              {progress.months.map((month, index) => (
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
              ))}
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
