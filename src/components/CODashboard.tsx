import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useProblems, useUpdateProblem } from "@/hooks/useProblems";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface CODashboardProps {
  onBack: () => void;
}

const CODashboard = ({ onBack }: CODashboardProps) => {
  const { data: problems = [], isLoading: loading } = useProblems();
  const { user, logout } = useAuth();
  const updateProblem = useUpdateProblem();
  const [selectedProblem, setSelectedProblem] = useState<any>(null);

  // Filter problems that need CO approval (Level 3)
  const level3Problems = problems.filter(p => p.level === 'level3' && p.status === 'pending');
  const approvedByMe = problems.filter(p => p.approvedBy === user?.id && p.status === 'approved');
  const rejectedByMe = problems.filter(p => p.approvedBy === user?.id && p.status === 'rejected');

  const handleApproval = async (problemId: string, action: 'approve' | 'reject', feedback?: string) => {
    try {
      await updateProblem.mutateAsync({
        id: problemId,
        data: {
          status: action === 'approve' ? 'approved' : 'rejected',
          approvedBy: user?.id,
          approvalFeedback: feedback
        }
      });
      
      toast({
        title: action === 'approve' ? "Problem Approved" : "Problem Rejected",
        description: `Level 3 problem has been ${action}d successfully.`
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

  const handleSignOut = () => {
    logout();
    onBack();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ncc-navy mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ncc-navy to-blue-800 text-white p-4">
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
                CO Command Center
              </h1>
              <p className="text-blue-100 text-sm">Commanding Officer Dashboard</p>
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
            Welcome back, <span className="font-semibold">{user?.fullName}</span>
          </p>
          <p className="text-xs text-blue-200">
            {level3Problems.length} Level 3 problems awaiting your approval
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-orange-600">{level3Problems.length}</div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-600">{approvedByMe.length}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-red-600">{rejectedByMe.length}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Level 3 Problems */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Level 3 Problems Requiring CO Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            {level3Problems.length > 0 ? (
              <div className="space-y-3">
                {level3Problems.map((problem) => (
                  <div key={problem.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{problem.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{problem.description}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          📍 {problem.location}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Priority: {problem.priority}
                          </Badge>
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Level 3 - CO Approval Required
                          </Badge>
                        </div>
                        {problem.tags && (
                          <div className="flex gap-1 mb-2">
                            {problem.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproval(problem.id, 'approve', 'Approved by CO')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setSelectedProblem(problem)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No Level 3 problems pending approval</p>
                <p className="text-sm">All high-level issues have been reviewed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Decisions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-ncc-navy">Recent Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            {[...approvedByMe, ...rejectedByMe].slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {[...approvedByMe, ...rejectedByMe]
                  .sort((a, b) => new Date(b.updatedAt || b.updated_at).getTime() - new Date(a.updatedAt || a.updated_at).getTime())
                  .slice(0, 5)
                  .map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{problem.title}</p>
                        <p className="text-sm text-gray-600">{problem.location}</p>
                      </div>
                      <Badge 
                        className={problem.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      >
                        {problem.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent decisions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rejection Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle className="text-red-600">Reject Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Are you sure you want to reject this Level 3 problem?</p>
              <p className="font-medium mb-4">{selectedProblem.title}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProblem(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => handleApproval(selectedProblem.id, 'reject', 'Rejected by CO - Does not meet Level 3 criteria')}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CODashboard;