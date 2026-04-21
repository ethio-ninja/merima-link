import { UserRole } from '../types';
import { User, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onSelect: (role: UserRole) => void;
}

export default function RoleSelector({ onSelect }: Props) {
  return (
    <div className="max-w-2xl mx-auto pt-20 pb-32 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-white mb-6 tracking-tighter">Your Dubai Journey Starts Here</h1>
        <p className="text-gray-500 mb-16 font-light">Select your unique path in the region's premier talent ecosystem.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <motion.div
            whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            className="glass-card p-10 cursor-pointer hover:border-brand-gold/40 transition-all group"
            onClick={() => onSelect('seeker')}
          >
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 mb-8 group-hover:bg-brand-gold group-hover:text-black transition-all">
              <User className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Discovery Profile</h3>
            <p className="text-gray-500 text-sm mb-8 font-light leading-relaxed">Build your professional identity and let Gemini AI match you with Dubai's elite vacancies.</p>
            <div className="flex items-center text-brand-gold font-bold text-xs uppercase tracking-widest">
              Initiate Seeker Path <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            className="glass-card p-10 cursor-pointer hover:border-brand-gold/40 transition-all group"
            onClick={() => onSelect('employer')}
          >
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 mb-8 group-hover:bg-brand-gold group-hover:text-black transition-all">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Talent Acquisition</h3>
            <p className="text-gray-500 text-sm mb-8 font-light leading-relaxed">Establish your corporate presence and source world-class talent for your Dubai operations.</p>
            <div className="flex items-center text-brand-gold font-bold text-xs uppercase tracking-widest">
              Initiate Employer Path <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
