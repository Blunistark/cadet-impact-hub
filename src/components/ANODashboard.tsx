
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, AlertTriangle, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useProblems } from "@/hooks/useProblems";
import { useAuth } from "@/hooks/useAuth";
import ANOProblemsView from "./ANOProblemsView";

interface ANODashboardProps {
  onBack: () => void;
}

const ANODashboard = ({ onBack }: ANODashboardProps) => {
  const { problems, loading } = useProblems();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const pendingProblems = problems.filter(p => p.status === 'pending');
  const approvedProblems = problems.filter(p => p.status === 'approved');
  const rejectedProblems = problems.filter(p => p.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mr-3"
            >
              <ArrowDown className="w-4 h-4 rotate-90" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-ncc-navy">ANO Portal</h1>
              <p className="text-gray-600 text-sm">Manage and review cadet submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Welcome, {profile?.full_name}</span>
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

      <div className="p-4">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{problems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingProblems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedProblems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedProblems.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Problems Management */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="relative">
                  Pending Review
                  {pendingProblems.length > 0 && (
                    <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                      {pendingProblems.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                <ANOProblemsView 
                  problems={pendingProblems} 
                  loading={loading}
                  showActions={true}
                />
              </TabsContent>
              
              <TabsContent value="approved">
                <ANOProblemsView 
                  problems={approvedProblems} 
                  loading={loading}
                  showActions={false}
                />
              </TabsContent>
              
              <TabsContent value="rejected">
                <ANOProblemsView 
                  problems={rejectedProblems} 
                  loading={loading}
                  showActions={false}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ANODashboard;
