
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
  Trash2, 
  ChevronDown,
  ChevronRight,
  Play,
  Upload
} from 'lucide-react';
import type { Module } from '@/types/section';
import ContentUpload from './ContentUpload';

interface ModuleManagerProps {
  chapterId: string;
  courseId: string;
  onModulesChange: () => void;
}

const ModuleManager: React.FC<ModuleManagerProps> = ({ chapterId, courseId, onModulesChange }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [newModule, setNewModule] = useState({
    title: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadModules();
  }, [chapterId]);

  const loadModules = async () => {
    try {
      console.log('Loading modules for chapter:', chapterId);
      
      const { data: modulesData, error } = await supabase
        .from('modules')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading modules:', error);
        return;
      }

      console.log('Modules loaded:', modulesData);
      setModules(modulesData || []);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newModule.title.trim()) {
      toast({
        title: "Error",
        description: "Module title is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Creating module with data:', {
        chapter_id: chapterId,
        title: newModule.title,
        description: newModule.description
      });

      const maxOrder = modules.length > 0 ? Math.max(...modules.map(m => m.order_index)) : 0;
      
      const { data, error } = await supabase
        .from('modules')
        .insert([
          {
            chapter_id: chapterId,
            title: newModule.title.trim(),
            description: newModule.description.trim() || null,
            order_index: maxOrder + 1
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating module:', error);
        toast({
          title: "Error",
          description: `Failed to create module: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Module created successfully:', data);

      if (data) {
        setModules(prev => [...prev, data]);
        setNewModule({ title: '', description: '' });
        setIsCreating(false);
        onModulesChange();
        toast({
          title: "Success",
          description: "Module created successfully"
        });
      }
    } catch (error) {
      console.error('Error creating module:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the module",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) {
        console.error('Error deleting module:', error);
        toast({
          title: "Error",
          description: "Failed to delete module",
          variant: "destructive"
        });
        return;
      }

      setModules(prev => prev.filter(m => m.id !== moduleId));
      onModulesChange();
      
      toast({
        title: "Success",
        description: "Module deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const isCreateFormValid = newModule.title.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-700">Modules</h5>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Create Module Form */}
      {isCreating && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">Create New Module</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="module-title">Module Title *</Label>
                <Input
                  id="module-title"
                  placeholder="Enter module title"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-description">Description</Label>
                <Textarea
                  id="module-description"
                  placeholder="Enter module description (optional)"
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="submit"
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  disabled={isLoading || !isCreateFormValid}
                >
                  {isLoading ? 'Creating...' : 'Create Module'}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewModule({ title: '', description: '' });
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

      {/* Modules List */}
      <div className="space-y-2">
        {modules.map((module) => (
          <Card key={module.id} className="border-l-4 border-l-purple-400 bg-gray-50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModuleExpansion(module.id)}
                    className="p-0 h-auto"
                  >
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Button>
                  <Play className="w-3 h-3 text-purple-600" />
                  <div>
                    <h6 className="text-sm font-medium text-gray-800">{module.title}</h6>
                    {module.description && (
                      <p className="text-xs text-gray-600 mt-1">{module.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    Module
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteModule(module.id)}
                    className="text-red-600 hover:text-red-700 p-1 h-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedModules.has(module.id) && (
              <CardContent className="pt-0">
                <ContentUpload 
                  moduleId={module.id}
                  onContentSaved={() => {
                    toast({
                      title: "Success",
                      description: "Content uploaded successfully"
                    });
                  }}
                />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {modules.length === 0 && !isCreating && (
        <div className="text-center py-4 text-gray-500">
          <Play className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No modules created yet</p>
        </div>
      )}
    </div>
  );
};

export default ModuleManager;
