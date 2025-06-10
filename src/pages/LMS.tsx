
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLogin from '../components/lms/StudentLogin';
import StudentDashboard from '../components/lms/StudentDashboard';
import AdminLogin from '../components/lms/AdminLogin';
import AdminDashboard from '../components/lms/AdminDashboard';
import CourseViewer from '../components/lms/CourseViewer';

const LMS = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/course/:courseId" element={<CourseViewer />} />
      </Routes>
    </div>
  );
};

export default LMS;
