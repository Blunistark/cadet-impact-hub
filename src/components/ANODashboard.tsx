
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, XCircle, Clock, Users, AlertTriangle } from "lucide-react";
import ANOProblemsView from "./ANOProblemsView";

interface ANODashboardProps {
  onBack: () => void;
}

const ANODashboard = ({ onBack }: ANODashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const dashboardStats = {
    totalProblems: 24,
    pendingApproval: 8,
    approved: 12,
    rejected: 4,
    activeCadets: 156,
    completedMissions: 8
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-ncc-navy">ANO Control Center</h1>
              <p className="text-gray-600 text-sm">Associate NCC Officer Portal</p>
            </div>
          </div>
          <Badge className="bg-ncc-saffron text-white">
            ANO Portal
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problem Approval</TabsTrigger>
            <TabsTrigger value="cadets">Cadet Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="w-8 h-8 text-ncc-saffron" />
                  </div>
                  <div className="text-2xl font-bold text-ncc-navy">{dashboardStats.pendingApproval}</div>
                  <div className="text-sm text-gray-600">Pending Approval</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-ncc-green" />
                  </div>
                  <div className="text-2xl font-bold text-ncc-navy">{dashboardStats.approved}</div>
                  <div className="text-sm text-gray-600">Approved</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-ncc-navy">{dashboardStats.activeCadets}</div>
                  <div className="text-sm text-gray-600">Active Cadets</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">New problem submitted</p>
                      <p className="text-sm text-gray-600">Street Light Repair - by Cadet Raj Kumar</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Mission completed</p>
                      <p className="text-sm text-gray-600">Community Garden Initiative</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="mt-6">
            <ANOProblemsView />
          </TabsContent>

          <TabsContent value="cadets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cadet Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Cadet management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ANODashboard;
