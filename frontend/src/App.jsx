import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import Home from './pages/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import AssessmentPage from './pages/AssessmentPage';
import GenderSelectionPage from './pages/GenderSelectionPage';D: Use the correct component name
import SimpleTestPage from './pages/SimpleTestPage';
import NotFound from './pages/NotFound';
import AssessmentPage2 from './pages/AssessmentPage2';
import TestGenderPage from './pages/TestGenderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} /> FIXED: Use AssessmentPage2 */}
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment2" element={<AssessmentPage2 />} />
        <Route path="/gender-test" element={<TestGenderPage />} /> {/* Backup route for testing */}
        <Route path="/test" element={<SimpleTestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
