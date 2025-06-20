
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  BookOpen,
  Play
} from 'lucide-react';
import type { Chapter, Module } from '@/types/section';
import ModuleManager from './ModuleManager';

interface ChapterManagerProps {
  sectionId: string;
  courseId: string;
}

const ChapterManager: React.FC<ChapterManagerProps> = ({ sectionId, courseId }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [modules, setModules] = useState<{ [chapterId: string]: Module[] }>({});
  const [isCreating, setIsCreating] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [newChapter, setNewChapter] = useState({
    title: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadChapters();
  }, [sectionId]);

  const loadChapters = async () => {
    try {
      console.log('Loading chapters for section:', sectionId);
      
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .select('*')
        .eq('section_id', sectionId)
        .order('order_index', { ascending: true });

      if (chaptersError) {
        console.error('Error loading chapters:', chaptersError);
        toast({
          title: "Error",
          description: "Failed to load chapters",
          variant: "destructive"
        });
        return;
      }

      console.log('Chapters loaded:', chaptersData);
      setChapters(chaptersData || []);
      
      // Load modules for each chapter
      if (chaptersData && chaptersData.length > 0) {
        const modulePromises = chaptersData.map(async (chapter) => {
          const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .eq('chapter_id', chapter.id)
            .order('order_index', { ascending: true });
          
          if (modulesError) {
            console.error('Error loading modules for chapter:', chapter.id, modulesError);
            return { chapterId: chapter.id, modules: [] };
          }
          
          return { chapterId: chapter.id, modules: (modulesData || []) as Module[] };
        });

        const moduleResults = await Promise.all(modulePromises);
        const modulesMap: { [chapterId: string]: Module[] } = {};
        
        moduleResults.forEach(({ chapterId, modules }) => {
          modulesMap[chapterId] = modules;
        });
        
        setModules(modulesMap);
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
      toast({
        title: "Error",
        description: "Failed to load chapters",
        variant: "destructive"
      });
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newChapter.title.trim()) {
      toast({
        title: "Error",
        description: "Chapter title is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Creating chapter with data:', {
        section_id: sectionId,
        title: newChapter.title,
        description: newChapter.description
      });

      const maxOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order_index)) : 0;
      
      const { data, error } = await supabase
        .from('chapters')
        .insert([
          {
            section_id: sectionId,
            title: newChapter.title.trim(),
            description: newChapter.description.trim() || null,
            order_index: maxOrder + 1
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating chapter:', error);
        toast({
          title: "Error",
          description: `Failed to create chapter: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Chapter created successfully:', data);

      if (data) {
        setChapters(prev => [...prev, data]);
        setNewChapter({ title: '', description: '' });
        setIsCreating(false);
        toast({
          title: "Success",
          description: "Chapter created successfully"
        });
      }
    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the chapter",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter? This will also delete all modules within it.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId);

      if (error) {
        console.error('Error deleting chapter:', error);
        toast({
          title: "Error",
          description: "Failed to delete chapter",
          variant: "destructive"
        });
        return;
      }

      setChapters(prev => prev.filter(c => c.id !== chapterId));
      setModules(prev => {
        const newModules = { ...prev };
        delete newModules[chapterId];
        return newModules;
      });
      
      toast({
        title: "Success",
        description: "Chapter deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const toggleChapterExpansion = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const isCreateFormValid = newChapter.title.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-800">Chapters</h4>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Chapter
        </Button>
      </div>

      {/* Create Chapter Form */}
      {isCreating && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Create New Chapter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chapter-title">Chapter Title *</Label>
                <Input
                  id="chapter-title"
                  placeholder="Enter chapter title"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapter-description">Description</Label>
                <Textarea
                  id="chapter-description"
                  placeholder="Enter chapter description (optional)"
                  value={newChapter.description}
                  onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  disabled={isLoading || !isCreateFormValid}
                >
                  {isLoading ? 'Creating...' : 'Create Chapter'}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setNewChapter({ title: '', description: '' });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Chapters List */}
      <div className="space-y-3">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleChapterExpansion(chapter.id)}
                    className="p-0 h-auto"
                  >
                    {expandedChapters.has(chapter.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <div>
                    <h5 className="font-medium text-gray-800">{chapter.title}</h5>
                    {chapter.description && (
                      <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {modules[chapter.id]?.length || 0} modules
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedChapters.has(chapter.id) && (
              <CardContent className="pt-0">
                <ModuleManager 
                  chapterId={chapter.id} 
                  courseId={courseId}
                  onModulesChange={() => loadChapters()}
                />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {chapters.length === 0 && !isCreating && (
        <div className="text-center py-6 text-gray-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No chapters created yet</p>
        </div>
      )}
    </div>
  );
};

export default ChapterManager;
