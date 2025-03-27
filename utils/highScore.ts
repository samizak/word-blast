interface HighScore {
  score: number;
  level: number;
  date: string;
}

const HIGH_SCORES_KEY = "wordBlastHighScores";
const MAX_HIGH_SCORES = 10;

export const getHighScores = (): HighScore[] => {
  // Return empty array during server-side rendering
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(HIGH_SCORES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveHighScore = (score: number, level: number): void => {
  if (typeof window === "undefined") return;

  try {
    const highScores = getHighScores();
    const newScore: HighScore = {
      score,
      level,
      date: new Date().toLocaleDateString(),
    };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
  } catch (error) {
    console.error("Failed to save high score:", error);
  }
};

export const getHighestScore = (): HighScore | null => {
  const highScores = getHighScores();
  return highScores[0] || null;
};
