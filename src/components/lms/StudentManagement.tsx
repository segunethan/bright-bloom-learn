
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLMS } from '../../contexts/LMSContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Plus, Search, Settings, Mail, Key, BookOpen, UserX } from 'lucide-react';

interface StudentWithEnrollments {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  phone_number: string | null;
  profile_picture_url: string | null;
  enrolledCourses: string[];
  progress: number;
}

const StudentManagement = () => {
  const { courses, inviteStudent, updateStudent, resetStudentPassword, assignCourseToStudent, unassignCourseFromStudent } = useLMS();
  const [students, setStudents] = useState<StudentWithEnrollments[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [managingStudent, setManagingStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({
    email: '',
    name: '',
    assignedCourses: [] as string[]
  });

  useEffect(() => {
    loadStudentsWithEnrollments();
  }, []);

  const loadStudentsWithEnrollments = async () => {
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (studentsError) {
        console.error('Error loading students:', studentsError);
        return;
      }

      const studentsWithEnrollments = await Promise.all(
        (studentsData || []).map(async (student) => {
          const { data: enrollments } = await supabase
            .from('enrollments')
            .select('course_id, progress')
            .eq('student_id', student.id)
            .eq('is_active', true);

          const enrolledCourses = enrollments?.map(e => e.course_id) || [];
          const avgProgress = enrollments?.length 
            ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
            : 0;

          return {
            ...student,
            enrolledCourses,
            progress: Math.round(avgProgress)
          };
        })
      );

      setStudents(studentsWithEnrollments);
    } catch (error) {
      console.error('Error loading students with enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteStudent = () => {
    if (newStudent.email && newStudent.name) {
      inviteStudent(newStudent.email, newStudent.name);
      setIsInviting(false);
      setNewStudent({ email: '', name: '', assignedCourses: [] });
      alert(`Student invited successfully! Default password: temp123`);
    }
  };

  const handleManageStudent = (studentId: string) => {
    setManagingStudent(managingStudent === studentId ? null : studentId);
  };

  const handleResetPassword = (studentEmail: string, studentName: string) => {
    resetStudentPassword(studentEmail);
    alert(`Password reset email sent to ${studentName}.`);
  };

  const handleToggleStudentStatus = (studentId: string, currentStatus: boolean) => {
    updateStudent(studentId, { is_active: !currentStatus });
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, is_active: !currentStatus }
        : student
    ));
  };

  const handleCourseAssignment = (studentId: string, courseId: string, isAssigned: boolean) => {
    if (isAssigned) {
      unassignCourseFromStudent(studentId, courseId);
    } else {
      assignCourseToStudent(studentId, courseId);
    }
    
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? {
            ...student,
            enrolledCourses: isAssigned 
              ? student.enrolledCourses.filter(id => id !== courseId)
              : [...student.enrolledCourses, courseId]
          }
        : student
    ));
  };

  const handleCourseSelection = (courseId: string, isSelected: boolean) => {
    if (isSelected) {
      setNewStudent(prev => ({
        ...prev,
        assignedCourses: [...prev.assignedCourses, courseId]
      }));
    } else {
      setNewStudent(prev => ({
        ...prev,
        assignedCourses: prev.assignedCourses.filter(id => id !== courseId)
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-gray-600 mt-2">Manage student accounts and enrollments</p>
        </div>
        <Button 
          onClick={() => setIsInviting(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Invite Student
        </Button>
      </div>

      {/* Invite Student Form */}
      {isInviting && (
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Invite New Student</CardTitle>
            <CardDescription>Send an invitation to a new student with course assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter student name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email Address</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Assign Courses</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`course-${course.id}`}
                      checked={newStudent.assignedCourses.includes(course.id)}
                      onCheckedChange={(checked) => handleCourseSelection(course.id, checked as boolean)}
                    />
                    <Label htmlFor={`course-${course.id}`} className="text-sm font-normal">
                      {course.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleInviteStudent}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                disabled={!newStudent.email || !newStudent.name}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsInviting(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-xs text-gray-500">Member since: {new Date(student.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge variant={student.is_active ? "default" : "secondary"}>
                      {student.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {student.enrolledCourses.length} course{student.enrolledCourses.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {student.progress}% avg progress
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageStudent(student.id)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </div>

              {/* Student Management Panel */}
              {managingStudent === student.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleResetPassword(student.email, student.name)}
                      className="w-full"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleToggleStudentStatus(student.id, student.is_active)}
                      className="w-full"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      {student.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Course Assignments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {courses.map((course) => {
                        const isAssigned = student.enrolledCourses.includes(course.id);
                        return (
                          <div key={course.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{course.title}</span>
                            <Button
                              size="sm"
                              variant={isAssigned ? "destructive" : "default"}
                              onClick={() => handleCourseAssignment(student.id, course.id, isAssigned)}
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              {isAssigned ? 'Remove' : 'Assign'}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {student.enrolledCourses.map((courseId) => {
                    const course = courses.find(c => c.id === courseId);
                    return course ? (
                      <Badge key={courseId} variant="outline" className="text-xs">
                        {course.title}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Invite your first student to get started'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsInviting(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Invite First Student
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
