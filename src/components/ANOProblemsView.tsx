
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, User, CheckCircle, XCircle } from "lucide-react";
import { Problem, useProblems } from "@/hooks/useProblems";
import { useToast } from "@/hooks/use-toast";

interface ANOProblemsViewProps {
  problems: Problem[];
  loading: boolean;
  showActions: boolean;
}

const ANOProblemsView = ({ problems, loading, showActions }: ANOProblemsViewProps) => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [feedback, setFeedback] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { updateProblemStatus } = useProblems();
  const { toast } = useToast();

  const handleAction = async (problemId: string, status: 'approved' | 'rejected') => {
    setActionLoading(true);
    
    try {
      const { error } = await updateProblemStatus(problemId, status, feedback);
      
      if (error) {
        toast({
          title: 'Error updating problem',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: `Problem ${status}`,
          description: `The problem has been ${status} successfully.`,
        });
        setSelectedProblem(null);
        setFeedback('');
      }
    } finally {
      setActionLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">Loading problems...</div>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No problems in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <Card key={problem.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {problem.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {problem.description}
                </p>
                
                <div className="flex flex-wrap items-center text-xs text-gray-500 gap-4 mb-2">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {problem.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatTimeAgo(problem.created_at)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {problem.profiles?.full_name || 'Unknown'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {problem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {problem.approval_feedback && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>Feedback:</strong> {problem.approval_feedback}
                  </div>
                )}
              </div>
              
              <Badge className={getStatusColor(problem.status)}>
                {problem.status}
              </Badge>
            </div>
          </CardHeader>
          
          {showActions && (
            <CardContent className="pt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedProblem(problem)}
                  >
                    Review Problem
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Review Problem</DialogTitle>
                  </DialogHeader>
                  
                  {selectedProblem && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">{selectedProblem.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{selectedProblem.description}</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="feedback">Feedback (Optional)</Label>
                        <Textarea
                          id="feedback"
                          placeholder="Add feedback for the cadet..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAction(selectedProblem.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={actionLoading}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleAction(selectedProblem.id, 'rejected')}
                          variant="destructive"
                          className="flex-1"
                          disabled={actionLoading}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ANOProblemsView;
