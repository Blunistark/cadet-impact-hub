import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface AuthFormProps {
  mode: 'login' | 'register';
  onBack: () => void;
}

const AuthForm = ({ mode, onBack }: AuthFormProps) => {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'cadet' as 'cadet' | 'ano' | 'co',
    unitCode: '',
    directorate: '',
    wing: '',
    regimentalNumber: '',
    rank: '',
    institute: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully."
        });
      } else {
        await register(formData);
        toast({
          title: "Registration successful!",
          description: "Your account has been created successfully."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `${mode === 'login' ? 'Login' : 'Registration'} failed. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (mode === 'login') {
      return formData.email && formData.password;
    }
    
    // Registration validation based on role
    const baseValid = formData.email && formData.password && formData.fullName && 
                     formData.unitCode && formData.directorate && formData.wing && formData.role;
    
    if (formData.role === 'co') {
      return baseValid; // CO only needs basic fields + email + password
    } else if (formData.role === 'ano') {
      return baseValid && formData.regimentalNumber && formData.rank; // ANO needs regimental number, rank
    } else { // cadet
      return baseValid && formData.regimentalNumber && formData.rank && formData.institute; // Cadet needs all
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ncc-navy to-blue-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Welcome Back' : 'Join UDAAN NCC'}
            </CardTitle>
          </div>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Create your account to start making an impact'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Basic Info */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCode">Unit</Label>
                  <Input
                    id="unitCode"
                    placeholder="e.g., 1DG, 2TN"
                    value={formData.unitCode}
                    onChange={(e) => handleInputChange('unitCode', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="directorate">Directorate</Label>
                  <Select value={formData.directorate} onValueChange={(value) => handleInputChange('directorate', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your directorate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Andhra Pradesh & Telangana">Andhra Pradesh & Telangana</SelectItem>
                      <SelectItem value="Bihar & Jharkhand">Bihar & Jharkhand</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Gujarat, Dadra & Nagar Haveli, Daman & Diu">Gujarat, Dadra & Nagar Haveli, Daman & Diu</SelectItem>
                      <SelectItem value="Jammu, Kashmir & Ladakh">Jammu, Kashmir & Ladakh</SelectItem>
                      <SelectItem value="Karnataka & Goa">Karnataka & Goa</SelectItem>
                      <SelectItem value="Kerala & Lakshadweep">Kerala & Lakshadweep</SelectItem>
                      <SelectItem value="Madhya Pradesh & Chhattisgarh">Madhya Pradesh & Chhattisgarh</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="North Eastern Region">North Eastern Region</SelectItem>
                      <SelectItem value="Odisha">Odisha</SelectItem>
                      <SelectItem value="Punjab, Haryana, Himachal Pradesh & Chandigarh">Punjab, Haryana, Himachal Pradesh & Chandigarh</SelectItem>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="Tamil Nadu, Puducherry & Andaman & Nicobar">Tamil Nadu, Puducherry & Andaman & Nicobar</SelectItem>
                      <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                      <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="West Bengal & Sikkim">West Bengal & Sikkim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wing">Wing</Label>
                  <Select value={formData.wing} onValueChange={(value) => handleInputChange('wing', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your wing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Army">Army</SelectItem>
                      <SelectItem value="Navy">Navy</SelectItem>
                      <SelectItem value="Air Force">Air Force</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cadet">Cadet</SelectItem>
                      <SelectItem value="ano">Area NCC Officer (ANO)</SelectItem>
                      <SelectItem value="co">Commanding Officer (CO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Role-specific fields */}
                {(formData.role === 'cadet' || formData.role === 'ano') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="regimentalNumber">Regimental Number</Label>
                      <Input
                        id="regimentalNumber"
                        placeholder="e.g., 1 DG, 2 TN, 15 RR"
                        value={formData.regimentalNumber}
                        onChange={(e) => handleInputChange('regimentalNumber', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rank">Rank</Label>
                      <Input
                        id="rank"
                        placeholder={formData.role === 'cadet' ? "e.g., Cadet, Senior Under Officer" : "e.g., Captain, Major"}
                        value={formData.rank}
                        onChange={(e) => handleInputChange('rank', e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {/* Institute field only for cadets */}
                {formData.role === 'cadet' && (
                  <div className="space-y-2">
                    <Label htmlFor="institute">Institute/College</Label>
                    <Input
                      id="institute"
                      placeholder="e.g., Christ University"
                      value={formData.institute}
                      onChange={(e) => handleInputChange('institute', e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* Email and Password for all */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-ncc-navy hover:bg-blue-800"
              disabled={loading || !isFormValid()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  if (mode === 'login') {
                    onBack(); // Go back to welcome, then they can click register
                  } else {
                    onBack(); // Go back to welcome, then they can click login
                  }
                }}
                className="text-ncc-navy hover:underline font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;