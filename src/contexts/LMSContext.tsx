
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

interface LMSContextType {
  currentUser: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  courses: Course[];
  students: Profile[];
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'admin') => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  getCourseProgress: (courseId: string) => number;
  addCourse: (courseData: any) => Promise<void>;
  addSection: (courseId: string, sectionData: any) => Promise<void>;
  addChapter: (courseId: string, sectionId: string, chapterData: any) => Promise<void>;
  addModule: (courseId: string, sectionId: string, chapterId: string, moduleData: any) => Promise<void>;
  addSubmodule: (courseId: string, sectionId: string, chapterId: string, moduleId: string, submoduleData: any) => Promise<void>;
  updateSubmodule: (courseId: string, sectionId: string, chapterId: string, moduleId: string, submoduleId: string, submoduleData: any) => Promise<void>;
  updateProgress: (courseId: string, submoduleId: string) => Promise<void>;
  inviteStudent: (email: string, name: string) => Promise<{ error?: string }>;
  updateStudent: (studentId: string, updates: Partial<Profile>) => Promise<{ error?: string }>;
  resetStudentPassword: (email: string) => Promise<{ error?: string }>;
  assignCourseToStudent: (studentId: string, courseId: string) => Promise<{ error?: string }>;
  unassignCourseFromStudent: (studentId: string, courseId: string) => Promise<{ error?: string }>;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (context === undefined) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};

export const LMSProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Profile[]>([]);

  // Load user session and profile
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load courses and students
  useEffect(() => {
    loadCourses();
    loadStudents();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      if (profile) {
        setCurrentUser(profile);
        setIsAuthenticated(true);
      } else {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || '',
              role: (user.user_metadata?.role as 'student' | 'admin') || 'student'
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else if (newProfile) {
          setCurrentUser(newProfile);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const loadStudents = async () => {
    try {
      const { data: studentsData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading students:', error);
        return;
      }

      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'admin'): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error?: string }> => {
    if (!currentUser) {
      return { error: 'No user logged in' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      if (data) {
        setCurrentUser(data);
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const getCourseProgress = (courseId: string): number => {
    // This would typically fetch from enrollments table
    // For now, returning 0 as placeholder
    return 0;
  };

  // Placeholder functions for course management (would need additional database tables)
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

  // Placeholder functions for sections/chapters/modules (would need additional database tables)
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

  const inviteStudent = async (email: string, name: string): Promise<{ error?: string }> => {
    console.log('Invite student placeholder:', email, name);
    return {};
  };

  const updateStudent = async (studentId: string, updates: Partial<Profile>): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', studentId)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      if (data) {
        setStudents(prev => prev.map(student => student.id === studentId ? data : student));
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const resetStudentPassword = async (email: string): Promise<{ error?: string }> => {
    return await resetPassword(email);
  };

  const assignCourseToStudent = async (studentId: string, courseId: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert([{
          student_id: studentId,
          course_id: courseId
        }]);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const unassignCourseFromStudent = async (studentId: string, courseId: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ is_active: false })
        .eq('student_id', studentId)
        .eq('course_id', courseId);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const value: LMSContextType = {
    currentUser,
    isAuthenticated,
    isLoading,
    courses,
    students,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    getCourseProgress,
    addCourse,
    addSection,
    addChapter,
    addModule,
    addSubmodule,
    updateSubmodule,
    updateProgress,
    inviteStudent,
    updateStudent,
    resetStudentPassword,
    assignCourseToStudent,
    unassignCourseFromStudent,
  };

  return (
    <LMSContext.Provider value={value}>
      {children}
    </LMSContext.Provider>
  );
};
