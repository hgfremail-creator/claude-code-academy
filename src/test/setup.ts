import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom has no matchMedia / scrollTo — stub what components touch.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
window.scrollTo = window.scrollTo || (() => {});
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});
Element.prototype.scrollTo = Element.prototype.scrollTo || (() => {});

// jsdom clipboard is often absent
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: () => Promise.resolve() },
    configurable: true,
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
