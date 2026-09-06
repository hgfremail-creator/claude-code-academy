import { describe, it, expect } from 'vitest';
import { initSim, runCommand } from './engine';
import { MISSION_BY_ID } from './missions';

function run(missionId: string, cmds: string[]) {
  let state = initSim(MISSION_BY_ID[missionId]);
  const completed = new Set<string>();
  const transcript: string[] = [];
  for (const cmd of cmds) {
    const res = runCommand(state, cmd);
    state = res.state;
    res.newlyCompleted.forEach((g) => completed.add(g));
    res.lines.forEach((l) => transcript.push(`${l.kind}: ${l.text}`));
  }
  return { state, completed, transcript: transcript.join('\n') };
}

describe('simulator engine — m-explore', () => {
  it('/help lists the simulated commands', () => {
    const { transcript } = run('m-explore', ['/help']);
    expect(transcript).toContain('/context');
    expect(transcript).toContain('cat <path>');
  });

  it('tour + find complete their goals and answer about auth', () => {
    const { completed, transcript } = run('m-explore', ['tour', 'find auth']);
    expect(transcript).toContain('src/auth.js');
    expect([...completed].some((g) => /tour/i.test(g))).toBe(true);
    expect([...completed].some((g) => /find/i.test(g))).toBe(true);
  });

  it('cat reads a known file and errors on an unknown one', () => {
    const ok = run('m-explore', ['cat package.json']);
    expect(ok.transcript).toContain('notes-api');
    const bad = run('m-explore', ['cat nope.js']);
    expect(bad.transcript).toContain('no such file');
  });
});

describe('simulator engine — m-diff-review', () => {
  it('refuses to commit before the diff has been reviewed', () => {
    const { transcript } = run('m-diff-review', ['commit']);
    expect(transcript.toLowerCase()).toContain('not run /diff');
  });

  it('allows commit after reviewing the diff and identifies the unrelated change', () => {
    const { transcript, completed } = run('m-diff-review', ['/diff', 'explain diff', 'commit']);
    expect(transcript).toContain('json spaces');
    expect(transcript.toLowerCase()).toContain('unrelated');
    expect([...completed].some((g) => /commit/i.test(g))).toBe(true);
  });
});

describe('simulator engine — m-context', () => {
  it('/context flags a crowded window with three unrelated topics', () => {
    const { transcript } = run('m-context', ['/context']);
    expect(transcript.toLowerCase()).toMatch(/crowded|unrelated/);
  });
});
