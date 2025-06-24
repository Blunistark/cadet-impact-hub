
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const WelcomeScreen = ({ onLogin, onRegister }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ncc-navy via-blue-600 to-ncc-green flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-ncc-saffron rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="text-2xl font-bold text-ncc-navy">CC</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Cadet Collective
          </h1>
          <p className="text-blue-100 text-lg">
            Unite. Serve. Transform.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">
              Join your fellow NCC cadets in identifying local problems, 
              forming action groups, and making a real impact in your community.
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-ncc-saffron/20 text-ncc-navy">
                🚀 Missions
              </Badge>
              <Badge variant="secondary" className="bg-ncc-green/20 text-ncc-navy">
                🏆 Impact
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-ncc-navy">
                🤝 Unity
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={onLogin}
            className="w-full bg-white text-ncc-navy hover:bg-gray-50 font-semibold py-3 text-lg shadow-lg"
            size="lg"
          >
            Login to Continue
          </Button>
          
          <Button 
            onClick={onRegister}
            variant="outline"
            className="w-full border-white text-white hover:bg-white/10 font-semibold py-3 text-lg"
            size="lg"
          >
            New Cadet? Register
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-blue-200 text-sm">
            Empowering NCC cadets across India
          </p>
          <div className="flex justify-center items-center mt-2">
            <div className="w-2 h-2 bg-tricolor-saffron rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
            <div className="w-2 h-2 bg-tricolor-green rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
