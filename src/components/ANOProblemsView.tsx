
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, MapPin, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Problem {
  id: string;
  title: string;
  description: string;
  location: string;
  postedBy: string;
  postedAt: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  priority?: 'low' | 'medium' | 'high';
}

const ANOProblemsView = () => {
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: '1',
      title: 'Street Light Repair Needed',
      description: 'Several street lights are not working on MG Road, creating safety concerns for evening commuters.',
      location: 'MG Road, Bangalore',
      postedBy: 'Cadet Raj Kumar',
      postedAt: '2 hours ago',
      tags: ['Infrastructure', 'Safety', 'Urgent'],
      status: 'pending'
    },
    {
      id: '2',
      title: 'Community Garden Initiative',
      description: 'Creating a community garden in the vacant lot near our college to promote environmental awareness.',
      location: 'Christ University, Bangalore',
      postedBy: 'Cadet Priya Singh',
      postedAt: '5 hours ago',
      tags: ['Environment', 'Community', 'Green'],
      status: 'approved'
    },
    {
      id: '3',
      title: 'Digital Literacy for Elderly',
      description: 'Teaching basic smartphone and internet skills to elderly residents in our neighborhood.',
      location: 'Jayanagar, Bangalore',
      postedBy: 'Cadet Amit Sharma',
      postedAt: '1 day ago',
      tags: ['Education', 'Digital', 'Community'],
      status: 'pending'
    }
  ]);

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleApprovalAction = (problem: Problem, action: 'approve' | 'reject') => {
    setSelectedProblem(problem);
    setApprovalAction(action);
    setShowApprovalDialog(true);
    setFeedback('');
  };

  const confirmApproval = () => {
    if (!selectedProblem) return;

    setProblems(prev => prev.map(p => 
      p.id === selectedProblem.id 
        ? { ...p, status: approvalAction === 'approve' ? 'approved' : 'rejected' }
        : p
    ));

    toast({
      title: approvalAction === 'approve' ? 'Problem Approved!' : 'Problem Rejected',
      description: `${selectedProblem.title} has been ${approvalAction === 'approve' ? 'approved' : 'rejected'}.`,
    });

    setShowApprovalDialog(false);
    setSelectedProblem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingProblems = problems.filter(p => p.status === 'pending');
  const reviewedProblems = problems.filter(p => p.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Approval Section */}
      <div>
        <h3 className="text-lg font-semibold text-ncc-navy mb-4">
          Pending Approval ({pendingProblems.length})
        </h3>
        <div className="space-y-4">
          {pendingProblems.map((problem) => (
            <Card key={problem.id} className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 mb-1">
                      {problem.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {problem.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {problem.location}
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {problem.postedBy}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {problem.postedAt}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className={getStatusColor(problem.status)}>
                    {problem.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprovalAction(problem, 'approve')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={() => handleApprovalAction(problem, 'reject')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reviewed Problems Section */}
      <div>
        <h3 className="text-lg font-semibold text-ncc-navy mb-4">
          Reviewed Problems ({reviewedProblems.length})
        </h3>
        <div className="space-y-4">
          {reviewedProblems.map((problem) => (
            <Card key={problem.id} className={`border-l-4 ${
              problem.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900 mb-1">
                      {problem.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {problem.postedBy}
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
            </Card>
          ))}
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Approve Problem' : 'Reject Problem'}
            </DialogTitle>
            <DialogDescription>
              {selectedProblem?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={
                approvalAction === 'approve' 
                  ? 'Add approval comments (optional)...' 
                  : 'Please provide reason for rejection...'
              }
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApproval}
              className={
                approvalAction === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {approvalAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ANOProblemsView;
