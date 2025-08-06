import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { FaGoogle, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthProvider';

const Login = () => {
  const { login, googleSignIn, loading, setLoading, resetPassword } = useContext(AuthContext);
  const [loginError, setLoginError] = useState('');
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    setLoginError('');
    try {
      const result = await login(data.email, data.password);

      const maxWaitTime = 5000;
      const startTime = Date.now();

      const waitForToken = setInterval(() => {
        const token = localStorage.getItem('access-token');
        if (token) {
          clearInterval(waitForToken);
          toast.success(`Welcome back, ${result.user.displayName || 'Seeker'}!`);
          navigate(from, { replace: true });
        } else if (Date.now() - startTime > maxWaitTime) {
          clearInterval(waitForToken);
          setLoginError('Login succeeded but token not received. Please refresh.');
        }
      }, 300);
    } catch (err) {
      console.error(err);
      setLoginError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoginError('');
    googleSignIn()
      .then((result) => {
        toast.success(`Signed in as ${result.user.displayName || 'Seeker'}!`);
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setLoginError(err.message);
        setLoading(false);
      });
  };

  const handleForgetPassword = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error("Please enter your email first.");
      return;
    }
    try {
      await resetPassword(email);
      toast.success(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-100 flex flex-col lg:flex-row items-center justify-center px-6 py-12 gap-8 relative overflow-hidden">

      {/* Left: Login Form */}
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8 z-10">
        <h2 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Login to Your Sanctuary
        </h2>
        <p className="text-center text-base-content/70 mb-6">
          Access your dashboard and reconnect with the deeper self.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div>
            <label className="label font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input input-bordered w-full rounded-xl ${errors.password ? 'input-error' : ''}`}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}

            <p className="text-sm text-right mt-1">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={handleForgetPassword}
              >
                Forgot Password?
              </button>
            </p>
          </div>

          {loginError && <p className="text-error text-center text-sm">{loginError}</p>}

          <button
            type="submit"
            className="btn w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full mt-4"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Login'}
          </button>

          <div className="divider text-sm text-base-content/60">or continue with</div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full rounded-full flex gap-2 items-center justify-center"
            disabled={loading}
          >
            <FaGoogle />
            Continue with Google
          </button>

          <p className="mt-4 text-sm text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>

      {/* Right: Visual and Branding */}
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
          <FaBrain className="text-6xl text-primary mb-4" /> 
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back, Seeker
          </h2>
          <p className="mt-3 text-base-content/70 max-w-sm mx-auto">
            Continue your journey into the depths of thought, self-mastery, and philosophical clarity.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
