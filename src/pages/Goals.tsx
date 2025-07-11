import React, { useState, useEffect } from "react";

interface Goal {
  year: number;
  month: number;
  weekOfYear: number;
  weeklyTargetKg: number;
  monthlyTargetKg: number;
}

function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    weekOfYear: 1,
    weeklyTargetKg: 0.5,
    monthlyTargetKg: 2.0,
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
      setMessage("Erro ao buscar metas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:4000/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setMessage("Meta salva com sucesso!");
        fetchGoals();
      } else {
        setMessage("Erro ao salvar meta");
      }
    } catch (error) {
      setMessage("Erro ao conectar ao servidor");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
          <h2 className="text-2xl font-bold text-white text-center">
            Gerenciar Metas
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ano
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: +e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mês
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: +e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Semana
                </label>
                <input
                  type="number"
                  min={1}
                  max={53}
                  value={form.weekOfYear}
                  onChange={(e) =>
                    setForm({ ...form, weekOfYear: +e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta semanal (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.weeklyTargetKg}
                  onChange={(e) =>
                    setForm({ ...form, weeklyTargetKg: +e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meta mensal (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.monthlyTargetKg}
                  onChange={(e) =>
                    setForm({ ...form, monthlyTargetKg: +e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all"
            >
              Salvar Meta
            </button>
          </form>
          {message && (
            <div className="mb-4 text-center text-indigo-700">{message}</div>
          )}
          <h3 className="text-lg font-semibold mb-2">Metas cadastradas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Ano
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Mês
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Semana
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Meta Semanal (kg)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Meta Mensal (kg)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {goals.map((goal, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{goal.year}</td>
                    <td className="px-4 py-2">{goal.month}</td>
                    <td className="px-4 py-2">{goal.weekOfYear}</td>
                    <td className="px-4 py-2">{goal.weeklyTargetKg}</td>
                    <td className="px-4 py-2">{goal.monthlyTargetKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals;
