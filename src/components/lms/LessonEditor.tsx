
import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLMS } from '../../contexts/LMSContext';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Video, 
  FileText,
  Bold,
  Italic,
  List,
  Link2,
  Image
} from 'lucide-react';

const LessonEditor = () => {
  const { courseId, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sectionId = searchParams.get('section');
  const chapterId = searchParams.get('chapter');
  const moduleId = searchParams.get('module');
  
  const { courses, addSubmodule, updateSubmodule } = useLMS();
  
  const [lessonData, setLessonData] = useState({
    title: '',
    type: 'text' as 'video' | 'text' | 'video+text',
    textContent: '',
    videoUrl: '',
    duration: 10,
    status: 'draft' as 'draft' | 'published' | 'hidden',
    prerequisites: [] as string[]
  });

  const course = courses.find(c => c.id === courseId);
  
  // Find existing lesson if editing
  React.useEffect(() => {
    if (lessonId && course && sectionId && chapterId && moduleId) {
      const section = course.sections.find(s => s.id === sectionId);
      const chapter = section?.chapters.find(c => c.id === chapterId);
      const module = chapter?.modules.find(m => m.id === moduleId);
      const lesson = module?.submodules.find(sm => sm.id === lessonId);
      
      if (lesson) {
        setLessonData({
          title: lesson.title,
          type: lesson.type,
          textContent: lesson.textContent || '',
          videoUrl: lesson.videoUrl || '',
          duration: lesson.duration || 10,
          status: lesson.status,
          prerequisites: lesson.prerequisites || []
        });
      }
    }
  }, [lessonId, course, sectionId, chapterId, moduleId]);

  const handleSave = (status: 'draft' | 'published') => {
    if (!sectionId || !chapterId || !moduleId || !courseId) return;

    const lessonPayload = {
      title: lessonData.title,
      type: lessonData.type,
      textContent: lessonData.textContent,
      videoUrl: lessonData.videoUrl,
      isCompleted: false,
      duration: lessonData.duration,
      status,
      prerequisites: lessonData.prerequisites,
      order: 1
    };

    if (lessonId) {
      // Update existing lesson
      updateSubmodule(courseId, sectionId, chapterId, moduleId, lessonId, lessonPayload);
    } else {
      // Create new lesson
      addSubmodule(courseId, sectionId, chapterId, moduleId, lessonPayload);
    }

    navigate(`/lms/admin/courses/${courseId}`);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server and get back a URL
      // For now, we'll create a temporary URL for preview
      const videoUrl = URL.createObjectURL(file);
      setLessonData(prev => ({ ...prev, videoUrl }));
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('textContent') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = textarea.value.substring(0, start) + before + selectedText + after + textarea.value.substring(end);
    
    setLessonData(prev => ({ ...prev, textContent: newText }));
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
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
                onClick={() => navigate(`/lms/admin/courses/${courseId}`)}
                className="text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {lessonId ? 'Edit Lesson' : 'Create New Lesson'}
                </h1>
                <p className="text-gray-600">Course: {course?.title}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handleSave('draft')}
                disabled={!lessonData.title}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave('published')}
                disabled={!lessonData.title}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Lesson Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lesson Title</label>
                  <Input
                    value={lessonData.title}
                    onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter lesson title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Content Type</label>
                  <div className="flex space-x-2">
                    {(['text', 'video', 'video+text'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={lessonData.type === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLessonData(prev => ({ ...prev, type }))}
                      >
                        {type === 'text' && <FileText className="w-4 h-4 mr-1" />}
                        {type === 'video' && <Video className="w-4 h-4 mr-1" />}
                        {type === 'video+text' && <><Video className="w-3 h-3 mr-1" /><FileText className="w-3 h-3" /></>}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={lessonData.duration}
                    onChange={(e) => setLessonData(prev => ({ ...prev, duration: parseInt(e.target.value) || 10 }))}
                    min="1"
                    max="180"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Video Upload */}
            {(lessonData.type === 'video' || lessonData.type === 'video+text') && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Video Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </Button>
                      <Input
                        value={lessonData.videoUrl}
                        onChange={(e) => setLessonData(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="Or paste video URL"
                        className="flex-1"
                      />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {lessonData.videoUrl && (
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-full"
                        src={lessonData.videoUrl}
                      >
                        Your browser doesn't support video playback
                      </video>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Text Editor */}
            {(lessonData.type === 'text' || lessonData.type === 'video+text') && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Text Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Text Formatting Toolbar */}
                  <div className="flex space-x-2 p-2 bg-gray-50 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertText('**', '**')}
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertText('*', '*')}
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertText('\n## ', '')}
                      title="Heading"
                    >
                      H2
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertText('\n- ', '')}
                      title="List"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertText('[', '](url)')}
                      title="Link"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertText('![alt text](', ')')}
                      title="Image"
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Textarea
                    id="textContent"
                    value={lessonData.textContent}
                    onChange={(e) => setLessonData(prev => ({ ...prev, textContent: e.target.value }))}
                    placeholder="Enter lesson content here... You can use Markdown formatting."
                    rows={12}
                    className="font-mono"
                  />
                  
                  <div className="text-xs text-gray-500">
                    Tip: Use Markdown syntax for formatting (e.g., **bold**, *italic*, ## headings, - lists)
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Settings */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="flex flex-col space-y-1">
                    {(['draft', 'published', 'hidden'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={lessonData.status === status ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setLessonData(prev => ({ ...prev, status }))}
                        className="justify-start"
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {lessonData.title && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="font-semibold">{lessonData.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{lessonData.duration} min</span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        lessonData.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : lessonData.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lessonData.status}
                      </span>
                    </div>
                    {lessonData.textContent && (
                      <div className="text-sm text-gray-700 max-h-32 overflow-y-auto">
                        {lessonData.textContent.substring(0, 200)}...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
