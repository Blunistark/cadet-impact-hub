
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Home, Plus, Map, User, MapPin, Calendar } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  location: string;
  postedBy: string;
  postedAt: string;
  tags: string[];
  membersCount: number;
  status: 'active' | 'in-progress' | 'completed';
}

interface HomeFeedProps {
  onPostProblem: () => void;
  onViewProblem: (problem: Problem) => void;
  onProfile: () => void;
}

const HomeFeed = ({ onPostProblem, onViewProblem, onProfile }: HomeFeedProps) => {
  const [activeTab, setActiveTab] = useState('home');

  const mockProblems: Problem[] = [
    {
      id: '1',
      title: 'Street Light Repair Needed',
      description: 'Several street lights are not working on MG Road, creating safety concerns for evening commuters.',
      location: 'MG Road, Bangalore',
      postedBy: 'Cadet Raj Kumar',
      postedAt: '2 hours ago',
      tags: ['Infrastructure', 'Safety', 'Urgent'],
      membersCount: 8,
      status: 'active'
    },
    {
      id: '2',
      title: 'Community Garden Initiative',
      description: 'Creating a community garden in the vacant lot near our college to promote environmental awareness.',
      location: 'Christ University, Bangalore',
      postedBy: 'Cadet Priya Singh',
      postedAt: '5 hours ago',
      tags: ['Environment', 'Community', 'Green'],
      membersCount: 15,
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Digital Literacy for Elderly',
      description: 'Teaching basic smartphone and internet skills to elderly residents in our neighborhood.',
      location: 'Jayanagar, Bangalore',
      postedBy: 'Cadet Amit Sharma',
      postedAt: '1 day ago',
      tags: ['Education', 'Digital', 'Community'],
      membersCount: 12,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ncc-navy">Mission Feed</h1>
            <p className="text-gray-600 text-sm">Find problems to solve in your area</p>
          </div>
          <Button 
            onClick={onProfile}
            variant="ghost" 
            size="sm"
            className="rounded-full p-2"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage className="bg-ncc-navy text-white">
                RC
              </AvatarImage>
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ncc-navy">24</div>
              <div className="text-sm text-gray-600">Active Missions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ncc-green">156</div>
              <div className="text-sm text-gray-600">Cadets Joined</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ncc-saffron">8</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Problems Feed */}
        <div className="space-y-4">
          {mockProblems.map((problem) => (
            <Card 
              key={problem.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onViewProblem(problem)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {problem.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {problem.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {problem.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {problem.postedAt}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(problem.status)}>
                    {problem.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {problem.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {problem.membersCount} cadets joined
                  </div>
                </div>
                <div className="mt-3">
                  <Button className="w-full bg-ncc-navy hover:bg-blue-800">
                    Join Mission
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <Button 
            variant={activeTab === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button 
            variant="ghost"
            size="sm"
            onClick={onPostProblem}
            className="flex flex-col items-center gap-1 bg-ncc-saffron hover:bg-orange-500 text-white"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Post</span>
          </Button>
          
          <Button 
            variant={activeTab === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('map')}
            className="flex flex-col items-center gap-1"
          >
            <Map className="w-5 h-5" />
            <span className="text-xs">Map</span>
          </Button>
          
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={onProfile}
            className="flex flex-col items-center gap-1"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
