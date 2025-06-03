
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminOverview from './AdminOverview';
import CourseManagement from './CourseManagement';
import StudentManagement from './StudentManagement';
import CourseEditor from './CourseEditor';
import LessonEditor from './LessonEditor';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/courses/:courseId" element={<CourseEditor />} />
          <Route path="/courses/:courseId/lesson/new" element={<LessonEditor />} />
          <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonEditor />} />
          <Route path="/students" element={<StudentManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
