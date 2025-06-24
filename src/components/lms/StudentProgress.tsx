
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLMS } from '../../contexts/LMSContext';
import { Book, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const StudentProgress = () => {
  const { courses, currentUser, getCourseProgress } = useLMS();

  const enrolledCourses = courses.filter(course => 
    currentUser?.enrolledCourses.includes(course.id)
  );

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => getCourseProgress(course.id) === 100).length;
  const averageProgress = totalCourses > 0 ? 
    enrolledCourses.reduce((sum, course) => sum + getCourseProgress(course.id), 0) / totalCourses : 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Your Learning Progress
        </h1>
        <p className="text-gray-600 mt-2">Track your achievements and growth</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Courses</p>
                <p className="text-3xl font-bold">{totalCourses}</p>
              </div>
              <Book className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed</p>
                <p className="text-3xl font-bold">{completedCourses}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Avg Progress</p>
                <p className="text-3xl font-bold">{Math.round(averageProgress)}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Progress</h2>
        
        {enrolledCourses.map((course) => {
          const progress = getCourseProgress(course.id);
          const isCompleted = progress === 100;
          
          return (
            <Card key={course.id} className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {course.description}
                    </CardDescription>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-green-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-800">{course.sections.length}</div>
                    <div className="text-gray-500">Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-800">{course.totalModules}</div>
                    <div className="text-gray-500">Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-800">
                      {Math.round((progress / 100) * course.totalModules)}
                    </div>
                    <div className="text-gray-500">Completed</div>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        {course.totalModules - Math.round((progress / 100) * course.totalModules)} modules remaining
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {enrolledCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No progress to show</h3>
          <p className="text-gray-600">Start taking courses to see your progress here.</p>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
