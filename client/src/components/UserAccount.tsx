import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  customMerchants: { [merchant: string]: string };
  customCards: any[];
  preferences: {
    defaultWalletCards: string[];
    favoriteMerchants: string[];
  };
}

interface UserAccountProps {
  onUserChange: (user: User | null) => void;
  currentUser: User | null;
}

const UserAccount: React.FC<UserAccountProps> = ({ onUserChange, currentUser }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      onUserChange(user);
      setIsLoggedIn(true);
    }
  }, [onUserChange]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple login logic - in real app, this would be API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === formData.email);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      onUserChange(user);
      setIsLoggedIn(true);
      setShowLoginForm(false);
      setFormData({ name: '', email: '', password: '' });
    } else {
      alert('User not found. Please sign up first.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      customMerchants: {},
      customCards: [],
      preferences: {
        defaultWalletCards: [],
        favoriteMerchants: []
      }
    };

    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Login the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    onUserChange(newUser);
    setIsLoggedIn(true);
    setShowSignupForm(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    onUserChange(null);
    setIsLoggedIn(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addCustomMerchant = (merchantName: string, category: string) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      customMerchants: {
        ...currentUser.customMerchants,
        [merchantName.toLowerCase().replace(/\s+/g, '_')]: category
      }
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    onUserChange(updatedUser);
  };

  if (isLoggedIn && currentUser) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Welcome, {currentUser.name}!
            </h3>
            <p className="text-sm text-blue-700">
              {Object.keys(currentUser.customMerchants).length} custom merchants
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Create Account for Personalized Experience
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Save custom merchants, track preferences, and sync across devices
        </p>
        
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setShowLoginForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => setShowSignupForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </div>
      </div>

      {showLoginForm && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-semibold mb-3">Login</h4>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded mb-3"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
                Login
              </button>
              <button
                type="button"
                onClick={() => setShowLoginForm(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showSignupForm && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-semibold mb-3">Sign Up</h4>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded mb-3"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded">
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setShowSignupForm(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
