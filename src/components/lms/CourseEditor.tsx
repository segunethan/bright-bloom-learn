
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLMS } from '../../contexts/LMSContext';
import { 
  ArrowLeft, 
  Plus, 
  BookOpen,
} from 'lucide-react';

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses } = useLMS();

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
          <Button onClick={() => navigate('/lms/admin/courses')}>
            Back to Course Management
          </Button>
        </div>
      </div>
    );
  }

  const handleAddSection = () => {
    alert('Course content editing functionality will be implemented soon. For now, this is a placeholder interface.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/lms/admin/courses')}
                className="text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
                <p className="text-gray-600">Course Content Editor</p>
              </div>
            </div>
            <Button
              onClick={handleAddSection}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Course Structure Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              The course content editor with sections, chapters, and modules will be implemented in the next phase.
            </p>
            <p className="text-gray-600 mb-4">
              Current course: <strong>{course.title}</strong>
            </p>
            <Button
              onClick={handleAddSection}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Building Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
