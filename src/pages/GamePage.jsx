import { useParams, Link } from 'react-router-dom';
import { games } from '../data/games';
import SurveyForm from '../components/SurveyForm';
import ResponseCharts from '../components/ResponseCharts';
import styles from '../styles/GamePage.module.css';

export default function GamePage() {
  const { id } = useParams();
  const game = games.find(g => g.id === id);

  if (!game) {
    return (
      <div className={styles.notFound}>
        <h2>Game not found</h2>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <img src={game.heroImage} alt={game.name} className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link to="/" className={styles.backLink}>← All Games</Link>
          <h1 className={styles.title}>{game.name}</h1>
          <div className={styles.platforms}>
            {game.platforms.map(p => (
              <span key={p} className={styles.platform}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.surveySection}>
          <SurveyForm game={game} />
        </div>
        <div className={styles.chartsSection}>
          <ResponseCharts gameId={game.id} />
        </div>
      </div>
    </div>
  );
}
