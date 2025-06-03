
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLMS } from '../../contexts/LMSContext';
import { Book, Plus, Edit, Settings } from 'lucide-react';

const CourseManagement = () => {
  const { courses, addCourse } = useLMS();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: ''
  });

  const handleCreateCourse = () => {
    if (newCourse.title && newCourse.description) {
      const courseData = {
        title: newCourse.title,
        description: newCourse.description,
        sections: [
          {
            id: 's1',
            title: 'Introduction',
            order: 1,
            chapters: [
              {
                id: 'c1',
                title: 'Getting Started',
                order: 1,
                modules: [
                  {
                    id: 'm1',
                    title: 'Course Overview',
                    order: 1,
                    submodules: [
                      {
                        id: 'sm1',
                        title: 'Course Overview',
                        type: 'video+text' as const,
                        textContent: 'Welcome to this comprehensive course. This module will introduce you to the key concepts and learning objectives.',
                        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                        isCompleted: false,
                        duration: 10,
                        status: 'published' as const,
                        order: 1
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        totalModules: 1,
        completionRate: 0
      };
      
      addCourse(courseData);
      console.log('Creating course:', courseData);
      setIsCreating(false);
      setNewCourse({ title: '', description: '' });
    }
  };

  const handleEditContent = (courseId: string) => {
    navigate(`/lms/admin/courses/${courseId}`);
  };

  const handleCourseSettings = (courseId: string) => {
    console.log('Opening settings for course:', courseId);
    // This would open a settings modal in a real app
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
            Course Management
          </h1>
          <p className="text-gray-600 mt-2">Create and manage your courses</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Course
        </Button>
      </div>

      {/* Create Course Form */}
      {isCreating && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Create New Course</CardTitle>
            <CardDescription>Add a new course to your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Course Title</label>
              <Input
                placeholder="Enter course title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                placeholder="Enter course description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateCourse}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                disabled={!newCourse.title || !newCourse.description}
              >
                Create Course
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {course.description}
                  </CardDescription>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center ml-4">
                  <Book className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-800">{course.sections.length}</div>
                  <div className="text-gray-500">Sections</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-800">{course.totalModules}</div>
                  <div className="text-gray-500">Modules</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-800">24</div>
                  <div className="text-gray-500">Students</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEditContent(course.id)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Content
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleCourseSettings(course.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-4">Create your first course to get started.</p>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Course
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
