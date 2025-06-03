
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLMS } from '../../contexts/LMSContext';
import { ArrowLeft, Book, CheckCircle, Clock, Play } from 'lucide-react';

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, currentUser, getCourseProgress, updateProgress } = useLMS();
  const [selectedSubmodule, setSelectedSubmodule] = useState<string | null>(null);

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

  const allSubmodules = course.sections.flatMap(section =>
    section.chapters.flatMap(chapter =>
      chapter.modules.flatMap(module => module.submodules)
    )
  ).filter(submodule => submodule.status === 'published');

  const currentSubmodule = selectedSubmodule ? 
    allSubmodules.find(sm => sm.id === selectedSubmodule) : 
    allSubmodules.find(sm => !sm.isCompleted) || allSubmodules[0];

  const handleSubmoduleComplete = (submoduleId: string) => {
    updateProgress(course.id, submoduleId);
    console.log(`Submodule ${submoduleId} completed`);
  };

  const renderTextContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/## (.*?)(\n|$)/g, '<h2 class="text-xl font-bold mb-3 mt-4">$1</h2>')
      .replace(/### (.*?)(\n|$)/g, '<h3 class="text-lg font-semibold mb-2 mt-3">$1</h3>')
      .replace(/- (.*?)(\n|$)/g, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, '<br/>');
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
                            <div key={module.id}>
                              <div className="px-6 py-1 bg-gray-10">
                                <p className="text-xs font-medium text-gray-600">{module.title}</p>
                              </div>
                              {module.submodules
                                .filter(submodule => submodule.status === 'published')
                                .map((submodule) => (
                                <button
                                  key={submodule.id}
                                  onClick={() => setSelectedSubmodule(submodule.id)}
                                  className={`w-full text-left px-8 py-2 text-sm hover:bg-green-50 transition-colors ${
                                    currentSubmodule?.id === submodule.id ? 'bg-green-100 border-r-2 border-green-500' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={submodule.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}>
                                      {submodule.title}
                                    </span>
                                    {submodule.isCompleted && (
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentSubmodule ? (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        {currentSubmodule.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {currentSubmodule.duration} minutes
                        {currentSubmodule.type.includes('video') && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Video
                          </span>
                        )}
                        {currentSubmodule.type.includes('text') && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Reading
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    {currentSubmodule.isCompleted && (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Video Player */}
                  {currentSubmodule.videoUrl && (
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-full"
                        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMxMTEiLz4KPHN2ZyB4PSIzNSIgeT0iMzUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cG9seWdvbiBwb2ludHM9IjUsMyw2LjA5LDEyLjEyLDE5LDEyLDE4LDMiPjwvcG9seWdvbj4KPC9zdmc+Cjwvc3ZnPg=="
                      >
                        <source src={currentSubmodule.videoUrl} type="video/mp4" />
                        <div className="flex items-center justify-center h-full text-white">
                          <div className="text-center">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Video Player</p>
                            <p className="text-sm opacity-75">Your browser doesn't support video playback</p>
                          </div>
                        </div>
                      </video>
                    </div>
                  )}

                  {/* Text Content */}
                  {currentSubmodule.textContent && (
                    <div className="prose max-w-none">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: renderTextContent(currentSubmodule.textContent) 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submodule Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Lesson {allSubmodules.findIndex(sm => sm.id === currentSubmodule.id) + 1} of {allSubmodules.length}
                    </div>
                    
                    <div className="flex space-x-2">
                      {!currentSubmodule.isCompleted && (
                        <Button
                          onClick={() => handleSubmoduleComplete(currentSubmodule.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}
                      
                      {/* Next Submodule Button */}
                      {allSubmodules.findIndex(sm => sm.id === currentSubmodule.id) < allSubmodules.length - 1 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            const nextIndex = allSubmodules.findIndex(sm => sm.id === currentSubmodule.id) + 1;
                            setSelectedSubmodule(allSubmodules[nextIndex].id);
                          }}
                        >
                          Next Lesson
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a lesson to begin</h3>
                <p className="text-gray-600">Choose a lesson from the sidebar to start learning.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
