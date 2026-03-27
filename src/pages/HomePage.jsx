import { useState } from 'react';
import { games } from '../data/games';
import { useSurveyData } from '../context/SurveyDataContext';
import GameCard from '../components/GameCard';
import SearchBar from '../components/SearchBar';
import styles from '../styles/HomePage.module.css';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const { getSicknessScore } = useSurveyData();

  const filtered = games
    .filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const scoreA = getSicknessScore(a.id) ?? -1;
      const scoreB = getSicknessScore(b.id) ?? -1;
      return scoreB - scoreA;
    });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Down With the Sickness</h1>
        <p className={styles.subtitle}>Rate your motion sickness experience for video games</p>
      </header>
      <main className={styles.main}>
        <SearchBar value={search} onChange={setSearch} />
        {filtered.length === 0 ? (
          <p className={styles.empty}>No games found matching &ldquo;{search}&rdquo;</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map(game => (
              <GameCard key={game.id} game={game} sicknessScore={getSicknessScore(game.id)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
