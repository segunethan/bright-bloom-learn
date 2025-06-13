
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/lms';

export const useStudents = () => {
  const [students, setStudents] = useState<Profile[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

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

  return {
    students,
    inviteStudent,
    updateStudent,
    resetStudentPassword,
    assignCourseToStudent,
    unassignCourseFromStudent,
  };
};
