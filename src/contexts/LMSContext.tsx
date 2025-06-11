import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  isActive: boolean;
  phone_number?: string;
  profile_picture_url?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  enrolledCourses: string[];
  progress: number;
  lastLogin: string;
}

interface Submodule {
  id: string;
  title: string;
  type: 'video' | 'text' | 'video+text';
  textContent?: string;
  videoUrl?: string;
  videoFile?: File;
  isCompleted: boolean;
  duration?: number;
  status: 'draft' | 'published' | 'hidden';
  prerequisites?: string[];
  releaseDate?: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  submodules: Submodule[];
  order: number;
}

interface Chapter {
  id: string;
  title: string;
  modules: Module[];
  order: number;
}

interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  totalModules: number;
  completionRate: number;
}

interface CourseInput {
  title: string;
  description: string;
  sections: Section[];
  totalModules: number;
  completionRate: number;
}

interface LMSContextType {
  currentUser: Profile | null;
  session: Session | null;
  courses: Course[];
  students: Student[];
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, role?: 'student' | 'admin') => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProgress: (courseId: string, submoduleId: string) => void;
  getCourseProgress: (courseId: string) => number;
  addCourse: (course: CourseInput) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  addSection: (courseId: string, section: Omit<Section, 'id'>) => void;
  addChapter: (courseId: string, sectionId: string, chapter: Omit<Chapter, 'id'>) => void;
  addModule: (courseId: string, sectionId: string, chapterId: string, module: Omit<Module, 'id'>) => void;
  addSubmodule: (courseId: string, sectionId: string, chapterId: string, moduleId: string, submodule: Omit<Submodule, 'id'>) => void;
  updateSubmodule: (courseId: string, sectionId: string, chapterId: string, moduleId: string, submoduleId: string, updates: Partial<Submodule>) => void;
  reorderItems: (courseId: string, type: 'section' | 'chapter' | 'module' | 'submodule', parentId: string, newOrder: string[]) => void;
  inviteStudent: (email: string, name: string, assignedCourses: string[]) => void;
  updateStudent: (studentId: string, updates: Partial<Student>) => void;
  resetStudentPassword: (studentId: string) => string;
  assignCourseToStudent: (studentId: string, courseId: string) => void;
  unassignCourseFromStudent: (studentId: string, courseId: string) => void;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};

export const LMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock student data (will be replaced with Supabase data later)
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      isActive: true,
      enrolledCourses: ['1'],
      progress: 78,
      lastLogin: '2 hours ago'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      isActive: true,
      enrolledCourses: ['1'],
      progress: 45,
      lastLogin: '1 day ago'
    },
    {
      id: '3',
      name: 'Carol Brown',
      email: 'carol@example.com',
      isActive: false,
      enrolledCourses: ['1'],
      progress: 100,
      lastLogin: '1 week ago'
    }
  ]);

  // Mock courses data (will be replaced with Supabase data later)
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Product Design Fundamentals',
      description: 'Learn the essentials of user-centered product design',
      sections: [
        {
          id: 's1',
          title: 'Introduction to Product Design',
          order: 1,
          chapters: [
            {
              id: 'c1',
              title: 'Design Thinking Basics',
              order: 1,
              modules: [
                {
                  id: 'm1',
                  title: 'Getting Started with Design',
                  order: 1,
                  submodules: [
                    {
                      id: 'sm1',
                      title: 'What is Product Design?',
                      type: 'video+text',
                      textContent: '<h2>Understanding Product Design</h2><p>Product design is the process of creating solutions that address user needs and business goals. It combines creativity, research, and technical skills to develop products that are both functional and desirable.</p>',
                      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                      isCompleted: false,
                      duration: 15,
                      status: 'published',
                      order: 1
                    },
                    {
                      id: 'sm2',
                      title: 'Design Process Overview',
                      type: 'video',
                      textContent: '',
                      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                      isCompleted: false,
                      duration: 20,
                      status: 'published',
                      order: 2
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      totalModules: 2,
      completionRate: 0
    }
  ]);

  // Initialize authentication state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setIsAuthenticated(!!session);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setCurrentUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setCurrentUser({
          id: profile.id,
          email: profile.email || '',
          name: profile.name || '',
          role: profile.role || 'student',
          isActive: profile.is_active || true,
          phone_number: profile.phone_number,
          profile_picture_url: profile.profile_picture_url
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'admin' = 'student') => {
    try {
      const redirectUrl = `${window.location.origin}/lms`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: error.message || 'An error occurred during sign up' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: error.message || 'An error occurred during sign in' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Legacy methods for backward compatibility
  const login = async (email: string, password: string, role: 'student' | 'admin'): Promise<boolean> => {
    const result = await signIn(email, password);
    return !result.error;
  };

  const logout = () => {
    signOut();
  };

  const addCourse = (courseInput: CourseInput) => {
    const newCourse: Course = {
      ...courseInput,
      id: Date.now().toString(),
    };
    setCourses(prevCourses => [...prevCourses, newCourse]);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId ? { ...course, ...updates } : course
      )
    );
  };

  const addSection = (courseId: string, section: Omit<Section, 'id'>) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              sections: [
                ...course.sections,
                { ...section, id: `s${Date.now()}` }
              ]
            }
          : course
      )
    );
  };

  const addChapter = (courseId: string, sectionId: string, chapter: Omit<Chapter, 'id'>) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId
                  ? {
                      ...section,
                      chapters: [
                        ...section.chapters,
                        { ...chapter, id: `c${Date.now()}` }
                      ]
                    }
                  : section
              )
            }
          : course
      )
    );
  };

  const addModule = (courseId: string, sectionId: string, chapterId: string, module: Omit<Module, 'id'>) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId
                  ? {
                      ...section,
                      chapters: section.chapters.map(chapter =>
                        chapter.id === chapterId
                          ? {
                              ...chapter,
                              modules: [
                                ...chapter.modules,
                                { ...module, id: `m${Date.now()}` }
                              ]
                            }
                          : chapter
                      )
                    }
                  : section
              )
            }
          : course
      )
    );
  };

  const addSubmodule = (
    courseId: string,
    sectionId: string,
    chapterId: string,
    moduleId: string,
    submodule: Omit<Submodule, 'id'>
  ) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId
                  ? {
                      ...section,
                      chapters: section.chapters.map(chapter =>
                        chapter.id === chapterId
                          ? {
                              ...chapter,
                              modules: chapter.modules.map(module =>
                                module.id === moduleId
                                  ? {
                                      ...module,
                                      submodules: [
                                        ...module.submodules,
                                        { ...submodule, id: `sm${Date.now()}` }
                                      ]
                                    }
                                  : module
                              )
                            }
                          : chapter
                      )
                    }
                  : section
              )
            }
          : course
      )
    );
  };

  const updateSubmodule = (
    courseId: string,
    sectionId: string,
    chapterId: string,
    moduleId: string,
    submoduleId: string,
    updates: Partial<Submodule>
  ) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              sections: course.sections.map(section =>
                section.id === sectionId
                  ? {
                      ...section,
                      chapters: section.chapters.map(chapter =>
                        chapter.id === chapterId
                          ? {
                              ...chapter,
                              modules: chapter.modules.map(module =>
                                module.id === moduleId
                                  ? {
                                      ...module,
                                      submodules: module.submodules.map(submodule =>
                                        submodule.id === submoduleId
                                          ? { ...submodule, ...updates }
                                          : submodule
                                      )
                                    }
                                  : module
                              )
                            }
                          : chapter
                      )
                    }
                  : section
              )
            }
          : course
      )
    );
  };

  const updateProgress = (courseId: string, submoduleId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedSections = course.sections.map(section => ({
            ...section,
            chapters: section.chapters.map(chapter => ({
              ...chapter,
              modules: chapter.modules.map(module => ({
                ...module,
                submodules: module.submodules.map(submodule =>
                  submodule.id === submoduleId
                    ? { ...submodule, isCompleted: true }
                    : submodule
                )
              }))
            }))
          }));
          return { ...course, sections: updatedSections };
        }
        return course;
      })
    );
    console.log(`Progress updated for course ${courseId}, submodule ${submoduleId}`);
  };

  const getCourseProgress = (courseId: string): number => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;

    let completedSubmodules = 0;
    let totalSubmodules = 0;

    course.sections.forEach(section => {
      section.chapters.forEach(chapter => {
        chapter.modules.forEach(module => {
          module.submodules.forEach(submodule => {
            totalSubmodules++;
            if (submodule.isCompleted) completedSubmodules++;
          });
        });
      });
    });

    return totalSubmodules > 0 ? (completedSubmodules / totalSubmodules) * 100 : 0;
  };

  const reorderItems = (courseId: string, type: string, parentId: string, newOrder: string[]) => {
    console.log(`Reordering ${type} items in ${parentId}:`, newOrder);
  };

  const inviteStudent = (email: string, name: string, assignedCourses: string[] = []) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      email,
      isActive: true,
      enrolledCourses: assignedCourses,
      progress: 0,
      lastLogin: 'Never'
    };
    
    setStudents(prev => [...prev, newStudent]);
    console.log('Student invited:', newStudent);
  };

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, ...updates } : student
      )
    );
  };

  const resetStudentPassword = (studentId: string): string => {
    const newPassword = Math.random().toString(36).slice(-8);
    console.log(`Password reset for student ${studentId}: ${newPassword}`);
    return newPassword;
  };

  const assignCourseToStudent = (studentId: string, courseId: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? {
              ...student,
              enrolledCourses: [...student.enrolledCourses, courseId]
            }
          : student
      )
    );
  };

  const unassignCourseFromStudent = (studentId: string, courseId: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? {
              ...student,
              enrolledCourses: student.enrolledCourses.filter(id => id !== courseId)
            }
          : student
      )
    );
  };

  return (
    <LMSContext.Provider value={{
      currentUser,
      session,
      courses,
      students,
      isAuthenticated,
      isLoading,
      signUp,
      signIn,
      signOut,
      updateProgress,
      getCourseProgress,
      addCourse,
      updateCourse,
      addSection,
      addChapter,
      addModule,
      addSubmodule,
      updateSubmodule,
      reorderItems,
      inviteStudent,
      updateStudent,
      resetStudentPassword,
      assignCourseToStudent,
      unassignCourseFromStudent
    }}>
      {children}
    </LMSContext.Provider>
  );
};

export default LMSProvider;
