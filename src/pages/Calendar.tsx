import React, { useState, useEffect } from "react";

interface CalendarEntry {
  date: string;
  weightKg: number;
  calories: number;
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [currentDate]);

  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/entries");
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getEntryForDate = (date: string) => {
    return entries.find((entry) => entry.date.split("T")[0] === date);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateString = date.toISOString().split("T")[0];
      const entry = getEntryForDate(dateString);
      days.push(
        <div
          key={day}
          className="p-2 border border-gray-200 min-h-[80px] rounded-lg bg-white shadow-sm"
        >
          <div className="text-sm font-medium text-gray-900">{day}</div>
          {entry && (
            <div className="text-xs text-gray-600 mt-1">
              <div>{entry.weightKg} kg</div>
              <div>{entry.calories} cal</div>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Calendar View</h2>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1
                    )
                  )
                }
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                ←
              </button>
              <span className="text-white font-medium">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1
                    )
                  )
                }
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-semibold text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
