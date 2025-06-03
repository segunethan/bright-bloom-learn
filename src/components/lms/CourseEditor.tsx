
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLMS } from '../../contexts/LMSContext';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Move, 
  Eye, 
  EyeOff,
  BookOpen,
  FileText,
  Video,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, currentUser, addSection, addChapter, addModule, addSubmodule } = useLMS();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleAddSection = () => {
    const title = prompt('Enter section title:');
    if (title) {
      addSection(course.id, {
        title,
        chapters: [],
        order: course.sections.length + 1
      });
    }
  };

  const handleAddChapter = (sectionId: string) => {
    const title = prompt('Enter chapter title:');
    if (title) {
      const section = course.sections.find(s => s.id === sectionId);
      addChapter(course.id, sectionId, {
        title,
        modules: [],
        order: (section?.chapters.length || 0) + 1
      });
    }
  };

  const handleAddModule = (sectionId: string, chapterId: string) => {
    const title = prompt('Enter module title:');
    if (title) {
      const section = course.sections.find(s => s.id === sectionId);
      const chapter = section?.chapters.find(c => c.id === chapterId);
      addModule(course.id, sectionId, chapterId, {
        title,
        submodules: [],
        order: (chapter?.modules.length || 0) + 1
      });
    }
  };

  const handleAddSubmodule = (sectionId: string, chapterId: string, moduleId: string) => {
    navigate(`/lms/admin/courses/${courseId}/lesson/new?section=${sectionId}&chapter=${chapterId}&module=${moduleId}`);
  };

  const handleEditSubmodule = (submoduleId: string, sectionId: string, chapterId: string, moduleId: string) => {
    navigate(`/lms/admin/courses/${courseId}/lesson/${submoduleId}?section=${sectionId}&chapter=${chapterId}&module=${moduleId}`);
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
          {course.sections.map((section) => (
            <Card key={section.id} className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection(section.id)}
                    >
                      {expandedSections.has(section.id) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </Button>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        Section: {section.title}
                      </CardTitle>
                      <CardDescription>
                        {section.chapters.length} chapters
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddChapter(section.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Chapter
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedSections.has(section.id) && (
                <CardContent className="space-y-3">
                  {section.chapters.map((chapter) => (
                    <Card key={chapter.id} className="ml-8 border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleChapter(chapter.id)}
                            >
                              {expandedChapters.has(chapter.id) ? 
                                <ChevronDown className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                            </Button>
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                              <FileText className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-medium text-gray-800">
                                Chapter: {chapter.title}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {chapter.modules.length} modules
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddModule(section.id, chapter.id)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Module
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedChapters.has(chapter.id) && (
                        <CardContent className="space-y-2">
                          {chapter.modules.map((module) => (
                            <Card key={module.id} className="ml-6 border border-gray-100">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleModule(module.id)}
                                    >
                                      {expandedModules.has(module.id) ? 
                                        <ChevronDown className="w-4 h-4" /> : 
                                        <ChevronRight className="w-4 h-4" />
                                      }
                                    </Button>
                                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center">
                                      <Video className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <div>
                                      <CardTitle className="text-sm font-medium text-gray-800">
                                        Module: {module.title}
                                      </CardTitle>
                                      <CardDescription className="text-xs">
                                        {module.submodules.length} lessons
                                      </CardDescription>
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddSubmodule(section.id, chapter.id, module.id)}
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Lesson
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>

                              {expandedModules.has(module.id) && (
                                <CardContent className="space-y-1">
                                  {module.submodules.map((submodule) => (
                                    <div
                                      key={submodule.id}
                                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded flex items-center justify-center">
                                          <span className="text-white text-xs">L</span>
                                        </div>
                                        <span className="text-sm text-gray-700">{submodule.title}</span>
                                        <span className={`px-2 py-1 text-xs rounded ${
                                          submodule.status === 'published' 
                                            ? 'bg-green-100 text-green-800' 
                                            : submodule.status === 'draft'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {submodule.status}
                                        </span>
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleEditSubmodule(submodule.id, section.id, chapter.id, module.id)}
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                          {submodule.status === 'hidden' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}

          {course.sections.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
              <p className="text-gray-600 mb-4">Create your first section to start building course content.</p>
              <Button
                onClick={handleAddSection}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Section
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
