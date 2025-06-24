
import { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import AuthForm from '@/components/AuthForm';
import HomeFeed from '@/components/HomeFeed';
import PostProblem from '@/components/PostProblem';
import Profile from '@/components/Profile';
import MapView from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';

type AppState = 'welcome' | 'login' | 'register' | 'home' | 'post' | 'profile' | 'map';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const { toast } = useToast();

  const handleLogin = () => {
    setCurrentState('login');
  };

  const handleRegister = () => {
    setCurrentState('register');
  };

  const handleAuthSubmit = (data: any) => {
    console.log('Auth data:', data);
    toast({
      title: currentState === 'login' ? 'Welcome back!' : 'Registration successful!',
      description: 'You are now part of UDAAN NCC.',
    });
    setCurrentState('home');
  };

  const handlePostProblem = () => {
    setCurrentState('post');
  };

  const handlePostSubmit = (problemData: any) => {
    console.log('Problem posted:', problemData);
    toast({
      title: 'Mission Created!',
      description: 'Your problem has been posted and a new mission is now active.',
    });
    setCurrentState('home');
  };

  const handleViewProblem = (problem: any) => {
    console.log('Viewing problem:', problem);
    toast({
      title: 'Joined Mission!',
      description: `You have joined the mission: ${problem.title}`,
    });
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
    } else {
      setCurrentState('home');
    }
  };

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
            onSubmit={handleAuthSubmit}
            onBack={handleBack}
          />
        );
      case 'register':
        return (
          <AuthForm 
            mode="register"
            onSubmit={handleAuthSubmit}
            onBack={handleBack}
          />
        );
      case 'home':
        return (
          <HomeFeed 
            onPostProblem={handlePostProblem}
            onViewProblem={handleViewProblem}
            onProfile={handleProfile}
            onMapView={handleMapView}
          />
        );
      case 'post':
        return (
          <PostProblem 
            onSubmit={handlePostSubmit}
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
