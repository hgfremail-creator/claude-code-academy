import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import BadgeWatcher from './components/BadgeWatcher';
import Dashboard from './pages/Dashboard';

const Learn = lazy(() => import('./pages/Learn'));
const LessonView = lazy(() => import('./pages/LessonView'));
const Practice = lazy(() => import('./pages/Practice'));
const Scenarios = lazy(() => import('./pages/Scenarios'));
const PromptLab = lazy(() => import('./pages/PromptLab'));
const Projects = lazy(() => import('./pages/Projects'));
const Simulator = lazy(() => import('./pages/Simulator'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Reference = lazy(() => import('./pages/Reference'));
const CheatSheet = lazy(() => import('./pages/CheatSheet'));
const Troubleshooting = lazy(() => import('./pages/Troubleshooting'));
const Progress = lazy(() => import('./pages/Progress'));
const Glossary = lazy(() => import('./pages/Glossary'));
const KnowledgeMap = lazy(() => import('./pages/KnowledgeMap'));
const DocsHub = lazy(() => import('./pages/DocsHub'));
const Certification = lazy(() => import('./pages/Certification'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
  return <div className="py-20 text-center text-sm text-ink-faint">Loading…</div>;
}

export default function App() {
  return (
    <Layout>
      <BadgeWatcher />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<LessonView />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/scenarios" element={<Scenarios />} />
          <Route path="/prompt-lab" element={<PromptLab />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/reference/cheatsheet" element={<CheatSheet />} />
          <Route path="/troubleshooting" element={<Troubleshooting />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/map" element={<KnowledgeMap />} />
          <Route path="/docs" element={<DocsHub />} />
          <Route path="/certification" element={<Certification />} />
          <Route path="/scenarios" element={<Navigate to="/practice/scenarios" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
