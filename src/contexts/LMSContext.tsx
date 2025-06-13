
import React, { createContext, useContext, ReactNode } from 'react';
import { LMSContextType } from '@/types/lms';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useStudents } from '@/hooks/useStudents';

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (context === undefined) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};

export const LMSProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const courses = useCourses();
  const students = useStudents();

  const value: LMSContextType = {
    ...auth,
    ...courses,
    ...students,
  };

  return (
    <LMSContext.Provider value={value}>
      {children}
    </LMSContext.Provider>
  );
};
