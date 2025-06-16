
import { Database } from '@/integrations/supabase/types';
import { Section, SectionResource, Chapter, Module, Submodule } from './section';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];

export { Section, SectionResource, Chapter, Module, Submodule };

export interface LMSContextType {
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
