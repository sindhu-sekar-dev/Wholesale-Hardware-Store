import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Key, Mail, Lock, Shield, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidShake, setInvalidShake] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setInvalidShake(false);
    
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back to HardwareHub!');
      navigate('/');
    } else {
      toast.error(result.error || 'Invalid credentials');
      // Trigger subtle shake animation
      setInvalidShake(true);
      setTimeout(() => setInvalidShake(false), 500);
    }
  };

  const handleQuickLogin = (role) => {
    const cred = DEMO_CREDENTIALS[role];
    if (cred) {
      setValue('email', cred.email);
      setValue('password', cred.password);
      toast.success(`Loaded credentials for ${cred.name} (${role})`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4 relative overflow-hidden">
      {/* Decorative clean background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-50/70 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-50/60 blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Logo / Header */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-200"
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">HardwareHub</h1>
          <p className="text-slate-500 text-xs mt-1">Wholesale Store Management System</p>
        </div>

        {/* Card */}
        <motion.div
          animate={invalidShake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-100 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">Please sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="name@store.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl outline-none transition-all duration-200
                    ${errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                    }`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl outline-none transition-all duration-200
                    ${errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                    }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Quick Demo logins */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h3 className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Quick Sign-in (Demo Accounts)
            </h3>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 rounded-xl transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-700">Administrator</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">admin@demo.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 rounded-xl transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="font-semibold text-slate-700">Manager</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">manager@demo.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 rounded-xl transition-all duration-200 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700">Staff</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">staff@demo.com</span>
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50/40 rounded-xl border border-blue-50 flex items-start gap-2">
              <UserCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-blue-800">Password for all roles:</p>
                <p className="text-[10px] text-blue-600 font-mono mt-0.5">Admin@123 | Manager@123 | Staff@123</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
