
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLMS } from '../../contexts/LMSContext';
import { ArrowLeft, Book, CheckCircle, Clock, User } from 'lucide-react';

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, getCourseProgress, updateProgress } = useLMS();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const course = courses.find(c => c.id === courseId);
  const progress = course ? getCourseProgress(course.id) : 0;

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

  const allModules = course.sections.flatMap(section =>
    section.chapters.flatMap(chapter => chapter.modules)
  );

  const currentModule = selectedModule ? 
    allModules.find(m => m.id === selectedModule) : 
    allModules.find(m => !m.isCompleted) || allModules[0];

  const handleModuleComplete = (moduleId: string) => {
    updateProgress(course.id, moduleId);
    // In real app, this would mark module as completed
    console.log(`Module ${moduleId} completed`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/lms/student')}
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
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-lg font-semibold text-green-600">{Math.round(progress)}%</p>
              </div>
              <div className="w-20">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {course.sections.map((section) => (
                    <div key={section.id} className="border-b border-gray-100 last:border-b-0">
                      <div className="p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-800">{section.title}</h4>
                      </div>
                      {section.chapters.map((chapter) => (
                        <div key={chapter.id}>
                          <div className="px-4 py-2 bg-gray-25">
                            <p className="text-sm font-medium text-gray-700">{chapter.title}</p>
                          </div>
                          {chapter.modules.map((module) => (
                            <button
                              key={module.id}
                              onClick={() => setSelectedModule(module.id)}
                              className={`w-full text-left px-6 py-2 text-sm hover:bg-green-50 transition-colors ${
                                currentModule?.id === module.id ? 'bg-green-100 border-r-2 border-green-500' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={module.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}>
                                  {module.title}
                                </span>
                                {module.isCompleted && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentModule ? (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {currentModule.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentModule.duration} minutes
                        {currentModule.type.includes('video') && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Video
                          </span>
                        )}
                        {currentModule.type.includes('text') && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Reading
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    {currentModule.isCompleted && (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Video Player (if module has video) */}
                  {currentModule.videoUrl && (
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Video Player</p>
                        <p className="text-sm opacity-75">Video would load here in production</p>
                      </div>
                    </div>
                  )}

                  {/* Text Content */}
                  {currentModule.content && (
                    <div className="prose max-w-none">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700 leading-relaxed">
                          {currentModule.content}
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                          <p className="text-blue-800 text-sm">
                            <strong>Learning Objective:</strong> By the end of this module, you'll understand the key concepts 
                            and be able to apply them in practical scenarios.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Module Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Module {allModules.findIndex(m => m.id === currentModule.id) + 1} of {allModules.length}
                    </div>
                    
                    <div className="flex space-x-2">
                      {!currentModule.isCompleted && (
                        <Button
                          onClick={() => handleModuleComplete(currentModule.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                      
                      {/* Next Module Button */}
                      {allModules.findIndex(m => m.id === currentModule.id) < allModules.length - 1 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const nextIndex = allModules.findIndex(m => m.id === currentModule.id) + 1;
                            setSelectedModule(allModules[nextIndex].id);
                          }}
                        >
                          Next Module
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a module to begin</h3>
                <p className="text-gray-600">Choose a module from the sidebar to start learning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
