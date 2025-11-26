import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNotificationStore } from '../config/store';

interface LoginProps {
  logoUrl: string;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginProps> = ({ logoUrl, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addNotification('Por favor completa todos los campos', 'warning');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addNotification('¡Bienvenido! Iniciando sesión...', 'success');
      setTimeout(onLoginSuccess, 500);
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'Usuario no encontrado'
        : error.code === 'auth/wrong-password'
        ? 'Contraseña incorrecta'
        : 'Error al iniciar sesión';
      addNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo */}
          <motion.div
            className="mb-8 flex justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={logoUrl}
              alt="Logo"
              className="h-20 object-contain filter drop-shadow-lg"
            />
          </motion.div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
            <p className="text-white/60">Inicia sesión para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
            >
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all backdrop-blur-sm"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.02 }}
            >
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-white/40 hover:text-white/60 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-white/40 text-sm mt-6">
            ¿No tienes cuenta? Contacta al administrador
          </p>
        </div>
      </motion.div>
    </div>
  );
};
