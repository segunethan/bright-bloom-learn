
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, User, Settings, GraduationCap, Clock, Users } from 'lucide-react';
import { useLMS } from '../contexts/LMSContext';

const Index = () => {
  const navigate = useNavigate();
  const { courses } = useLMS();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  One234 Tech
                </h1>
                <p className="text-gray-600">Product School Learning Platform</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/lms')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              Access LMS
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to One234 Tech Product School
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Develop your product career with our comprehensive Learning Management System. 
            Access courses, track progress, and master the skills you need to succeed.
          </p>
        </div>

        {/* Course Catalog */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Course Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.total_modules} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>24 students</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/lms')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  Start Course
                </Button>
              </div>
            ))}
          </div>
          
          {courses.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No courses available at the moment.</p>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Student Portal
              </CardTitle>
              <CardDescription>
                Access your courses, track progress, and continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/lms')}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Student Login
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Book className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Course Library
              </CardTitle>
              <CardDescription>
                Comprehensive courses on Product Design and Product Management
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/lms')}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                Browse Courses
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Manage courses, students, and monitor learning analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/lms/admin/login')}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Admin Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
          <p className="text-xl mb-8 text-green-100">
            Join hundreds of students developing successful product careers
          </p>
          <Button 
            onClick={() => navigate('/lms')}
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Access Learning Platform
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
