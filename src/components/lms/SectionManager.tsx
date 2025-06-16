
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { Section, SectionResource } from '@/types/section';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Link, 
  FileText, 
  Download,
  ChevronDown,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SectionManagerProps {
  courseId: string;
}

const SectionManager: React.FC<SectionManagerProps> = ({ courseId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [resources, setResources] = useState<{ [sectionId: string]: SectionResource[] }>({});
  const [isCreating, setIsCreating] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [newSection, setNewSection] = useState({
    title: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSections();
  }, [courseId]);

  const loadSections = async () => {
    try {
      // Query sections directly from the table
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (sectionsError) {
        console.error('Error loading sections:', sectionsError);
        toast({
          title: "Error",
          description: "Failed to load sections",
          variant: "destructive"
        });
        return;
      }

      setSections(sectionsData || []);
      
      // Load resources for each section
      if (sectionsData && sectionsData.length > 0) {
        const resourcePromises = sectionsData.map(async (section) => {
          const { data: resourcesData, error: resourcesError } = await supabase
            .from('section_resources')
            .select('*')
            .eq('section_id', section.id)
            .order('order_index', { ascending: true });
          
          if (resourcesError) {
            console.error('Error loading resources for section:', section.id, resourcesError);
            return { sectionId: section.id, resources: [] };
          }
          
          return { sectionId: section.id, resources: resourcesData || [] };
        });

        const resourceResults = await Promise.all(resourcePromises);
        const resourcesMap: { [sectionId: string]: SectionResource[] } = {};
        
        resourceResults.forEach(({ sectionId, resources }) => {
          resourcesMap[sectionId] = resources;
        });
        
        setResources(resourcesMap);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
      toast({
        title: "Error",
        description: "Failed to load sections",
        variant: "destructive"
      });
    }
  };

  const handleCreateSection = async () => {
    if (!newSection.title) {
      toast({
        title: "Error",
        description: "Section title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const maxOrder = Math.max(...sections.map(s => s.order_index), 0);
      
      const { data, error } = await supabase
        .from('sections')
        .insert([
          {
            course_id: courseId,
            title: newSection.title,
            description: newSection.description,
            order_index: maxOrder + 1
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating section:', error);
        toast({
          title: "Error",
          description: "Failed to create section",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSections(prev => [...prev, data]);
        setNewSection({ title: '', description: '' });
        setIsCreating(false);
        toast({
          title: "Success",
          description: "Section created successfully"
        });
      }
    } catch (error) {
      console.error('Error creating section:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId);

      if (error) {
        console.error('Error deleting section:', error);
        toast({
          title: "Error",
          description: "Failed to delete section",
          variant: "destructive"
        });
        return;
      }

      setSections(prev => prev.filter(s => s.id !== sectionId));
      setResources(prev => {
        const newResources = { ...prev };
        delete newResources[sectionId];
        return newResources;
      });
      
      toast({
        title: "Success",
        description: "Section deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleAddResource = async (sectionId: string, type: 'file' | 'link') => {
    // This would open a modal or form for adding resources
    toast({
      title: "Feature Coming Soon",
      description: `Add ${type} functionality will be implemented in the next update`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Course Sections</h2>
          <p className="text-gray-600 mt-1">Organize your course content into sections</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Create Section Form */}
      {isCreating && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Create New Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Section Title *</Label>
              <Input
                id="section-title"
                placeholder="Enter section title"
                value={newSection.title}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-description">Description</Label>
              <Textarea
                id="section-description"
                placeholder="Enter section description (optional)"
                value={newSection.description}
                onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateSection}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                disabled={!newSection.title}
              >
                Create Section
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

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSectionExpansion(section.id)}
                    className="p-0 h-auto"
                  >
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                    {section.description && (
                      <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {resources[section.id]?.length || 0} resources
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSection(section.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteSection(section.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedSections.has(section.id) && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Resources Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Resources</h4>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddResource(section.id, 'file')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddResource(section.id, 'link')}
                        >
                          <Link className="w-4 h-4 mr-2" />
                          Add Link
                        </Button>
                      </div>
                    </div>

                    {resources[section.id]?.length > 0 ? (
                      <div className="space-y-2">
                        {resources[section.id].map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {resource.resource_type === 'file' ? (
                                <FileText className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Link className="w-4 h-4 text-green-600" />
                              )}
                              <div>
                                <p className="font-medium text-gray-800">{resource.title}</p>
                                {resource.file_name && (
                                  <p className="text-sm text-gray-500">{resource.file_name}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No resources added yet</p>
                      </div>
                    )}
                  </div>

                  {/* Chapters/Modules placeholder */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Chapters</h4>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Chapter
                      </Button>
                    </div>
                    <div className="text-center py-6 text-gray-500">
                      <p>No chapters created yet</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {sections.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-600 mb-4">Create your first section to start organizing course content.</p>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Section
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionManager;
