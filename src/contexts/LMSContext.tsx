import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  isActive: boolean;
  enrolledCourses: string[];
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
  currentUser: User | null;
  courses: Course[];
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'student' | 'admin') => Promise<boolean>;
  logout: () => void;
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

  // Mock data with new hierarchy
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

  const login = async (email: string, password: string, role: 'student' | 'admin'): Promise<boolean> => {
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
    // Implementation for drag & drop reordering
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
      addCourse,
      updateCourse,
      addSection,
      addChapter,
      addModule,
      addSubmodule,
      updateSubmodule,
      reorderItems
    }}>
      {children}
    </LMSContext.Provider>
  );
};
