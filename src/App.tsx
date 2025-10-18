import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import CharacterOverviewPage from './pages/CharacterOverviewPage'
import LessonPage from './pages/LessonPage'
import WritingPracticePage from './pages/WritingPracticePage'
import QuizPage from './pages/QuizPage'
import ProgressPage from './pages/ProgressPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters" element={<CharacterOverviewPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/practice/:characterId" element={<WritingPracticePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </Layout>
  )
}

export default App
