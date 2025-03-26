interface HighScore {
  score: number;
  level: number;
  date: string;
}

const HIGH_SCORES_KEY = 'wordBlastHighScores';
const MAX_HIGH_SCORES = 10;

export const getHighScores = (): HighScore[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(HIGH_SCORES_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveHighScore = (score: number, level: number): void => {
  if (typeof window === 'undefined') return;
  
  const highScores = getHighScores();
  const newScore: HighScore = {
    score,
    level,
    date: new Date().toLocaleDateString(),
  };
  
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score); // Sort by score descending
  highScores.splice(MAX_HIGH_SCORES); // Keep only top 10
  
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
};

export const getHighestScore = (): HighScore | null => {
  const highScores = getHighScores();
  return highScores[0] || null;
}; 