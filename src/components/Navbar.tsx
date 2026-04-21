import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { Briefcase, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  user: User | null;
  profile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, profile, onLogin, onLogout }: Props) {
  return (
    <nav className="bg-dark-bg border-b border-glass-border sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center font-bold text-black text-xl"
          >
            D
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">DUBAI JOBS</span>
            <span className="text-[10px] text-brand-gold tracking-[0.2em] uppercase">ዱባይ ስራዎች</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium text-white">{user.displayName}</span>
                <span className="text-[10px] text-brand-gold tracking-widest uppercase">{profile?.role}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-glass flex items-center justify-center border border-glass-border shadow-inner">
                <UserIcon className="w-5 h-5 text-brand-gold" />
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-white uppercase tracking-wider transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={onLogin}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onLogin}
                className="btn-gold"
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
