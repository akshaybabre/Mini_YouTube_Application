import React from 'react';
import ytLogo from '../assets/yt.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen relative text-gray-900 flex flex-col overflow-hidden"
    >

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#d4fc79] -z-10"
      />



      <header className="w-full h-[60px] flex justify-between items-center px-4 md:px-8 bg-white/70 backdrop-blur-md shadow-md">
        <div className="flex items-center space-x-3">
          <img src={ytLogo} alt="YouTube" className="h-6" />
          <span className="font-extrabold text-xl">Mini-YouTube</span>
        </div>
        <div className="flex space-x-3">
          <Link to='/signup'>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-base font-semibold transition-transform duration-200 hover:scale-105 shadow-lg">
              Sign Up
            </button>
          </Link>
        </div>
      </header>


      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg"
        >
          Welcome to <span className="text-blue-700">Mini-YouTube</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg text-gray-700 mb-10 max-w-xl"
        >
          Explore, enjoy, and share your favorite content on a simple, sleek, and modern video platform.
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-6">
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
          >
            <Link to="/login">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-base font-semibold transition-transform duration-200 hover:scale-105 shadow-lg">
                User Login
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, type: 'spring' }}
          >
            <Link to="/admin">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-base font-semibold transition-transform duration-200 hover:scale-105 shadow-lg">
                Admin Login
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default LandingPage;