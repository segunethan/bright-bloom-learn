
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/lms';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading courses:', error);
        return;
      }

      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const addCourse = async (courseData: any): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          title: courseData.title,
          description: courseData.description,
          total_modules: courseData.totalModules || 1
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding course:', error);
        return;
      }

      if (data) {
        setCourses(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const getCourseProgress = (courseId: string): number => {
    return 0;
  };

  // Placeholder functions for course content management
  const addSection = async (courseId: string, sectionData: any): Promise<void> => {
    console.log('Add section placeholder:', courseId, sectionData);
  };

  const addChapter = async (courseId: string, sectionId: string, chapterData: any): Promise<void> => {
    console.log('Add chapter placeholder:', courseId, sectionId, chapterData);
  };

  const addModule = async (courseId: string, sectionId: string, chapterId: string, moduleData: any): Promise<void> => {
    console.log('Add module placeholder:', courseId, sectionId, chapterId, moduleData);
  };

  const addSubmodule = async (courseId: string, sectionId: string, chapterId: string, moduleId: string, submoduleData: any): Promise<void> => {
    console.log('Add submodule placeholder:', courseId, sectionId, chapterId, moduleId, submoduleData);
  };

  const updateSubmodule = async (courseId: string, sectionId: string, chapterId: string, moduleId: string, submoduleId: string, submoduleData: any): Promise<void> => {
    console.log('Update submodule placeholder:', courseId, sectionId, chapterId, moduleId, submoduleId, submoduleData);
  };

  const updateProgress = async (courseId: string, submoduleId: string): Promise<void> => {
    console.log('Update progress placeholder:', courseId, submoduleId);
  };

  return {
    courses,
    addCourse,
    getCourseProgress,
    addSection,
    addChapter,
    addModule,
    addSubmodule,
    updateSubmodule,
    updateProgress,
  };
};
