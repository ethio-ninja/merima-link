import { Search, MapPin, Building2, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: Props) {
  const categories = [
    { name: 'Hospitality', jobs: '240+', icon: Building2 },
    { name: 'Tech & IT', jobs: '150+', icon: TrendingUp },
    { name: 'Finance', jobs: '90+', icon: TrendingUp },
    { name: 'Real Estate', jobs: '300+', icon: Building2 },
  ];

  return (
    <div className="pt-12 pb-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-20">
        <motion.h1 
          className="text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Connect with <span className="text-brand-gold">Excellence.</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-500 font-light mb-12 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Bridge your career to the heart of the Middle East. Specialized for Dubai's dynamic and premium market.
        </motion.p>

        <motion.div 
          className="bg-white/5 p-2 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-2 backdrop-blur-md mb-20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex-grow flex items-center px-4 gap-3 md:border-r border-white/10 focus-within:bg-white/5 transition-colors">
            <Search className="w-5 h-5 text-brand-gold" />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              className="bg-transparent border-none focus:ring-0 text-white w-full py-4 outline-none placeholder:text-gray-600" 
            />
          </div>
          <div className="flex items-center px-4 gap-3 md:min-w-[240px] md:border-r border-white/10">
            <MapPin className="w-5 h-5 text-gray-500" />
            <select className="bg-transparent border-none focus:ring-0 text-gray-300 w-full cursor-pointer outline-none py-4">
              <option className="bg-dark-bg text-white">Dubai Marina</option>
              <option className="bg-dark-bg text-white">Downtown</option>
              <option className="bg-dark-bg text-white">Business Bay</option>
              <option className="bg-dark-bg text-white">JLT</option>
            </select>
          </div>
          <button 
            onClick={onLogin}
            className="btn-gold px-12 py-4 rounded-xl uppercase tracking-wider h-full"
          >
            Search
          </button>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-10 px-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Prime Sectors</h2>
          <button className="text-brand-gold text-sm font-bold uppercase tracking-widest hover:underline">Explore All &rarr;</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              className="glass-card p-8 group cursor-pointer transition-all border-white/5 hover:border-brand-gold/30"
              onClick={onLogin}
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 mb-6 group-hover:text-brand-gold transition-colors">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">{cat.name}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{cat.jobs} Openings</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Feature Callout */}
      <section className="glass-card p-12 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border-white/10">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 text-brand-gold font-bold tracking-[0.3em] uppercase text-[10px] mb-6">
            <Sparkles className="w-4 h-4" />
            AI Matched Discovery
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tighter">Your Career, <br/>Optimized by AI.</h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
            Our specialized Gemini AI analyzes Dubai's dynamic market trends to match your profile with elite vacancies. Get precision recommendations.
          </p>
          <button 
            onClick={onLogin}
            className="btn-gold px-10 py-4"
          >
            Get Discovery Profile
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]"></div>
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-40 h-40 border-2 border-brand-gold/20 rounded-3xl backdrop-blur-xl flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-brand-gold/40" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
