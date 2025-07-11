import React, { useState, useEffect } from "react";

interface Entry {
  id?: number;
  date: string;
  weightKg: number;
  calories: number;
}

const DailyEntry: React.FC = () => {
  const [entry, setEntry] = useState<Entry>({
    date: new Date().toISOString().split("T")[0],
    weightKg: 0,
    calories: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  const fetchTodayEntry = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/entries?date=${entry.date}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setEntry(data[0]);
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar entrada:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = isEditing
        ? `http://localhost:4000/api/entries/${entry.id}`
        : "http://localhost:4000/api/entries";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        setMessage(
          isEditing
            ? "Entrada atualizada com sucesso!"
            : "Entrada salva com sucesso!"
        );
        setIsEditing(true);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Erro ao salvar entrada");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("Erro ao salvar entrada");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Entrada Diária
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              message.includes("sucesso")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              value={entry.date}
              onChange={(e) => setEntry({ ...entry, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Peso (kg)
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 70.5"
              required
            />
          </div>

          <div>
            <label
              htmlFor="calories"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Calorias
            </label>
            <input
              type="number"
              id="calories"
              value={entry.calories || ""}
              onChange={(e) =>
                setEntry({ ...entry, calories: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 1800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            {isEditing ? "Atualizar Entrada" : "Salvar Entrada"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyEntry;
