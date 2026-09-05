import type { Lesson } from '../types';
import { LESSONS_00_07 } from './lessons-00-07';
import { LESSONS_08_14 } from './lessons-08-14';
import { LESSONS_15_21 } from './lessons-15-21';

export const LESSONS: Lesson[] = [...LESSONS_00_07, ...LESSONS_08_14, ...LESSONS_15_21].sort(
  (a, b) => a.level - b.level || a.order - b.order,
);

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function lessonsForLevel(level: number): Lesson[] {
  return LESSONS.filter((l) => l.level === level);
}

/** Every quiz question across the curriculum, tagged with its lesson. */
export const ALL_QUIZ_QUESTIONS = LESSONS.flatMap((l) =>
  l.quiz.map((q) => ({ ...q, lessonId: l.id, level: l.level })),
);
