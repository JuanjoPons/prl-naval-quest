export type LevelId = 1 | 2 | 3 | 4 | 5;

export interface ChallengeOption {
  text: string;
  scoreDelta: number; // e.g. +0.6 or -0.5
  correct: boolean;
  damage?: boolean; // triggers loss of 1 life
  explanation: string; // pedagogical feedback explaining the safety principle
}

export type ChallengeType = 
  | 'tool' 
  | 'epi' 
  | 'npc' 
  | 'hazard' 
  | 'chemical' 
  | 'electrical' 
  | 'sign' 
  | 'ventilation' 
  | 'emergency' 
  | 'waste';

export interface Challenge {
  id: number;
  x: number;
  y: number;
  type: ChallengeType;
  name: string;
  roleOrSub?: string;
  title: string;
  desc: string;
  options: ChallengeOption[];
  completed: boolean;
  selectedOptionIndex?: number;
}

export interface LevelConfig {
  id: LevelId;
  name: string;
  subtitle: string;
  location: string;
  description: string;
  targetCompetencies: string[];
  startingX: number;
  startingY: number;
  challenges: Challenge[];
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: 'down' | 'up' | 'left' | 'right';
  frame: number;
  isMoving: boolean;
  actionState?: 'idle' | 'working' | 'celebrating' | 'hurt';
}

export interface SessionResult {
  levelId: LevelId;
  levelName: string;
  studentName: string;
  groupId: string;
  date: string;
  finalScore: number;
  maxScore: number;
  initialScore: number;
  livesRemaining: number;
  completedChallenges: number;
  totalChallenges: number;
  accidentsCount: number;
  challengeLog: {
    title: string;
    chosenText: string;
    correct: boolean;
    scoreDelta: number;
    explanation: string;
  }[];
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  groupId?: string;
  levelId: LevelId;
  levelName: string;
  score: number;
  lives: number;
  completedChallengesCount: number;
  totalChallengesCount: number;
  accidentsCount: number;
  date: string; // ISO date string
}
