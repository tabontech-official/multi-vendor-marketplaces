import React, { useState } from 'react';

import SignupForm from './pages/SignUp';
import LoginForm from "./pages/Login"
import { useAuthContext } from './Hooks/useAuthContext';
import Dashboard from './pages/Dashboard';

const Home = () => {
  const [activeTab, setActiveTab] = useState('login');
const {user } = useAuthContext()
  return !user ?(

    <section className="bg-white dark:bg-gray-900  border-blue-500">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <div className="w-full max-w-md">
          <div className="flex justify-center mx-auto">
            <img
              className="w-auto h-7 sm:h-8"
              src="https://shopify-digital-delivery.s3.amazonaws.com/shop_logo/59235/vRlqYxKteX848.png"
              alt="Logo"
            />
          </div>

          <div className="flex items-center justify-center mt-6">
            <button
              type="button" // Prevents form submission
              onClick={() => setActiveTab('login')}
              className={`w-1/2 pb-4 font-medium text-center capitalize border-b ${
                activeTab === 'login'
                  ? 'text-gray-800 border-blue-500 dark:border-blue-400 dark:text-white'
                  : 'text-gray-500 border-b dark:border-gray-400 dark:text-gray-300'
              }`}
            >
              Login
            </button>

            <button
              type="button" // Prevents form submission
              onClick={() => setActiveTab('signup')}
              className={`w-1/2 pb-4 font-medium text-center capitalize border-b ${
                activeTab === 'signup'
                  ? 'text-gray-800 border-blue-500 dark:border-blue-400 dark:text-white'
                  : 'text-gray-500 border-b dark:border-gray-400 dark:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-8">
            {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
      </div>
    </section>
  ): <Dashboard/>
};

export default Home;
