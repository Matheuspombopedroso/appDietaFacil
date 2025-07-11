import React, { useState, useEffect } from "react";

interface Entry {
  date: string;
  weightKg: number;
  calories: number;
}

function DailyEntry() {
  const [entry, setEntry] = useState<Entry>({
    date: new Date().toISOString().split("T")[0],
    weightKg: 0,
    calories: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  const fetchTodayEntry = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/entries");
      if (response.ok) {
        const entries = await response.json();
        const today = new Date().toISOString().split("T")[0];
        const todayEntry = entries.find(
          (e: Entry) => e.date.split("T")[0] === today
        );

        if (todayEntry) {
          setEntry({
            date: todayEntry.date.split("T")[0],
            weightKg: todayEntry.weightKg,
            calories: todayEntry.calories,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching today's entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date(entry.date).toISOString(),
          weightKg: entry.weightKg,
          calories: entry.calories,
        }),
      });

      if (response.ok) {
        setMessage("Entry updated successfully!");
      } else {
        setMessage("Error saving entry. Please try again.");
      }
    } catch (error) {
      setMessage("Error connecting to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading today's entry...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <h3 className="text-2xl font-bold text-white text-center">
            Today's Entry
          </h3>
          <p className="text-indigo-100 text-center mt-2">
            Track your weight and calories for today
          </p>
        </div>

        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={entry.date}
                onChange={(e) => setEntry({ ...entry, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="weight"
                  step="0.1"
                  value={entry.weightKg || ""}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      weightKg: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">kg</span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="calories"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Calories
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="calories"
                  value={entry.calories || ""}
                  onChange={(e) =>
                    setEntry({
                      ...entry,
                      calories: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">cal</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Update Entry"
              )}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                message.includes("Error")
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-green-50 border border-green-200 text-green-700"
              }`}
            >
              <div className="flex items-center">
                {message.includes("Error") ? (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyEntry;
