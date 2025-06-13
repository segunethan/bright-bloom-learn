
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLMS } from '../../contexts/LMSContext';
import { ArrowLeft, Book } from 'lucide-react';

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, currentUser } = useLMS();

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
          <Button onClick={() => navigate('/lms/student')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(currentUser?.role === 'admin' ? '/lms/admin' : '/lms/student')}
                className="text-gray-600 hover:text-green-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course Content Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            The interactive course content with lessons and progress tracking will be available soon.
          </p>
          <p className="text-gray-600 mb-4">
            You're viewing: <strong>{course.title}</strong>
          </p>
          <Button onClick={() => navigate(currentUser?.role === 'admin' ? '/lms/admin' : '/lms/student')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
