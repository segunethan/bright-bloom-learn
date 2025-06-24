
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

interface LMSContextType {
  currentUser: User | null;
  courses: Course[];
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'student' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateProgress: (courseId: string, moduleId: string) => void;
  getCourseProgress: (courseId: string) => number;
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

  // Mock data - in real app, this would come from backend
  const [courses] = useState<Course[]>([
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
                  content: 'Product design is the process of creating solutions...',
                  videoUrl: 'https://example.com/video1',
                  isCompleted: false,
                  duration: 15
                },
                {
                  id: 'm2',
                  title: 'User Research Methods',
                  type: 'video',
                  content: '',
                  videoUrl: 'https://example.com/video2',
                  isCompleted: false,
                  duration: 20
                }
              ]
            }
          ]
        }
      ],
      totalModules: 2,
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
                  id: 'm3',
                  title: 'Understanding Your Market',
                  type: 'text',
                  content: 'Market research is crucial for product success...',
                  isCompleted: false,
                  duration: 10
                }
              ]
            }
          ]
        }
      ],
      totalModules: 1,
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

  const updateProgress = (courseId: string, moduleId: string) => {
    // Update module completion - in real app, this would sync with backend
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
      getCourseProgress
    }}>
      {children}
    </LMSContext.Provider>
  );
};
