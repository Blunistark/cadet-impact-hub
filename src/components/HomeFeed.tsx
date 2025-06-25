
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Home, Plus, Map, User, MapPin, Calendar, LogOut } from "lucide-react";
import { useProblems, Problem } from "@/hooks/useProblems";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface HomeFeedProps {
  onPostProblem: () => void;
  onProfile: () => void;
  onMapView: () => void;
}

const HomeFeed = ({ onPostProblem, onProfile, onMapView }: HomeFeedProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const { problems, loading } = useProblems();
  const { profile, signOut } = useAuth();
  const { toast } = useToast();

  const handleViewProblem = (problem: Problem) => {
    toast({
      title: 'Mission Details',
      description: `Viewing: ${problem.title}`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const approvedProblems = problems.filter(p => p.status === 'approved');
  const myProblems = problems.filter(p => p.posted_by === profile?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ncc-navy">Mission Feed</h1>
            <p className="text-gray-600 text-sm">Find problems to solve in your area</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={onProfile}
              variant="ghost" 
              size="sm"
              className="rounded-full p-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-ncc-navy text-white">
                  {profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              size="sm"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ncc-navy">{approvedProblems.length}</div>
              <div className="text-sm text-gray-600">Active Missions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ncc-green">{myProblems.length}</div>
              <div className="text-sm text-gray-600">My Problems</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-ncc-saffron">
                {problems.filter(p => p.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
        </div>

        {/* Problems Feed */}
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading missions...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {problems.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-gray-600">No missions available yet.</p>
                  <Button 
                    onClick={onPostProblem}
                    className="mt-4 bg-ncc-navy hover:bg-blue-800"
                  >
                    Create the first mission
                  </Button>
                </CardContent>
              </Card>
            ) : (
              problems.map((problem) => (
                <Card 
                  key={problem.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewProblem(problem)}
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
                            {formatTimeAgo(problem.created_at)}
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
                        By {problem.profiles?.full_name || 'Unknown'}
                      </div>
                    </div>
                    {problem.status === 'approved' && (
                      <div className="mt-3">
                        <Button className="w-full bg-ncc-navy hover:bg-blue-800">
                          Join Mission
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
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
            onClick={() => {
              setActiveTab('map');
              onMapView();
            }}
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
