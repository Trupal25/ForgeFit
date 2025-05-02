import React, { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { score, label, color } = useMemo(() => {
    if (!password) {
      return { score: 0, label: 'Weak', color: 'bg-red-500' };
    }
    
    let strengthScore = 0;
    
    // Length check
    if (password.length >= 8) strengthScore += 1;
    if (password.length >= 12) strengthScore += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strengthScore += 1;
    if (/[a-z]/.test(password)) strengthScore += 1;
    if (/[0-9]/.test(password)) strengthScore += 1;
    if (/[^A-Za-z0-9]/.test(password)) strengthScore += 1;
    
    // Determine label and color based on score
    let strengthLabel;
    let strengthColor;
    
    if (strengthScore <= 2) {
      strengthLabel = 'Weak';
      strengthColor = 'bg-red-500';
    } else if (strengthScore <= 4) {
      strengthLabel = 'Moderate';
      strengthColor = 'bg-yellow-500';
    } else if (strengthScore <= 6) {
      strengthLabel = 'Strong';
      strengthColor = 'bg-green-500';
    } else {
      strengthLabel = 'Very Strong';
      strengthColor = 'bg-green-600';
    }
    
    // Normalize score to 0-100
    const normalizedScore = Math.min(Math.round((strengthScore / 8) * 100), 100);
    
    return {
      score: normalizedScore,
      label: strengthLabel,
      color: strengthColor,
    };
  }, [password]);

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs text-gray-600">Password strength</p>
        <p className="text-xs font-medium" style={{ color: color.replace('bg-', 'text-') }}>
          {label}
        </p>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Use 8+ characters with a mix of letters, numbers & symbols
      </p>
    </div>
  );
};

export default PasswordStrength;