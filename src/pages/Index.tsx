
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeScreen from '@/components/WelcomeScreen';
import AuthForm from '@/components/AuthForm';
import HomeFeed from '@/components/HomeFeed';
import PostProblem from '@/components/PostProblem';
import Profile from '@/components/Profile';
import MapView from '@/components/MapView';
import ANODashboard from '@/components/ANODashboard';

type AppState = 'welcome' | 'login' | 'register' | 'home' | 'post' | 'profile' | 'map' | 'ano-dashboard';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        // Redirect authenticated users to appropriate dashboard
        setCurrentState(profile.role === 'ano' ? 'ano-dashboard' : 'home');
      } else {
        // Show welcome screen for unauthenticated users
        setCurrentState('welcome');
      }
    }
  }, [user, profile, loading]);

  const handleLogin = () => {
    setCurrentState('login');
  };

  const handleRegister = () => {
    setCurrentState('register');
  };

  const handlePostProblem = () => {
    setCurrentState('post');
  };

  const handleProfile = () => {
    setCurrentState('profile');
  };

  const handleMapView = () => {
    setCurrentState('map');
  };

  const handleBack = () => {
    if (currentState === 'login' || currentState === 'register') {
      setCurrentState('welcome');
    } else if (currentState === 'ano-dashboard') {
      setCurrentState('welcome');
    } else {
      setCurrentState(profile?.role === 'ano' ? 'ano-dashboard' : 'home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ncc-navy to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const renderCurrentScreen = () => {
    switch (currentState) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        );
      case 'login':
        return (
          <AuthForm 
            mode="login"
            onBack={handleBack}
          />
        );
      case 'register':
        return (
          <AuthForm 
            mode="register"
            onBack={handleBack}
          />
        );
      case 'ano-dashboard':
        return (
          <ANODashboard 
            onBack={handleBack}
          />
        );
      case 'home':
        return (
          <HomeFeed 
            onPostProblem={handlePostProblem}
            onProfile={handleProfile}
            onMapView={handleMapView}
          />
        );
      case 'post':
        return (
          <PostProblem 
            onBack={handleBack}
          />
        );
      case 'profile':
        return (
          <Profile 
            onBack={handleBack}
          />
        );
      case 'map':
        return (
          <MapView 
            onBack={handleBack}
          />
        );
      default:
        return (
          <WelcomeScreen 
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
