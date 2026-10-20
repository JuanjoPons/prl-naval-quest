import { LeaderboardEntry } from '../types/prl';

const STORAGE_KEY = 'prl_naval_quest_leaderboard';

// Default initial records so the leaderboard is immediately interesting
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    studentName: 'Oficial Marítimo Ruiz',
    levelId: 1,
    levelName: 'Taller de Mantenimiento Naval',
    score: 9.8,
    lives: 3,
    completedChallengesCount: 8,
    totalChallengesCount: 8,
    accidentsCount: 0,
    date: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'seed-2',
    studentName: 'Técnica Alba Garrido',
    levelId: 2,
    levelName: 'El Muelle y Productos Químicos',
    score: 9.4,
    lives: 3,
    completedChallengesCount: 8,
    totalChallengesCount: 8,
    accidentsCount: 0,
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'seed-3',
    studentName: 'Insp. Carlos Méndez',
    levelId: 3,
    levelName: 'Trabajo en Altura (Palo Mayor)',
    score: 8.9,
    lives: 2,
    completedChallengesCount: 8,
    totalChallengesCount: 8,
    accidentsCount: 1,
    date: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'seed-4',
    studentName: 'Marino Lucas Vega',
    levelId: 4,
    levelName: 'Sentina y Espacios Confinados',
    score: 8.5,
    lives: 2,
    completedChallengesCount: 8,
    totalChallengesCount: 8,
    accidentsCount: 1,
    date: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'seed-5',
    studentName: 'Elena Pastor',
    levelId: 1,
    levelName: 'Taller de Mantenimiento Naval',
    score: 8.0,
    lives: 2,
    completedChallengesCount: 8,
    totalChallengesCount: 8,
    accidentsCount: 1,
    date: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return DEFAULT_LEADERBOARD;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default entries
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
      return DEFAULT_LEADERBOARD;
    }
    const parsed: LeaderboardEntry[] = JSON.parse(raw);
    return sortLeaderboard(parsed);
  } catch (err) {
    console.error('Error loading leaderboard from localStorage:', err);
    return DEFAULT_LEADERBOARD;
  }
}

export function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    // 1. Highest score
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 2. Most lives remaining
    if (b.lives !== a.lives) {
      return b.lives - a.lives;
    }
    // 3. Least accidents
    if (a.accidentsCount !== b.accidentsCount) {
      return a.accidentsCount - b.accidentsCount;
    }
    // 4. Most recent date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getTop5Scores(): LeaderboardEntry[] {
  const all = getLeaderboard();
  return all.slice(0, 5);
}

export interface SaveScoreResult {
  entry: LeaderboardEntry;
  rank: number; // 1-indexed, e.g. 1 means 1st place
  isTop5: boolean;
  isNewRecord: boolean;
}

export function saveScoreToLeaderboard(
  entryData: Omit<LeaderboardEntry, 'id' | 'date'>
): SaveScoreResult {
  const all = getLeaderboard();
  
  const newEntry: LeaderboardEntry = {
    ...entryData,
    id: 'score-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    date: new Date().toISOString()
  };

  const updated = sortLeaderboard([...all, newEntry]);
  
  // Keep up to 25 historical entries in storage to prevent bloat
  const trimmed = updated.slice(0, 25);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Error saving leaderboard to localStorage:', err);
  }

  const rank = updated.findIndex((item) => item.id === newEntry.id) + 1;
  const isTop5 = rank >= 1 && rank <= 5;
  const isNewRecord = rank === 1;

  return {
    entry: newEntry,
    rank,
    isTop5,
    isNewRecord
  };
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing leaderboard:', err);
  }
}

export function resetToDefaultLeaderboard(): LeaderboardEntry[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
    return DEFAULT_LEADERBOARD;
  } catch (err) {
    console.error('Error resetting leaderboard:', err);
    return DEFAULT_LEADERBOARD;
  }
}
