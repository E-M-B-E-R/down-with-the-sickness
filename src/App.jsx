import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SurveyDataProvider } from './context/SurveyDataContext';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <SurveyDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </SurveyDataProvider>
  );
}

export default App;
