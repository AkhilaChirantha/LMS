import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroPage from './pages/HeroPage';
import RegistrationForm from './components/RegistrationForm';
import LoginPage from './components/LoginForm';
import AddSubjectForm from './pages/AddSubjectForm';
import SubjectList from './pages/SubjectList';
import EnrollmentForm from './pages/EnrollmentForm';


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/subjectadd" element={<AddSubjectForm />} />
      <Route path="/subjectlist" element={<SubjectList />} />
      <Route path="/enrollsubject" element={<EnrollmentForm />} />
    </Routes>
  );
};

export default App;

