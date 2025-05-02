import React from 'react';

interface AuthToggleProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, setIsLogin }) => {
  return (
    <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
      <button
        type="button"
        className={`flex-1 text-sm py-2 rounded-md transition-all duration-300 ${
          isLogin
            ? 'bg-white text-blue-700 font-semibold shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setIsLogin(true)}
      >
        Sign In
      </button>
      <button
        type="button"
        className={`flex-1 text-sm py-2 rounded-md transition-all duration-300 ${
          !isLogin
            ? 'bg-white text-blue-700 font-semibold shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => setIsLogin(false)}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthToggle;  