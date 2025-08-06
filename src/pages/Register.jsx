import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaBrain } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthProvider';
import { motion } from 'framer-motion';

const Register = () => {
  const { register: registerUser, googleSignIn, loading, setLoading } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setRegisterError('');
    const { name, email, password } = data;
    const photoURL = `https://api.dicebear.com/7.x/thumbs/svg?seed=${name}`;

    try {
      const result = await registerUser(name, email, photoURL, password);

      const maxWaitTime = 5000;
      const startTime = Date.now();

      const waitForToken = setInterval(() => {
        const token = localStorage.getItem('access-token');
        if (token) {
          clearInterval(waitForToken);
          toast.success(`Welcome, ${name}! Your sanctuary awaits.`);
          navigate('/');
        } else if (Date.now() - startTime > maxWaitTime) {
          clearInterval(waitForToken);
          setRegisterError('Registration succeeded but token not received. Please refresh.');
        }
      }, 300);
    } catch (err) {
      console.error(err);
      setRegisterError(err.message || 'Something went wrong during registration.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setRegisterError('');
    googleSignIn()
      .then((result) => {
        toast.success(`Signed in as ${result.user.displayName || 'Seeker'}!`);
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        setRegisterError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex flex-col lg:flex-row items-center justify-center px-6 py-12 gap-8 relative overflow-hidden">

      {/* Left: Register Form */}
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8 z-10">
        <h2 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Create Your Sanctuary
        </h2>
        <p className="text-center text-base-content/70 mb-6">
          Begin your mindful journey with us. Thought, growth, clarity — all within reach.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label font-medium">Your Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className={`input input-bordered w-full rounded-xl ${errors.name ? 'input-error' : ''}`}
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label font-medium">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className={`input input-bordered w-full rounded-xl ${errors.email ? 'input-error' : ''}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label font-medium">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              className={`input input-bordered w-full rounded-xl ${errors.password ? 'input-error' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' },
              })}
            />
            {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-type password"
              className={`input input-bordered w-full rounded-xl ${errors.confirmPassword ? 'input-error' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p className="text-error text-sm">{errors.confirmPassword.message}</p>}
          </div>

          {/* Error message */}
          {registerError && <p className="text-error text-center">{registerError}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="btn w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full mt-4"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Register'}
          </button>

          <div className="divider text-sm text-base-content/60">or continue with</div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full rounded-full flex gap-2 items-center justify-center"
            disabled={loading}
          >
            <FaGoogle />
            Sign in with Google
          </button>

          {/* Link to login */}
          <p className="mt-4 text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>

      {/* Right: Visual Aesthetic */}
      <div className="hidden lg:flex flex-col items-center justify-center relative w-full max-w-xl z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-br from-primary to-accent opacity-30 blur-2xl rounded-[35%_65%_70%_30%_/_30%_30%_70%_70%]"
        ></motion.div>

        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 20, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-tr from-secondary via-primary to-accent opacity-30 blur-2xl rounded-[45%_55%_65%_35%_/_40%_30%_70%_60%]"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative text-center px-6 z-10"
        >
          <FaBrain className="text-6xl text-secondary mb-4" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Begin the Inner Journey
          </h2>
          <p className="mt-3 text-base-content/70 max-w-sm mx-auto">
            Whether you're a thinker, creator, or explorer of truth — this is your digital awakening.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
