import { useState } from "react";
import { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, Edit } from "lucide-react";
import EditProfileModal from "./edit-profile-modal";

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <UserCircle className="text-primary dark:text-blue-400 mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">Profile Information</span>
              <span className="sm:hidden">Profile</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary-foreground hover:bg-primary"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-100 dark:border-gray-700">
              <AvatarImage src={user.profileImage} alt="Profile picture" />
              <AvatarFallback className="text-lg sm:text-xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{user.name}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3">{user.email}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Role:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{user.role}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Department:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{user.department}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Member since:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{user.joinDate}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Location:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{user.location}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileModal
        user={user}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
    </>
  );
}
