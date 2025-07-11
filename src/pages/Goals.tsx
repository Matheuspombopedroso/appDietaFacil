import React, { useState, useEffect } from "react";

interface Goal {
  id?: number;
  type: "weekly" | "monthly";
  targetWeightLoss: number;
  targetCalories: number;
  startDate: string;
  endDate: string;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<Goal>({
    type: "weekly",
    targetWeightLoss: 0.5,
    targetCalories: 1800,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/goals");
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        setMessage("Meta criada com sucesso!");
        setNewGoal({
          type: "weekly",
          targetWeightLoss: 0.5,
          targetCalories: 1800,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
        });
        fetchGoals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Erro ao criar meta");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("Erro ao criar meta");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const deleteGoal = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/goals/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage("Meta excluída com sucesso!");
        fetchGoals();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Erro ao excluir meta");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("Erro ao excluir meta");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Metas</h2>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.includes("sucesso")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Formulário para nova meta */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Meta</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipo de Meta
              </label>
              <select
                id="type"
                value={newGoal.type}
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    type: e.target.value as "weekly" | "monthly",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="targetWeightLoss"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meta de Perda (kg)
              </label>
              <input
                type="number"
                id="targetWeightLoss"
                step="0.1"
                value={newGoal.targetWeightLoss}
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    targetWeightLoss: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 0.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="targetCalories"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Meta de Calorias
              </label>
              <input
                type="number"
                id="targetCalories"
                value={newGoal.targetCalories}
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    targetCalories: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 1800"
                required
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data Início
              </label>
              <input
                type="date"
                id="startDate"
                value={newGoal.startDate}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data Fim
              </label>
              <input
                type="date"
                id="endDate"
                value={newGoal.endDate}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            Criar Meta
          </button>
        </form>
      </div>

      {/* Lista de metas existentes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Metas Atuais</h3>
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          goal.type === "weekly"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {goal.type === "weekly" ? "Semanal" : "Mensal"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Meta de perda:</span>
                        <span className="font-medium text-gray-900">
                          {goal.targetWeightLoss} kg
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Meta de calorias:</span>
                        <span className="font-medium text-gray-900">
                          {goal.targetCalories} cal
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Período:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(goal.startDate)} -{" "}
                          {formatDate(goal.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => goal.id && deleteGoal(goal.id)}
                    className="ml-4 p-1 text-red-400 hover:text-red-600 focus:outline-none"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma meta definida</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
