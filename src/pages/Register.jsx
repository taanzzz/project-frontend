import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaGoogle, FaBrain, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/AuthProvider";

const Register = () => {
  const {
    register: registerUser,
    googleSignIn,
    loading,
    setLoading,
    logout,
  } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const navigate = useNavigate();

  // Theme detection
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const onSubmit = async (data) => {
    setRegisterError("");
    const { name, email, password } = data;
    const photoURL = `https://api.dicebear.com/8.x/initials/svg?seed=${name}`;

    try {
      await registerUser(name, email, photoURL, password);
      toast.success(`Welcome, ${name}! A verification email has been sent.`);
      toast.info("Please check your inbox to verify your account before logging in.");
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMessage =
        err.code === "auth/email-already-in-use"
          ? "This email is already registered. Please login."
          : err.message || "Something went wrong during registration.";
      setRegisterError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setRegisterError("");
    googleSignIn()
      .then((result) => {
        toast.success(`Signed in as ${result.user.displayName || "Seeker"}!`);
        navigate("/");
      })
      .catch((err) => {
        console.error("Google Sign-In Error:", err);
        setRegisterError(err.message);
        setLoading(false);
      });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        type: 'spring', 
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      scale: [1, 1.05, 1],
      transition: { 
        duration: 6, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`,
        `0 0 40px ${isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(244, 114, 182, 0.5)'}`,
        `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`
      ],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const validatePasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-400' };
    if (strength <= 4) return { strength: 2, label: 'Medium', color: 'bg-yellow-400' };
    return { strength: 3, label: 'Strong', color: 'bg-green-400' };
  };

  const passwordStrength = validatePasswordStrength(password);

  return (
    <div className={`relative overflow-hidden min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950' 
        : 'bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50'
    } flex items-center justify-center p-4 sm:p-6 lg:p-8`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <motion.div
          className={`absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 ${
            isDark ? 'bg-indigo-500/10' : 'bg-pink-400/10'
          } rounded-full blur-2xl`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-10 right-10 w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 ${
            isDark ? 'bg-purple-500/10' : 'bg-rose-400/10'
          } rounded-3xl blur-3xl`}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className={`absolute top-1/2 left-1/4 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 ${
            isDark ? 'bg-cyan-500/10' : 'bg-orange-400/10'
          } rounded-2xl blur-2xl`}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-5 ${isDark ? 'bg-white' : 'bg-gray-900'}`} 
             style={{
               backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
               backgroundSize: '50px 50px'
             }} 
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Branding & Visual */}
          <motion.div
            className="order-2 lg:order-1 flex flex-col items-center justify-center text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Animated Brain Icon */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="relative"
            >
              <motion.div
                className={`p-8 rounded-3xl ${
                  isDark 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30' 
                    : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
                } backdrop-blur-md shadow-2xl`}
                variants={glowVariants}
                animate="animate"
              >
                <FaBrain className={`w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 ${
                  isDark ? 'text-indigo-300' : 'text-pink-600'
                }`} />
              </motion.div>
              
              {/* Floating Particles */}
              <motion.div
                className={`absolute -top-2 -right-2 w-4 h-4 ${
                  isDark ? 'bg-indigo-400' : 'bg-pink-500'
                } rounded-full`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className={`absolute -bottom-3 -left-3 w-3 h-3 ${
                  isDark ? 'bg-purple-400' : 'bg-rose-500'
                } rounded-full`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              />
            </motion.div>

            {/* Text Content */}
            <motion.div variants={itemVariants} className="max-w-md space-y-6">
              <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${
                isDark 
                  ? 'from-indigo-400 via-purple-400 to-pink-400' 
                  : 'from-pink-600 via-rose-600 to-orange-500'
              } leading-tight`}>
                Awaken Your Mind
              </h2>
              
              <p className={`text-lg lg:text-xl ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              } leading-relaxed`}>
                Join a community of thinkers, creators, and explorers on a path to truth and clarity
              </p>

              {/* Feature Pills */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3"
                variants={itemVariants}
              >
                {['Explore', 'Create', 'Connect', 'Discover'].map((feature, index) => (
                  <motion.span
                    key={feature}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      isDark 
                        ? 'bg-white/10 text-indigo-300 border border-indigo-400/30' 
                        : 'bg-white/80 text-pink-600 border border-pink-300/50'
                    } backdrop-blur-md`}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    {feature}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Animated Dots */}
            <motion.div 
              className="flex gap-3"
              variants={itemVariants}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    isDark ? 'bg-indigo-400' : 'bg-pink-500'
                  }`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Registration Form */}
          <motion.div
            className={`order-1 lg:order-2 w-full max-w-md mx-auto lg:max-w-none ${
              isDark 
                ? 'bg-white/5 border border-white/10 shadow-2xl shadow-indigo-500/10' 
                : 'bg-white/70 border border-pink-200/30 shadow-2xl shadow-pink-500/10'
            } backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12`}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Header */}
            <motion.div 
              className="text-center mb-8 lg:mb-10"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center justify-center mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`p-4 rounded-2xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30' 
                      : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
                  } backdrop-blur-md`}
                  variants={glowVariants}
                  animate="animate"
                >
                  <FaBrain className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    isDark ? 'text-indigo-300' : 'text-pink-600'
                  }`} />
                </motion.div>
              </motion.div>

              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r ${
                isDark 
                  ? 'from-indigo-400 via-purple-400 to-pink-400' 
                  : 'from-pink-600 via-rose-600 to-orange-500'
              } leading-tight`}>
                Create Your Account
              </h1>
              
              <p className={`text-sm sm:text-base lg:text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              } leading-relaxed max-w-sm mx-auto`}>
                Begin your journey of wisdom and self-discovery
              </p>
            </motion.div>

            {/* Form */}
            <motion.form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              variants={containerVariants}
            >
              {/* Name Field */}
              <motion.div variants={itemVariants} className="relative group">
                <div className="relative">
                  <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-pink-500'
                  } transition-colors duration-300 z-10`} />
                  
                  <motion.input
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-800/50 border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20' 
                        : 'bg-white/80 border-pink-200/50 text-gray-800 placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                    } backdrop-blur-md focus:outline-none focus:scale-[1.02] ${
                      errors.name ? 'border-red-400 shake' : ''
                    }`}
                    {...register('name', { required: 'Name is required' })}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                
                <AnimatePresence>
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants} className="relative group">
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-pink-500'
                  } transition-colors duration-300 z-10`} />
                  
                  <motion.input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-800/50 border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20' 
                        : 'bg-white/80 border-pink-200/50 text-gray-800 placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                    } backdrop-blur-md focus:outline-none focus:scale-[1.02] ${
                      errors.email ? 'border-red-400 shake' : ''
                    }`}
                    {...register('email', { required: 'Email is required' })}
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
                
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants} className="relative group">
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-pink-500'
                  } transition-colors duration-300 z-10`} />
                  
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`w-full pl-12 pr-12 py-3 sm:py-4 rounded-xl border transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-800/50 border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20' 
                        : 'bg-white/80 border-pink-200/50 text-gray-800 placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                    } backdrop-blur-md focus:outline-none focus:scale-[1.02] ${
                      errors.password ? 'border-red-400 shake' : ''
                    }`}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-pink-500'
                    } transition-colors duration-300`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </motion.button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Password Strength
                      </span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength === 1 ? 'text-red-400' :
                        passwordStrength.strength === 2 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <motion.div 
                        className={`h-full rounded-full ${passwordStrength.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
                
                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants} className="relative group">
                <div className="relative">
                  <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-pink-500'
                  } transition-colors duration-300 z-10`} />
                  
                  <motion.input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-3 sm:py-4 rounded-xl border transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-800/50 border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20' 
                        : 'bg-white/80 border-pink-200/50 text-gray-800 placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                    } backdrop-blur-md focus:outline-none focus:scale-[1.02] ${
                      errors.confirmPassword ? 'border-red-400 shake' : ''
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match'
                    })}
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-pink-500'
                    } transition-colors duration-300`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {registerError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className={`p-3 rounded-xl ${
                      isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
                    } backdrop-blur-md`}
                  >
                    <p className="text-red-400 text-xs sm:text-sm text-center flex items-center justify-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      {registerError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white relative overflow-hidden group transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40' 
                    : 'bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 hover:from-pink-500 hover:via-rose-500 hover:to-orange-500 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40'
                } disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 ${
                  isDark ? 'focus:ring-indigo-400/50' : 'focus:ring-pink-400/50'
                }`}
                variants={itemVariants}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FaBrain className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </span>
              </motion.button>

              {/* Divider */}
              <motion.div 
                variants={itemVariants}
                className="relative my-6"
              >
                <div className={`absolute inset-0 flex items-center`}>
                  <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className={`px-4 ${
                    isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'
                  } backdrop-blur-md`}>
                    or continue with
                  </span>
                </div>
              </motion.div>

              {/* Google Sign In */}
              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-3 sm:py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20' 
                    : 'bg-white/80 border border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
                } backdrop-blur-md disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 ${
                  isDark ? 'focus:ring-white/20' : 'focus:ring-gray-200'
                }`}
                variants={itemVariants}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <FaGoogle className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                Sign up with Google
              </motion.button>

              {/* Sign In Link */}
              <motion.p 
                variants={itemVariants}
                className={`text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className={`font-semibold ${
                    isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-600 hover:text-pink-500'
                  } hover:underline transition-colors duration-300`}
                >
                  Sign In
                </Link>
              </motion.p>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for shake animation */}
      <style jsx>{`
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default Register;