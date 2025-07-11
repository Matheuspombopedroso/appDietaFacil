import React, { useState, useEffect } from "react";

interface Entry {
  id: number;
  date: string;
  time?: string;
  fullDateTime?: string;
  weightKg: number;
  calories: number;
}

interface ProgressData {
  weeklyWeightLoss: number;
  monthlyWeightLoss: number;
  weeklyCalorieAvg: number;
  monthlyCalorieAvg: number;
}

const Progress: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [entriesResponse, progressResponse] = await Promise.all([
        fetch("http://localhost:4000/api/entries"),
        fetch("http://localhost:4000/api/progress"),
      ]);

      if (entriesResponse.ok) {
        const entriesData = await entriesResponse.json();
        setEntries(entriesData);
      }

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgressData(progressData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekBlocks = () => {
    const weeks: Entry[][] = [];
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let currentWeek: Entry[] = [];
    let currentWeekStart = new Date();

    sortedEntries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const dayOfWeek = entryDate.getDay();
      const weekStart = new Date(entryDate);
      weekStart.setDate(entryDate.getDate() - dayOfWeek);

      if (
        currentWeek.length === 0 ||
        weekStart.getTime() !== currentWeekStart.getTime()
      ) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [entry];
        currentWeekStart = weekStart;
      } else {
        currentWeek.push(entry);
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks.slice(-4); // Últimas 4 semanas
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Progresso</h2>
        <p className="text-sm text-gray-500">Fuso horário: São Paulo (GMT-3)</p>
      </div>

      {/* Cards de resumo */}
      {progressData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Perda Semanal</h3>
            <p
              className={`text-2xl font-bold ${
                progressData.weeklyWeightLoss >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {progressData.weeklyWeightLoss >= 0 ? "+" : ""}
              {progressData.weeklyWeightLoss.toFixed(1)} kg
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Perda Mensal</h3>
            <p
              className={`text-2xl font-bold ${
                progressData.monthlyWeightLoss >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {progressData.monthlyWeightLoss >= 0 ? "+" : ""}
              {progressData.monthlyWeightLoss.toFixed(1)} kg
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">
              Média Calorias/Semana
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {progressData.weeklyCalorieAvg.toFixed(0)} cal
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">
              Média Calorias/Mês
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {progressData.monthlyCalorieAvg.toFixed(0)} cal
            </p>
          </div>
        </div>
      )}

      {/* Blocos semanais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Últimas 4 Semanas
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {getWeekBlocks().map((week, weekIndex) => (
            <div key={weekIndex} className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Semana {weekIndex + 1}
              </h4>
              <div className="space-y-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (day, dayIndex) => {
                    const dayEntry = week.find((entry) => {
                      const entryDate = new Date(entry.date);
                      return entryDate.getDay() === dayIndex;
                    });

                    return (
                      <div
                        key={dayIndex}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-500 w-8">{day}</span>
                        <div className="flex-1 mx-2">
                          <div className="h-1 bg-gray-200 rounded-full">
                            {dayEntry && (
                              <div
                                className="h-1 bg-blue-500 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (dayEntry.weightKg / 100) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <span className="text-gray-900 font-medium w-16 text-right">
                          {dayEntry ? `${dayEntry.weightKg}kg` : "-"}
                        </span>
                        <span className="text-gray-500 w-16 text-right">
                          {dayEntry ? `${dayEntry.calories}cal` : "-"}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de entradas diárias */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Entradas Diárias
          </h3>
          {entries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calorias
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries
                    .slice()
                    .reverse()
                    .map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.fullDateTime
                            ? `${new Date(entry.date).toLocaleDateString(
                                "pt-BR"
                              )} ${entry.time}`
                            : new Date(entry.date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.weightKg} kg
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.calories} cal
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma entrada encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
