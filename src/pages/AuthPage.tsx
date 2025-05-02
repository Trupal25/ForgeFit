import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import AuthToggle from '../components/auth/AuthToggle';
import { Dumbbell } from 'lucide-react';
import Image from 'next/image';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image and branding for desktop */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-600 flex-col justify-center items-center p-8 text-white">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell size={42} className="mr-2" />
            <h1 className="text-3xl font-bold">ForgeFit</h1>
          </div>
          <h2 className="text-2xl font-bold mb-4">Transform Your Fitness Journey</h2>
          <p className="mb-8 text-blue-100">
          Your fitness companion. Track workouts, set goals, and see progress—powered by you.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-800/50 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Personalized Workouts</h3>
              <p className="text-sm text-blue-100">Custom training plans tailored to your goals</p>
            </div>
            <div className="bg-blue-800/50 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Meal Planning</h3>
              <p className="text-sm text-blue-100">Healthy meals, simplified. Plan, track, and stay on target with your nutrition.</p>
            </div>
            <div className="bg-blue-800/50 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-blue-100">Monitor your improvements over time</p>
            </div>
            <div className="bg-blue-800/50 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Community Support</h3>
              <p className="text-sm text-blue-100">Join challenges and stay motivated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Mobile header */}
        <div className="md:hidden bg-blue-700 p-4 text-white flex items-center justify-center">
          <Dumbbell size={24} className="mr-2" />
          <h1 className="text-xl font-bold">ForgeFit</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isLogin ? 'Welcome Back' : 'Join FitPeak'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isLogin
                    ? 'Sign in to continue your fitness journey'
                    : 'Create an account to start your fitness journey'}
                </p>
              </div>

              <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />

              {isLogin ? <LoginForm /> : <SignupForm />}
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;