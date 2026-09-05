export interface SimFile {
  path: string;
  content: string;
}

export interface SimMission {
  id: string;
  title: string;
  brief: string;
  /** What the learner should accomplish / try */
  goals: string[];
  files: SimFile[];
  /** Starting git diff (unified-ish text) shown by /diff, or '' */
  diff: string;
  /** Hints surfaced in the UI */
  hints: string[];
  /** Concepts this mission teaches */
  teaches: string[];
}

export type SimLineKind = 'user' | 'claude' | 'tool' | 'system' | 'error' | 'diff';

export interface SimLine {
  kind: SimLineKind;
  text: string;
}
