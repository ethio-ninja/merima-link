import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job, UserProfile, Application } from '../types';
import { MapPin, Clock, DollarSign, Building2, Briefcase, Sparkles, Send, CheckCircle2, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getJobMatchAdvice } from '../lib/gemini';

interface Props {
  profile: UserProfile;
}

export default function SeekerDashboard({ profile }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [tab, setTab] = useState<'jobs' | 'applications'>('jobs');

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'jobs'), where('isActive', '==', true), orderBy('postedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const q = query(
        collection(db, 'applications'), 
        where('seekerId', '==', profile.uid),
        orderBy('appliedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const appsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      setApplications(appsList);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleSelectJob = async (job: Job) => {
    setSelectedJob(job);
    setAiAdvice(null);
    setAdviceLoading(true);
    const advice = await getJobMatchAdvice(profile.skills || [], job.description, job.title);
    setAiAdvice(advice);
    setAdviceLoading(false);
  };

  const handleApply = async (job: Job) => {
    setApplying(true);
    try {
      const appData = {
        jobId: job.id,
        seekerId: profile.uid,
        status: 'Pending',
        appliedAt: new Date(),
        seekerName: profile.displayName || '',
        seekerEmail: profile.email || ''
      };
      await addDoc(collection(db, 'applications'), appData);
      setSelectedJob(null);
      fetchApplications();
    } catch (error) {
      console.error("Apply failed:", error);
      alert("Failed to submit application. Please check job status.");
    } finally {
      setApplying(false);
    }
  };

  const hasApplied = (jobId: string) => applications.some(app => app.jobId === jobId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-slate-500">Discovering opportunities in Dubai...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-8 mb-10 border-b border-white/10">
        <button 
          onClick={() => setTab('jobs')}
          className={`pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all px-2 relative ${tab === 'jobs' ? 'text-brand-gold' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Explore Listings
          {tab === 'jobs' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-t-full" />}
        </button>
        <button 
          onClick={() => setTab('applications')}
          className={`pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all px-2 relative ${tab === 'applications' ? 'text-brand-gold' : 'text-gray-500 hover:text-gray-300'}`}
        >
          My Applications
          {tab === 'applications' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-t-full" />}
        </button>
      </div>

      {tab === 'jobs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {jobs.length === 0 ? (
              <div className="glass-card p-12 text-center text-gray-500 italic border-dashed">
                No active elite opportunities found.
              </div>
            ) : (
              jobs.map(job => (
                <motion.div 
                  key={job.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSelectJob(job)}
                  className={`p-8 glass-card cursor-pointer transition-all ${
                    selectedJob?.id === job.id ? 'bg-white/10 border-brand-gold/40' : 'hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-brand-gold/60" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{job.title}</h3>
                  <p className="text-brand-gold text-sm font-medium mb-6">{job.companyName}</p>
                  <div className="flex flex-wrap gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                      {job.location}
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
                        {job.salaryRange}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="lg:block">
            <AnimatePresence mode="wait">
              {selectedJob ? (
                <motion.div 
                  key={selectedJob.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="glass-card p-10 sticky top-24 shadow-2xl border-white/10"
                >
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter">{selectedJob.title}</h2>
                      <p className="text-brand-gold font-bold uppercase tracking-widest text-xs">{selectedJob.companyName}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedJob(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* AI Advice Card */}
                  <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-10 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-5 h-5 text-brand-gold" />
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase text-brand-gold">AI Precision Match</span>
                    </div>
                    
                    {adviceLoading ? (
                      <div className="flex items-center gap-3 py-4 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest">Generating Match Score...</span>
                      </div>
                    ) : aiAdvice ? (
                      <div>
                        <div className="flex items-end gap-3 mb-6">
                          <span className="text-5xl font-black text-white">{aiAdvice.matchPercentage}%</span>
                          <span className="text-gray-600 mb-2 text-[10px] font-bold uppercase tracking-widest">Compatibility</span>
                        </div>
                        <p className="text-gray-400 text-sm italic mb-8 leading-relaxed font-light border-l-2 border-brand-gold/30 pl-4">
                          "{aiAdvice.advice}"
                        </p>
                        {aiAdvice.dubaiContext && (
                          <div className="bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/10">
                            <p className="text-[10px] text-brand-gold font-black mb-2 uppercase tracking-widest">Dubai Strategic Tip</p>
                            <p className="text-xs text-gray-400 leading-relaxed">{aiAdvice.dubaiContext}</p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-8 mb-12">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 px-1">Job Brief</h4>
                      <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap font-light">
                        {selectedJob.description}
                      </div>
                    </div>
                    {selectedJob.requirements && (
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 px-1">Core Requirements</h4>
                        <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap font-light">
                          {selectedJob.requirements}
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    disabled={applying || hasApplied(selectedJob.id)}
                    onClick={() => handleApply(selectedJob)}
                    className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all tracking-widest uppercase text-xs ${
                      hasApplied(selectedJob.id) 
                      ? 'bg-white/5 text-green-500 border border-green-500/20 cursor-default' 
                      : 'btn-gold'
                    }`}
                  >
                    {hasApplied(selectedJob.id) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Application Transmitted
                      </>
                    ) : applying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Express Interest
                      </>
                    )}
                  </button>
                </motion.div>
              ) : (
                <div className="hidden lg:flex flex-col items-center justify-center h-[600px] glass-card border-dashed border-white/5 text-gray-600 p-12 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <Briefcase className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest italic">Selective Insight</p>
                  <p className="mt-2 text-xs font-light">Select an opportunity to initiate Gemini AI matching.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Position</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Organization</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Date Applied</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-600 italic font-light">
                      No active applications found in your history.
                    </td>
                  </tr>
                ) : (
                  applications.map(app => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6 font-bold text-white tracking-tight">
                        {jobs.find(j => j.id === app.jobId)?.title || 'Position Unavailable'}
                      </td>
                      <td className="px-8 py-6 text-gray-400 font-medium">
                        {jobs.find(j => j.id === app.jobId)?.companyName || 'Company'}
                      </td>
                      <td className="px-8 py-6 text-gray-500 text-xs">
                        {app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString('en-GB') : 'Recent'}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full uppercase tracking-tighter text-[9px] font-black border ${
                          app.status === 'Accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          app.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          app.status === 'Interviewing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-white/5 text-gray-500 border-white/10'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
