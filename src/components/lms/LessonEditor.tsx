
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLMS } from '../../contexts/LMSContext';
import { 
  ArrowLeft, 
  FileText
} from 'lucide-react';

const LessonEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses } = useLMS();
  
  const course = courses.find(c => c.id === courseId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/lms/admin/courses/${courseId}`)}
                className="text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Lesson Editor
                </h1>
                <p className="text-gray-600">Course: {course?.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson Editor Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            The rich lesson editor with video upload, text editing, and content management will be implemented in the next phase.
          </p>
          <Button onClick={() => navigate(`/lms/admin/courses/${courseId}`)}>
            Back to Course Editor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
