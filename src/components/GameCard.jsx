import { Link } from 'react-router-dom';
import styles from '../styles/GameCard.module.css';

export default function GameCard({ game, sicknessScore }) {
  const scoreColor =
    sicknessScore === null
      ? null
      : sicknessScore > 50
      ? 'var(--sick-color)'
      : 'var(--safe-color)';

  return (
    <Link to={`/game/${game.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={game.coverImage} alt={game.name} className={styles.cover} />
        {sicknessScore !== null ? (
          <div className={styles.badge} style={{ '--score-color': scoreColor }}>
            {sicknessScore}% sick
          </div>
        ) : (
          <div className={styles.badgeEmpty}>No data</div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{game.name}</h3>
      </div>
    </Link>
  );
}
