// ============================================================================
// Content models for Claude Code Academy
// All learning content is data — never hardcoded into UI components.
// ============================================================================

export type Difficulty = 'intro' | 'beginner' | 'intermediate' | 'advanced' | 'expert';

/** A skill the learner can master. Mastery is tracked 0..1 per skill. */
export type SkillId =
  | 'prompting'
  | 'navigation'
  | 'codebase'
  | 'building'
  | 'git'
  | 'debugging'
  | 'testing'
  | 'claude-md'
  | 'context'
  | 'commands'
  | 'subagents'
  | 'mcp'
  | 'hooks'
  | 'skills'
  | 'terminal'
  | 'security'
  | 'large-projects'
  | 'architecture'
  | 'teamwork'
  | 'autonomy';

export interface SkillMeta {
  id: SkillId;
  label: string;
  blurb: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** index into options */
  correctAnswer: number;
  explanation: string;
  difficulty?: Difficulty;
  skills?: SkillId[];
}

export interface Exercise {
  id: string;
  kind: 'improve-prompt' | 'reflection' | 'checklist' | 'freeform' | 'order-steps';
  title: string;
  prompt: string;
  /** For improve-prompt: a weak starting prompt */
  starter?: string;
  /** Model answer / guidance shown after the learner attempts it */
  modelAnswer?: string;
  /** For checklist / order-steps */
  items?: string[];
  /** correct order of `items` indices for order-steps */
  correctOrder?: number[];
}

export interface ResourceLink {
  label: string;
  url: string;
  /** true => official Anthropic documentation */
  official?: boolean;
}

export interface Lesson {
  id: string;
  level: number;
  order: number;
  title: string;
  tagline: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  skills: SkillId[];
  objectives: string[];
  prerequisites: string[]; // lesson ids
  /** Markdown body */
  body: string;
  exercises: Exercise[];
  quiz: QuizQuestion[];
  resources: ResourceLink[];
  relatedLessons: string[];
  /** Content that may drift with Claude Code versions */
  versionSensitive?: boolean;
}

export interface Level {
  level: number;
  title: string;
  subtitle: string;
  summary: string;
}

// -------------------- Reference: Command Explorer --------------------

export interface CommandEntry {
  id: string;
  name: string; // e.g. "/context" or "claude -p"
  category:
    | 'starting'
    | 'session'
    | 'navigation'
    | 'context'
    | 'git'
    | 'review'
    | 'agents'
    | 'mcp'
    | 'config'
    | 'automation';
  summary: string;
  whatItDoes: string;
  whenToUse: string;
  beginnerExample: string;
  advancedExample: string;
  commonMistake: string;
  related: string[]; // command ids
  versionSensitive?: boolean;
}

// -------------------- Troubleshooting --------------------

export interface TroubleshootEntry {
  id: string;
  category: string;
  symptom: string;
  causes: string[];
  diagnostics: string[];
  solution: string;
  prevention: string;
}

// -------------------- Scenarios ("What would you do?") --------------------

export interface Scenario {
  id: string;
  category: string;
  situation: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  skills: SkillId[];
}

// -------------------- Cheat sheet --------------------

export interface CheatItem {
  id: string;
  section: string;
  command: string;
  description: string;
}

// -------------------- Glossary --------------------

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  seeAlso: string[]; // term ids
  lessons: string[]; // lesson ids
}

// -------------------- Challenges --------------------

export interface Challenge {
  id: string;
  title: string;
  scenario: string;
  objective: string;
  instructions: string[];
  hints: string[];
  solutionStrategy: string;
  reflectionQuestions: string[];
  skills: SkillId[];
  difficulty: Difficulty;
  /** 'daily' challenges rotate on the dashboard */
  pool: 'daily' | 'weekly' | 'library';
}

// -------------------- Prompt Lab --------------------

export interface PromptTask {
  id: string;
  title: string;
  brief: string;
  context: string;
  /** keywords the rubric rewards, grouped by criterion */
  rubric: {
    clarity: string[];
    context: string[];
    constraints: string[];
    verification: string[];
    scope: string[];
    safety: string[];
  };
  sampleStrongPrompt: string;
}

// -------------------- Projects --------------------

export interface Project {
  id: string;
  title: string;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  requirements: string[];
  constraints: string[];
  suggestedWorkflow: string[];
  hiddenTests: string[];
  evaluationCriteria: string[];
  hints: string[];
  solutionStrategy: string;
  reflectionQuestions: string[];
  skills: SkillId[];
}

// -------------------- Knowledge graph --------------------

export interface GraphNode {
  id: string;
  label: string;
  lesson?: string; // lesson id
  group: string;
}
export interface GraphEdge {
  from: string;
  to: string;
}

// -------------------- Certification --------------------

export interface CertPart {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}
