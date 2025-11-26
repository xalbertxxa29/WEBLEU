import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { auth } from './config/firebase';
import { useAuthStore } from './config/store';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TablaPage } from './pages/TablaPage';
import { NotificationCenter } from './components/NotificationCenter';
import logoImage from './assets/logo_liberman.png';

function App() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'tabla'>('dashboard');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary/90 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <NotificationCenter />
      {user ? (
        <>
          {currentPage === 'dashboard' ? (
            <DashboardPage userName={user.email || 'Usuario'} onNavigate={setCurrentPage} />
          ) : (
            <TablaPage userName={user.email || 'Usuario'} />
          )}
        </>
      ) : (
        <LoginPage logoUrl={logoImage} onLoginSuccess={() => {}} />
      )}
    </>
  );
}

export default App;
