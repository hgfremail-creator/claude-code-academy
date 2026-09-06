import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { ProgressProvider } from '../store/progress';

const ROUTES = [
  '/',
  '/learn',
  '/learn/l0-what-is-claude-code',
  '/learn/l2-task-formula',
  '/practice',
  '/practice/scenarios',
  '/prompt-lab',
  '/projects',
  '/simulator',
  '/challenges',
  '/reference',
  '/reference/cheatsheet',
  '/troubleshooting',
  '/progress',
  '/glossary',
  '/map',
  '/docs',
  '/certification',
  '/this-route-does-not-exist',
];

describe('route smoke test', () => {
  for (const path of ROUTES) {
    it(`renders ${path} without throwing`, async () => {
      render(
        <ProgressProvider>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </ProgressProvider>,
      );
      // Sidebar nav renders synchronously; lazy route body resolves after Suspense.
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
      await waitFor(() => expect(screen.queryByText('Loading…')).toBeNull(), { timeout: 8000 });
    });
  }
});
