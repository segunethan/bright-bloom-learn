
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLMS } from '../../contexts/LMSContext';
import { Book, Clock, User } from 'lucide-react';

const StudentCourses = () => {
  const { courses, currentUser, getCourseProgress } = useLMS();
  const navigate = useNavigate();

  const enrolledCourses = courses.filter(course => 
    currentUser?.enrolledCourses.includes(course.id)
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="text-gray-600 mt-2">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => {
          const progress = getCourseProgress(course.id);
          return (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-gray-600">
                      {course.description}
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center ml-4">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-green-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{course.sections.length} sections</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.totalModules} modules</span>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/lms/course/${course.id}`)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  {progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {enrolledCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600">Contact your administrator to get enrolled in courses.</p>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
