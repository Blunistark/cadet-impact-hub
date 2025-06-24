
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDown, MapPin, Award, Calendar, Users } from "lucide-react";

interface ProfileProps {
  onBack: () => void;
}

const Profile = ({ onBack }: ProfileProps) => {
  const cadetData = {
    name: "Raj Kumar",
    rank: "Senior Under Officer",
    unit: "1DG Battalion",
    directorate: "Army Wing",
    institute: "Christ University, Bangalore",
    joinedDate: "August 2022",
    missionsJoined: 12,
    missionsCompleted: 8,
    impactPoints: 1250,
    badges: [
      { name: "Community Helper", icon: "🤝", earned: "2 weeks ago" },
      { name: "Environment Warrior", icon: "🌱", earned: "1 month ago" },
      { name: "Safety Champion", icon: "🛡️", earned: "2 months ago" },
      { name: "First Mission", icon: "🚀", earned: "6 months ago" }
    ],
    recentMissions: [
      { title: "Street Light Repair", status: "completed", location: "MG Road" },
      { title: "Community Garden", status: "in-progress", location: "Christ University" },
      { title: "Digital Literacy Drive", status: "completed", location: "Jayanagar" }
    ]
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
            <AvatarContent className="bg-white text-ncc-navy text-xl font-bold">
              {cadetData.name.split(' ').map(n => n[0]).join('')}
            </AvatarContent>
            <AvatarFallback>RC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{cadetData.name}</h2>
            <p className="text-blue-100">{cadetData.rank}</p>
            <p className="text-blue-200 text-sm">{cadetData.unit} • {cadetData.directorate}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ncc-navy">{cadetData.missionsJoined}</div>
              <div className="text-sm text-gray-600">Missions Joined</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-ncc-green">{cadetData.impactPoints}</div>
              <div className="text-sm text-gray-600">Impact Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Cadet Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy">Cadet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Institute</span>
              <span className="font-medium">{cadetData.institute}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Joined NCC</span>
              <span className="font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {cadetData.joinedDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium text-ncc-green">
                {Math.round((cadetData.missionsCompleted / cadetData.missionsJoined) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {cadetData.badges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{badge.icon}</div>
                  <div>
                    <div className="font-medium text-sm">{badge.name}</div>
                    <div className="text-xs text-gray-500">{badge.earned}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Missions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Missions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cadetData.recentMissions.map((mission, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{mission.title}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {mission.location}
                  </div>
                </div>
                <Badge 
                  className={mission.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {mission.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2 pb-6">
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full">
            View Certificates
          </Button>
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
