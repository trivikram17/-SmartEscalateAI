import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Mail, Calendar, MapPin, Briefcase, Phone, Camera, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Guest User";
  const userEmail = localStorage.getItem("userEmail") || "guest@smartescalate.ai";
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
  // Only check email to determine if guest
  const isGuest = userEmail === "guest@smartescalate.ai";
  
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        {/* Guest User Notice */}
        {isGuest && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">You're browsing as a Guest</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign in to unlock chatbot access, save your preferences, and generate support tickets
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In Now
              </Button>
            </div>
          </Card>
        )}

        {/* Profile Card */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-4xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-primary"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="text-xs">
                {userName === "Guest User" ? "Guest Account" : "Premium User"}
              </Badge>
              {isGuest && (
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    defaultValue={userName}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue={userEmail}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+1 (555) 123-4567"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="San Francisco, CA"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    disabled={isGuest}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(false)}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </>
                )}
                {isGuest && (
                  <p className="text-sm text-muted-foreground flex items-center">
                    Sign in to edit your profile
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Account Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">October 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Activity Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Conversations</span>
                <span className="font-medium">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issues Resolved</span>
                <span className="font-medium">98</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium text-green-600">96%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
