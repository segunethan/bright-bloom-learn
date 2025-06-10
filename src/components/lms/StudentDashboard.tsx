
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import StudentCourses from './StudentCourses';
import StudentProgress from './StudentProgress';
import StudentSettings from './StudentSettings';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <StudentNavbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<StudentCourses />} />
          <Route path="/progress" element={<StudentProgress />} />
          <Route path="/settings" element={<StudentSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
