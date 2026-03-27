import { useState } from 'react';
import { useSurveyData } from '../context/SurveyDataContext';
import styles from '../styles/SurveyForm.module.css';

const FIX_TYPES = ['In-game settings', 'Config file', 'Mod'];

export default function SurveyForm({ game }) {
  const { addResponse } = useSurveyData();
  const [feltSick, setFeltSick] = useState(null);
  const [hadFix, setHadFix] = useState(null);
  const [fixType, setFixType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function resetForm() {
    setFeltSick(null);
    setHadFix(null);
    setFixType('');
    setSubmitted(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (feltSick === null) return;
    addResponse(game.id, {
      feltSick,
      hadFix: feltSick ? hadFix : null,
      fixType: feltSick && hadFix ? fixType : null,
    });
    setSubmitted(true);
  }

  const isSubmitDisabled =
    feltSick === null ||
    (feltSick === true && hadFix === null) ||
    (feltSick === true && hadFix === true && !fixType);

  if (submitted) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>✓</span>
        <p>Thanks for sharing your experience!</p>
        <button className={styles.again} onClick={resetForm}>
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Share your experience</h2>

      <div className={styles.field}>
        <label className={styles.label}>Does this game make you motion sick?</label>
        <div className={styles.radioGroup}>
          <button
            type="button"
            className={`${styles.radioBtn} ${feltSick === true ? styles.active : ''}`}
            onClick={() => { setFeltSick(true); setHadFix(null); setFixType(''); }}
          >
            Yes
          </button>
          <button
            type="button"
            className={`${styles.radioBtn} ${feltSick === false ? styles.activeNo : ''}`}
            onClick={() => { setFeltSick(false); setHadFix(null); setFixType(''); }}
          >
            No
          </button>
        </div>
      </div>

      {feltSick === true && (
        <div className={styles.field}>
          <label className={styles.label}>Was there a configuration that fixed your sickness?</label>
          <div className={styles.radioGroup}>
            <button
              type="button"
              className={`${styles.radioBtn} ${hadFix === true ? styles.active : ''}`}
              onClick={() => setHadFix(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`${styles.radioBtn} ${hadFix === false ? styles.activeNo : ''}`}
              onClick={() => { setHadFix(false); setFixType(''); }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {feltSick === true && hadFix === true && (
        <div className={styles.field}>
          <label className={styles.label}>What type of fix was it?</label>
          <div className={styles.radioGroup}>
            {FIX_TYPES.map(type => (
              <button
                key={type}
                type="button"
                className={`${styles.radioBtn} ${fixType === type ? styles.active : ''}`}
                onClick={() => setFixType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {feltSick !== null && (
        <button type="submit" className={styles.submit} disabled={isSubmitDisabled}>
          Submit
        </button>
      )}
    </form>
  );
}

