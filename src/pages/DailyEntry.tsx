import React, { useState } from "react";

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
        setMessage("Entry saved successfully!");
        setEntry({
          date: new Date().toISOString().split("T")[0],
          weightKg: 0,
          calories: 0,
        });
      } else {
        setMessage("Error saving entry. Please try again.");
      }
    } catch (error) {
      setMessage("Error connecting to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Daily Entry
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={entry.date}
                onChange={(e) => setEntry({ ...entry, date: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight (kg)
              </label>
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="calories"
                className="block text-sm font-medium text-gray-700"
              >
                Calories
              </label>
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Entry"}
            </button>
          </form>
          {message && (
            <div
              className={`mt-4 p-3 rounded-md ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyEntry;
