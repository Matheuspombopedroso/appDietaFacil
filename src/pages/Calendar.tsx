import React, { useState, useEffect } from "react";

interface Entry {
  id: number;
  date: string;
  weightKg: number;
  calories: number;
}

const Calendar: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/entries");
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Erro ao buscar entradas:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getEntryForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return entries.find((entry) => entry.date === dateString);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Carregando calendário...</div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Calendário</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {getMonthName(currentDate)}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Grade do calendário */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const entry = getEntryForDate(day);
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                className={`
                  min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border-r border-b border-gray-200
                  ${isCurrentMonthDay ? "bg-white" : "bg-gray-50"}
                  ${isTodayDate ? "bg-blue-50" : ""}
                `}
              >
                <div className="h-full flex flex-col">
                  {/* Número do dia */}
                  <div
                    className={`
                    text-sm font-medium mb-1
                    ${isCurrentMonthDay ? "text-gray-900" : "text-gray-400"}
                    ${isTodayDate ? "text-blue-600 font-bold" : ""}
                  `}
                  >
                    {formatDate(day)}
                  </div>

                  {/* Dados da entrada */}
                  {entry && (
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-medium text-gray-900">
                        {entry.weightKg} kg
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.calories} cal
                      </div>
                    </div>
                  )}

                  {/* Indicador de entrada */}
                  {entry && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legenda</h3>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-50 rounded"></div>
            <span>Hoje</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Entrada registrada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-50 rounded"></div>
            <span>Outro mês</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
