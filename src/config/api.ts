// Configuração da API
export const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000";

// Função para fazer requests para a API
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Funções específicas da API
export const api = {
  // Entries
  getEntries: () => apiRequest("/api/entries"),
  getEntryByDate: (date: string) => apiRequest(`/api/entries?date=${date}`),
  createEntry: (data: any) =>
    apiRequest("/api/entries", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateEntry: (id: number, data: any) =>
    apiRequest(`/api/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Progress
  getProgress: () => apiRequest("/api/progress"),

  // Goals
  getGoals: () => apiRequest("/api/goals"),
  createGoal: (data: any) =>
    apiRequest("/api/goals", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteGoal: (id: number) =>
    apiRequest(`/api/goals/${id}`, {
      method: "DELETE",
    }),

  // Health
  health: () => apiRequest("/health"),
};
