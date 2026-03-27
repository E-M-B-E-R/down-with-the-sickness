import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSurveyData } from '../context/SurveyDataContext';
import styles from '../styles/ResponseCharts.module.css';

const SICK_COLOR = '#e94560';
const SAFE_COLOR = '#4caf50';
const PLATFORM_COLORS = ['#4cc9f0', '#7c3aed', '#f59e0b', '#10b981', '#ec4899'];
const FIX_COLORS = ['#4cc9f0', '#f59e0b', '#a78bfa'];

const tooltipStyle = {
  background: '#1e1e1e',
  border: '1px solid #2e2e2e',
  borderRadius: '8px',
  color: '#f0f0f0',
};

const RADIAN = Math.PI / 180;
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
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

  const platformMap = {};
  responses.forEach(r => {
    platformMap[r.platform] = (platformMap[r.platform] || 0) + 1;
  });
  const platformData = Object.entries(platformMap).map(([platform, count]) => ({
    platform,
    responses: count,
  }));

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
              <span key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#a0a0a0' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? SICK_COLOR : SAFE_COLOR, display: 'inline-block' }} />
                {entry.name}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <p className={styles.chartTitle}>Responses by Platform</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={platformData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="platform" tick={{ fill: '#a0a0a0', fontSize: 11 }} />
              <YAxis tick={{ fill: '#a0a0a0', fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="responses" radius={[4, 4, 0, 0]}>
                {platformData.map((_, i) => (
                  <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
                <span key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#a0a0a0' }}>
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
