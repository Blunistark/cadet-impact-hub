import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, MapPin, Plus, User, Map } from "lucide-react";
import { useProblems, useUpdateProblem } from "@/hooks/useProblems";
import ANOProblemsView from "./ANOProblemsView";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ANODashboardProps {
  onBack: () => void;
  onPostProblem: () => void;
  onProfile: () => void;
  onMapView: () => void;
}

const ANODashboard = ({ onBack, onPostProblem, onProfile, onMapView }: ANODashboardProps) => {
  const { data: problems = [], isLoading: loading } = useProblems();
  const { user, logout } = useAuth();
  const updateProblem = useUpdateProblem();
  const [view, setView] = useState<'dashboard' | 'problems'>('dashboard');
  const [selectedProblem, setSelectedProblem] = useState<any>(null);

  const handleSignOut = () => {
    logout();
    onBack();
  };

  // Filter problems by level for ANO approval
  const level1Problems = problems.filter(p => p.level === 'level1' || !p.level);
  const level2Problems = problems.filter(p => p.level === 'level2' && p.status === 'pending');
  const level3Problems = problems.filter(p => p.level === 'level3');
  
  const pendingProblems = problems.filter(p => p.status === 'pending');
  const approvedProblems = problems.filter(p => p.status === 'approved');
  const rejectedProblems = problems.filter(p => p.status === 'rejected');

  const handleApproval = async (problemId: string, action: 'approve' | 'reject' | 'escalate', feedback?: string, level?: string) => {
    try {
      const updateData: any = {
        approvedBy: user?.id,
        approvalFeedback: feedback
      };

      if (action === 'approve') {
        updateData.status = 'approved';
      } else if (action === 'reject') {
        updateData.status = 'rejected';
      } else if (action === 'escalate') {
        updateData.level = level;
        updateData.status = 'pending'; // Keep pending but escalate level
      }

      await updateProblem.mutateAsync({
        id: problemId,
        data: updateData
      });
      
      toast({
        title: action === 'approve' ? "Problem Approved" : action === 'reject' ? "Problem Rejected" : "Problem Escalated",
        description: `Problem has been ${action}d successfully.`
      });
      
      setSelectedProblem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update problem status.",
        variant: "destructive"
      });
    }
  };

  if (view === 'problems') {
    return (
      <ANOProblemsView 
        problems={problems} 
        loading={loading} 
        showActions={true}
        onBack={() => setView('dashboard')}
        onApprove={(id, feedback) => handleApproval(id, 'approve', feedback)}
        onReject={(id, feedback) => handleApproval(id, 'reject', feedback)}
        onEscalate={(id, level, feedback) => handleApproval(id, 'escalate', feedback, level)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ncc-navy to-blue-700 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mr-3 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                ANO Portal
              </h1>
              <p className="text-blue-100 text-sm">Area NCC Officer Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-white hover:bg-white/20"
          >
            Sign Out
          </Button>
        </div>

        {/* Welcome Message */}
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-sm">
            Welcome back, <span className="font-semibold">{user?.fullName || 'ANO'}</span>
          </p>
          <p className="text-xs text-blue-200">
            {level2Problems.length} Level 2 problems need your approval
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <Button
            variant="ghost"
            className={`flex-1 py-3 rounded-none ${view === 'dashboard' ? 'border-b-2 border-ncc-navy text-ncc-navy' : 'text-gray-600'}`}
            onClick={() => setView('dashboard')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="flex-1 py-3 rounded-none text-gray-600"
            onClick={() => setView('problems')}
          >
            <Clock className="w-4 h-4 mr-2" />
            All Problems
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button
            onClick={onPostProblem}
            className="flex-col h-16 bg-ncc-green hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs">Post Problem</span>
          </Button>
          <Button
            onClick={onMapView}
            variant="outline"
            className="flex-col h-16"
          >
            <Map className="w-5 h-5 mb-1" />
            <span className="text-xs">Map View</span>
          </Button>
          <Button
            onClick={onProfile}
            variant="outline"
            className="flex-col h-16"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{level1Problems.length}</div>
              <div className="text-xs text-gray-600">Level 1</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-orange-600">{level2Problems.length}</div>
              <div className="text-xs text-gray-600">Need Approval</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-green-600">{approvedProblems.length}</div>
              <div className="text-xs text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-red-600">{level3Problems.length}</div>
              <div className="text-xs text-gray-600">Level 3</div>
            </CardContent>
          </Card>
        </div>

        {/* Level 2 Problems Requiring ANO Approval */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Level 2 Problems Requiring Your Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            {level2Problems.length > 0 ? (
              <div className="space-y-3">
                {level2Problems.slice(0, 3).map((problem) => (
                  <div key={problem.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{problem.title}</h3>
                        <p className="text-gray-600 text-sm mb-1">{problem.description}</p>
                        <p className="text-sm text-gray-500 mb-2">📍 {problem.location}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            Level 2 - ANO Approval Required
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {problem.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproval(problem.id, 'approve', 'Approved by ANO')}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleApproval(problem.id, 'reject', 'Rejected by ANO')}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600"
                        onClick={() => handleApproval(problem.id, 'escalate', 'Escalated to CO for Level 3 approval', 'level3')}
                      >
                        Escalate to CO
                      </Button>
                    </div>
                  </div>
                ))}
                {level2Problems.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setView('problems')}
                  >
                    View All {level2Problems.length} Problems
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No Level 2 problems pending approval</p>
                <p className="text-sm">All problems have been reviewed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {problems.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {problems
                  .sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime())
                  .slice(0, 5)
                  .map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{problem.title}</p>
                        <p className="text-xs text-gray-600">{problem.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          problem.level === 'level1' ? 'bg-blue-100 text-blue-800' :
                          problem.level === 'level2' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.level?.replace('level', 'L') || 'L1'}
                        </Badge>
                        <Badge 
                          className={`text-xs ${
                            problem.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            problem.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {problem.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ANODashboard;