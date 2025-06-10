
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLMS } from '../../contexts/LMSContext';
import { User, Book, Settings } from 'lucide-react';

const StudentNavbar = () => {
  const { currentUser, logout } = useLMS();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/lms');
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">One234 LMS</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <Button
                variant={isActive('/student') && !isActive('/progress') && !isActive('/settings') ? "default" : "ghost"}
                onClick={() => navigate('/lms/student')}
                className={isActive('/student') && !isActive('/progress') && !isActive('/settings') ? 
                  "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : 
                  "text-gray-600 hover:text-green-600"
                }
              >
                My Courses
              </Button>
              <Button
                variant={isActive('/progress') ? "default" : "ghost"}
                onClick={() => navigate('/lms/student/progress')}
                className={isActive('/progress') ? 
                  "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : 
                  "text-gray-600 hover:text-green-600"
                }
              >
                Progress
              </Button>
              <Button
                variant={isActive('/settings') ? "default" : "ghost"}
                onClick={() => navigate('/lms/student/settings')}
                className={isActive('/settings') ? 
                  "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : 
                  "text-gray-600 hover:text-green-600"
                }
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{currentUser?.name}</span>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
