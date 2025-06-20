
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, Video, FileText, Link } from 'lucide-react';

interface ContentUploadProps {
  moduleId: string;
  onContentSaved: () => void;
}

const ContentUpload: React.FC<ContentUploadProps> = ({ moduleId, onContentSaved }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleTextContentSave = async () => {
    if (!textContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text content",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll store this as a simple text content
      // In a real implementation, you'd save this to a database
      console.log('Saving text content for module:', moduleId, textContent);
      
      toast({
        title: "Success",
        description: "Text content saved successfully"
      });
      
      onContentSaved();
      setTextContent('');
    } catch (error) {
      console.error('Error saving text content:', error);
      toast({
        title: "Error",
        description: "Failed to save text content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUrlSave = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Saving video URL for module:', moduleId, videoUrl);
      
      toast({
        title: "Success",
        description: "Video URL saved successfully"
      });
      
      onContentSaved();
      setVideoUrl('');
    } catch (error) {
      console.error('Error saving video URL:', error);
      toast({
        title: "Error",
        description: "Failed to save video URL",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoFileUpload = async () => {
    if (!videoFile) {
      toast({
        title: "Error",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, we'll just simulate the upload
      // In a real implementation, you'd upload to Supabase Storage
      console.log('Uploading video file for module:', moduleId, videoFile.name);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "Video file uploaded successfully"
      });
      
      onContentSaved();
      setVideoFile(null);
    } catch (error) {
      console.error('Error uploading video file:', error);
      toast({
        title: "Error",
        description: "Failed to upload video file",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload Module Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="video-url" className="flex items-center space-x-2">
              <Link className="w-4 h-4" />
              <span>Video URL</span>
            </TabsTrigger>
            <TabsTrigger value="video-file" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Upload Video</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                placeholder="Enter your lesson content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
                className="min-h-[200px]"
              />
            </div>
            <Button 
              onClick={handleTextContentSave}
              disabled={isLoading || !textContent.trim()}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Text Content'}
            </Button>
          </TabsContent>

          <TabsContent value="video-url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                type="url"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Supports YouTube, Vimeo, and direct video links
              </p>
            </div>
            <Button 
              onClick={handleVideoUrlSave}
              disabled={isLoading || !videoUrl.trim()}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Video URL'}
            </Button>
          </TabsContent>

          <TabsContent value="video-file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-file">Upload Video File</Label>
              <Input
                id="video-file"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              {videoFile && (
                <p className="text-sm text-gray-600">
                  Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <Button 
              onClick={handleVideoFileUpload}
              disabled={isLoading || !videoFile}
              className="w-full"
            >
              {isLoading ? 'Uploading...' : 'Upload Video File'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentUpload;
