import type { ProgressState } from '../store/progress';
import { LESSONS, LESSON_BY_ID } from '../content/lessons';
import { SKILLS } from '../content/skills';
import { skillMastery } from './badges';
import type { Lesson } from '../content/types';

export function isLessonComplete(s: ProgressState, id: string): boolean {
  const l = s.lessons[id];
  return !!l?.read && (l.quizBest ?? 0) >= 0.6;
}

export function prereqsMet(s: ProgressState, lesson: Lesson): boolean {
  return lesson.prerequisites.every((p) => isLessonComplete(s, p));
}

export function recommendedLesson(s: ProgressState): Lesson | null {
  // First: an unlocked, incomplete lesson in curriculum order.
  for (const lesson of LESSONS) {
    if (!isLessonComplete(s, lesson.id)) return lesson;
  }
  return null;
}

export interface WeakArea {
  skill: string;
  label: string;
  mastery: number;
  reviewLessonId?: string;
}

export function weakAreas(s: ProgressState): WeakArea[] {
  const out: WeakArea[] = [];
  for (const sk of SKILLS) {
    const rec = s.skillMastery[sk.id];
    if (!rec || rec.total < 3) continue;
    const m = skillMastery(s, sk.id);
    if (m < 0.6) {
      const review = LESSONS.find((l) => l.skills.includes(sk.id));
      out.push({ skill: sk.id, label: sk.label, mastery: m, reviewLessonId: review?.id });
    }
  }
  return out.sort((a, b) => a.mastery - b.mastery);
}

export interface StrongArea {
  skill: string;
  label: string;
  mastery: number;
  /** an advanced lesson to unlock/explore next */
  nextLessonId?: string;
}

export function strongAreas(s: ProgressState): StrongArea[] {
  const out: StrongArea[] = [];
  for (const sk of SKILLS) {
    const rec = s.skillMastery[sk.id];
    if (!rec || rec.total < 4) continue;
    const m = skillMastery(s, sk.id);
    if (m >= 0.85) {
      const advanced = LESSONS.filter((l) => l.skills.includes(sk.id) && !isLessonComplete(s, l.id)).sort((a, b) => b.level - a.level)[0];
      out.push({ skill: sk.id, label: sk.label, mastery: m, nextLessonId: advanced?.id });
    }
  }
  return out.sort((a, b) => b.mastery - a.mastery);
}

export function courseProgressPct(s: ProgressState): number {
  const total = LESSONS.length;
  const done = LESSONS.filter((l) => isLessonComplete(s, l.id)).length;
  return Math.round((done / total) * 100);
}

export function currentProjects(s: ProgressState): { id: string; title: string; done: boolean }[] {
  // Challenges started but not completed + reflections pending
  return Object.entries(s.challenges)
    .filter(([, v]) => !v.completed)
    .map(([id]) => ({ id, title: id, done: false }));
}

export function lessonStatus(s: ProgressState, lesson: Lesson): 'complete' | 'available' | 'locked' {
  if (isLessonComplete(s, lesson.id)) return 'complete';
  return prereqsMet(s, lesson) ? 'available' : 'locked';
}

export { LESSON_BY_ID };
