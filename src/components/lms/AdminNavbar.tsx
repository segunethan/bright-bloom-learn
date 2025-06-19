
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLMS } from '../../contexts/LMSContext';
import { Settings, Book, User } from 'lucide-react';

const AdminNavbar = () => {
  const { currentUser, signOut } = useLMS();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    console.log('Admin logout initiated');
    try {
      await signOut();
      console.log('Admin logout successful, redirecting to login');
      navigate('/lms/admin/login');
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">Admin Portal</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <Button
                variant={isActive('/admin') && !isActive('/courses') && !isActive('/students') ? "default" : "ghost"}
                onClick={() => navigate('/lms/admin')}
                className={isActive('/admin') && !isActive('/courses') && !isActive('/students') ? 
                  "bg-gradient-to-r from-purple-500 to-purple-600 text-white" : 
                  "text-gray-600 hover:text-purple-600"
                }
              >
                Overview
              </Button>
              <Button
                variant={isActive('/courses') ? "default" : "ghost"}
                onClick={() => navigate('/lms/admin/courses')}
                className={isActive('/courses') ? 
                  "bg-gradient-to-r from-purple-500 to-purple-600 text-white" : 
                  "text-gray-600 hover:text-purple-600"
                }
              >
                <Book className="w-4 h-4 mr-2" />
                Courses
              </Button>
              <Button
                variant={isActive('/students') ? "default" : "ghost"}
                onClick={() => navigate('/lms/admin/students')}
                className={isActive('/students') ? 
                  "bg-gradient-to-r from-purple-500 to-purple-600 text-white" : 
                  "text-gray-600 hover:text-purple-600"
                }
              >
                <User className="w-4 h-4 mr-2" />
                Students
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Settings className="w-4 h-4" />
              <span>Admin: {currentUser?.name}</span>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
