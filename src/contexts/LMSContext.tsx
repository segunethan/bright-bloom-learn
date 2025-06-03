
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  isActive: boolean;
  enrolledCourses: string[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  totalModules: number;
  completionRate: number;
}

interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  type: 'video' | 'text' | 'video+text';
  content: string;
  videoUrl?: string;
  isCompleted: boolean;
  duration?: number;
}

interface CourseInput {
  title: string;
  description: string;
  sections: Section[];
  totalModules: number;
  completionRate: number;
}

interface LMSContextType {
  currentUser: User | null;
  courses: Course[];
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'student' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateProgress: (courseId: string, moduleId: string) => void;
  getCourseProgress: (courseId: string) => number;
  addCourse: (course: CourseInput) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock data with sample videos
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Product Design Fundamentals',
      description: 'Learn the essentials of user-centered product design',
      sections: [
        {
          id: 's1',
          title: 'Introduction to Product Design',
          chapters: [
            {
              id: 'c1',
              title: 'Design Thinking Basics',
              modules: [
                {
                  id: 'm1',
                  title: 'What is Product Design?',
                  type: 'video+text',
                  content: 'Product design is the process of creating solutions that address user needs and business goals. It combines creativity, research, and technical skills to develop products that are both functional and desirable.',
                  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                  isCompleted: false,
                  duration: 15
                },
                {
                  id: 'm2',
                  title: 'User Research Methods',
                  type: 'video',
                  content: 'This module covers various user research methods including interviews, surveys, and usability testing.',
                  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                  isCompleted: false,
                  duration: 20
                },
                {
                  id: 'm3',
                  title: 'Design Process Overview',
                  type: 'video+text',
                  content: 'Understanding the end-to-end design process from research to implementation.',
                  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
                  isCompleted: false,
                  duration: 25
                }
              ]
            }
          ]
        }
      ],
      totalModules: 3,
      completionRate: 0
    },
    {
      id: '2',
      title: 'Product Management Excellence',
      description: 'Master the art of product management and strategy',
      sections: [
        {
          id: 's2',
          title: 'Product Strategy',
          chapters: [
            {
              id: 'c2',
              title: 'Market Research',
              modules: [
                {
                  id: 'm4',
                  title: 'Understanding Your Market',
                  type: 'video+text',
                  content: 'Market research is crucial for product success. Learn how to identify market opportunities and validate your product ideas.',
                  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                  isCompleted: false,
                  duration: 18
                },
                {
                  id: 'm5',
                  title: 'Competitive Analysis',
                  type: 'video',
                  content: 'How to analyze competitors and position your product effectively.',
                  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                  isCompleted: false,
                  duration: 22
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

  const login = async (email: string, password: string, role: 'student' | 'admin'): Promise<boolean> => {
    // Mock authentication - in real app, this would be API call
    if (email && password) {
      setCurrentUser({
        id: '1',
        email,
        name: email.split('@')[0],
        role,
        isActive: true,
        enrolledCourses: ['1', '2']
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const addCourse = (courseInput: CourseInput) => {
    const newCourse: Course = {
      ...courseInput,
      id: Date.now().toString(), // Generate unique ID
    };
    setCourses(prevCourses => [...prevCourses, newCourse]);
  };

  const updateProgress = (courseId: string, moduleId: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedSections = course.sections.map(section => ({
            ...section,
            chapters: section.chapters.map(chapter => ({
              ...chapter,
              modules: chapter.modules.map(module => 
                module.id === moduleId ? { ...module, isCompleted: true } : module
              )
            }))
          }));
          return { ...course, sections: updatedSections };
        }
        return course;
      })
    );
    console.log(`Progress updated for course ${courseId}, module ${moduleId}`);
  };

  const getCourseProgress = (courseId: string): number => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    let completedModules = 0;
    let totalModules = 0;
    
    course.sections.forEach(section => {
      section.chapters.forEach(chapter => {
        chapter.modules.forEach(module => {
          totalModules++;
          if (module.isCompleted) completedModules++;
        });
      });
    });
    
    return totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  };

  return (
    <LMSContext.Provider value={{
      currentUser,
      courses,
      isAuthenticated,
      login,
      logout,
      updateProgress,
      getCourseProgress,
      addCourse
    }}>
      {children}
    </LMSContext.Provider>
  );
};
