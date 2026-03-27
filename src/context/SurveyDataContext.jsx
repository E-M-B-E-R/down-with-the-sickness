import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'dwtsSurveyData';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const SurveyDataContext = createContext(null);

export function SurveyDataProvider({ children }) {
  const [data, setData] = useState(loadData);

  const addResponse = useCallback((gameId, response) => {
    setData(prev => {
      const updated = {
        ...prev,
        [gameId]: [...(prev[gameId] || []), response],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getResponses = useCallback((gameId) => {
    return data[gameId] || [];
  }, [data]);

  const getSicknessScore = useCallback((gameId) => {
    const responses = data[gameId] || [];
    if (responses.length === 0) return null;
    const sickCount = responses.filter(r => r.feltSick).length;
    return Math.round((sickCount / responses.length) * 100);
  }, [data]);

  return (
    <SurveyDataContext.Provider value={{ addResponse, getResponses, getSicknessScore }}>
      {children}
    </SurveyDataContext.Provider>
  );
}

export function useSurveyData() {
  return useContext(SurveyDataContext);
}
