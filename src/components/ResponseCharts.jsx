import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSurveyData } from '../context/SurveyDataContext';
import styles from '../styles/ResponseCharts.module.css';

const SICK_COLOR = '#F07178';
const SAFE_COLOR = '#C3E88D';
const FIX_COLORS = ['#89DDFF', '#FFCB6B', '#C792EA'];

const tooltipStyle = {
  background: '#32374D',
  border: '1px solid #3D4166',
  borderRadius: '8px',
  color: '#A6ACCD',
};

const RADIAN = Math.PI / 180;
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function ResponseCharts({ gameId }) {
  const { getResponses } = useSurveyData();
  const responses = getResponses(gameId);

  if (responses.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Community Results</h2>
        <div className={styles.empty}>No responses yet — be the first to share your experience!</div>
      </div>
    );
  }

  const sickCount = responses.filter(r => r.feltSick).length;
  const notSickCount = responses.length - sickCount;
  const sickData = [
    { name: 'Felt Sick', value: sickCount },
    { name: 'No Sickness', value: notSickCount },
  ].filter(d => d.value > 0);

  const sickWithFix = responses.filter(r => r.feltSick && r.hadFix && r.fixType);
  const fixMap = {};
  sickWithFix.forEach(r => {
    fixMap[r.fixType] = (fixMap[r.fixType] || 0) + 1;
  });
  const fixData = Object.entries(fixMap).map(([type, value]) => ({ name: type, value }));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Community Results{' '}
        <span className={styles.count}>
          ({responses.length} {responses.length === 1 ? 'response' : 'responses'})
        </span>
      </h2>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <p className={styles.chartTitle}>Motion Sickness Rate</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sickData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                <Cell fill={SICK_COLOR} />
                <Cell fill={SAFE_COLOR} />
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {sickData.map((entry, i) => (
              <span key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#676E95' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? SICK_COLOR : SAFE_COLOR, display: 'inline-block' }} />
                {entry.name}
              </span>
            ))}
          </div>
        </div>

        {fixData.length > 0 && (
          <div className={styles.chartCard}>
            <p className={styles.chartTitle}>Fix Type Breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={fixData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {fixData.map((_, i) => (
                    <Cell key={i} fill={FIX_COLORS[i % FIX_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {fixData.map((entry, i) => (
                <span key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#676E95' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: FIX_COLORS[i % FIX_COLORS.length], display: 'inline-block' }} />
                  {entry.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
