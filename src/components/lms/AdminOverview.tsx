
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLMS } from '../../contexts/LMSContext';
import { Book, User, TrendingUp, CheckCircle } from 'lucide-react';

const AdminOverview = () => {
  const { courses } = useLMS();
  const navigate = useNavigate();

  // Mock data for overview - in real app, this would come from backend
  const stats = {
    totalStudents: 156,
    activeCourses: courses.length,
    completionRate: 78,
    activeStudents: 142
  };

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your learning platform</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          onClick={() => handleCardClick('/lms/admin/students')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <User className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
          onClick={() => handleCardClick('/lms/admin/courses')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Courses</p>
                <p className="text-3xl font-bold">{stats.activeCourses}</p>
              </div>
              <Book className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Completion Rate</p>
                <p className="text-3xl font-bold">{stats.completionRate}%</p>
              </div>
              <CheckCircle className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
          onClick={() => handleCardClick('/lms/admin/students')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Active Students</p>
                <p className="text-3xl font-bold">{stats.activeStudents}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Recent Course Activity</CardTitle>
            <CardDescription>Latest student engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{course.title}</p>
                    <p className="text-sm text-gray-600">12 students active today</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">89% avg progress</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button 
                onClick={() => handleCardClick('/lms/admin/courses')}
                className="w-full p-3 text-left bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 transition-colors"
              >
                <p className="font-medium text-green-800">Create New Course</p>
                <p className="text-sm text-green-600">Add a new course to the platform</p>
              </button>
              
              <button 
                onClick={() => handleCardClick('/lms/admin/students')}
                className="w-full p-3 text-left bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-100 transition-colors"
              >
                <p className="font-medium text-blue-800">Add Students</p>
                <p className="text-sm text-blue-600">Enroll new students in courses</p>
              </button>
              
              <button className="w-full p-3 text-left bg-gradient-to-r from-purple-50 to-purple-50 border border-purple-200 rounded-lg hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-100 transition-colors">
                <p className="font-medium text-purple-800">View Reports</p>
                <p className="text-sm text-purple-600">Generate detailed analytics</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
