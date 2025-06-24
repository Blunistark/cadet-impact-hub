
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown } from "lucide-react";

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const AuthForm = ({ mode, onSubmit, onBack }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    unitCode: '',
    directorate: '',
    rank: '',
    institute: '',
    role: 'cadet'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const directorates = [
    'Army Wing', 'Naval Wing', 'Air Force Wing'
  ];

  const ranks = [
    'Cadet', 'Lance Corporal', 'Corporal', 'Sergeant', 
    'Company Sergeant Major', 'Regimental Sergeant Major',
    'Junior Under Officer', 'Senior Under Officer', 
    'Cadet Captain', 'Senior Cadet Captain'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ncc-navy to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-ncc-navy">
            {mode === 'login' ? 'Welcome Back, Cadet' : 'Join the Collective'}
          </CardTitle>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Sign in to continue your mission' 
              : 'Register to start making an impact'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitCode">Unit Code</Label>
                    <Input
                      id="unitCode"
                      type="text"
                      placeholder="e.g., 1DG"
                      value={formData.unitCode}
                      onChange={(e) => setFormData({...formData, unitCode: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="directorate">Directorate</Label>
                    <Select onValueChange={(value) => setFormData({...formData, directorate: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wing" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {directorates.map((dir) => (
                          <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rank">Rank</Label>
                  <Select onValueChange={(value) => setFormData({...formData, rank: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your rank" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {ranks.map((rank) => (
                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="institute">Institute</Label>
                  <Input
                    id="institute"
                    type="text"
                    placeholder="Your college/school name"
                    value={formData.institute}
                    onChange={(e) => setFormData({...formData, institute: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="cadet" onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="cadet">Cadet</SelectItem>
                      <SelectItem value="ano">ANO (Associate NCC Officer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-ncc-navy hover:bg-blue-800"
              >
                {mode === 'login' ? 'Sign In' : 'Register'}
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                className="w-full"
                onClick={onBack}
              >
                <ArrowDown className="w-4 h-4 mr-2 rotate-90" />
                Back to Welcome
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
