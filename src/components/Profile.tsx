
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDown, MapPin, Award, Calendar, Users, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProblems } from "@/hooks/useProblems";

interface ProfileProps {
  onBack: () => void;
}

const Profile = ({ onBack }: ProfileProps) => {
  const { user, logout } = useAuth();
  const { data: problems = [] } = useProblems();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Calculate user statistics from actual data
  const userProblems = problems.filter(p => (p.postedBy || p.posted_by) === user.id);
  const completedProblems = userProblems.filter(p => p.status === 'approved');
  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  }) : 'Recently';

  const badges = [
    { name: "Community Helper", icon: "🤝", earned: "2 weeks ago", condition: userProblems.length >= 3 },
    { name: "Problem Solver", icon: "🔧", earned: "1 month ago", condition: completedProblems.length >= 2 },
    { name: "Safety Champion", icon: "🛡️", earned: "2 months ago", condition: userProblems.some(p => p.tags?.includes('Safety')) },
    { name: "First Mission", icon: "🚀", earned: "Recently", condition: userProblems.length >= 1 }
  ].filter(badge => badge.condition);

  const handleSignOut = () => {
    logout();
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-ncc text-white p-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="mr-3 text-white hover:bg-white/20"
          >
            <ArrowDown className="w-4 h-4 rotate-90" />
          </Button>
          <h1 className="text-xl font-bold">Cadet Profile</h1>
        </div>

        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-white text-ncc-navy text-xl font-bold">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-blue-100">{user.rank || 'Cadet'}</p>
            <p className="text-blue-200 text-sm">
              {user.unitCode && `${user.unitCode} • `}{user.wing || 'NCC'} {user.directorate && `• ${user.directorate}`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ncc-navy">{userProblems.length}</div>
              <div className="text-sm text-gray-600">Problems Posted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ncc-green">{completedProblems.length * 50}</div>
              <div className="text-sm text-gray-600">Impact Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {user.institute && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Institute</span>
                <span className="font-medium">{user.institute}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Joined</span>
              <span className="font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {joinedDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Role</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            {userProblems.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Approval Rate</span>
                <span className="font-medium text-ncc-green">
                  {Math.round((completedProblems.length / userProblems.length) * 100)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Badges Earned ({badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{badge.name}</div>
                      <div className="text-xs text-gray-500">{badge.earned}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No badges earned yet</p>
                <p className="text-sm">Post your first problem to start earning badges!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Problems */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy flex items-center">
              <Users className="w-5 h-5 mr-2" />
              My Problems ({userProblems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProblems.length > 0 ? (
              userProblems.slice(0, 3).map((problem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{problem.title}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {problem.location}
                    </div>
                  </div>
                  <Badge 
                    className={
                      problem.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : problem.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {problem.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No problems posted yet</p>
                <p className="text-sm">Start by posting a problem in your community!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2 pb-6">
          <Button variant="outline" className="w-full" disabled>
            Edit Profile (Coming Soon)
          </Button>
          <Button variant="outline" className="w-full" disabled>
            View Certificates (Coming Soon)
          </Button>
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
