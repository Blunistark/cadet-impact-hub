
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeScreen from '@/components/WelcomeScreen';
import AuthForm from '@/components/AuthForm';
import HomeFeed from '@/components/HomeFeed';
import PostProblem from '@/components/PostProblem';
import Profile from '@/components/Profile';
import MapView from '@/components/MapView';
import ANODashboard from '@/components/ANODashboard';
import CODashboard from '@/components/CODashboard';

type AppState = 'welcome' | 'login' | 'register' | 'home' | 'post' | 'profile' | 'map' | 'ano-dashboard' | 'co-dashboard';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        // Redirect authenticated users to appropriate dashboard
        if (profile.role === 'ano') {
          setCurrentState('ano-dashboard');
        } else if (profile.role === 'co') {
          setCurrentState('co-dashboard');
        } else {
          setCurrentState('home');
        }
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
    } else if (currentState === 'ano-dashboard' || currentState === 'co-dashboard') {
      setCurrentState('welcome');
    } else {
      if (profile?.role === 'ano') {
        setCurrentState('ano-dashboard');
      } else if (profile?.role === 'co') {
        setCurrentState('co-dashboard');
      } else {
        setCurrentState('home');
      }
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
            onBack={() => setCurrentState('welcome')} 
            onPostProblem={() => setCurrentState('post')}
            onProfile={() => setCurrentState('profile')}
            onMapView={() => setCurrentState('map')}
          />
        );
      case 'co-dashboard':
        return <CODashboard onBack={() => setCurrentState('welcome')} />;
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
