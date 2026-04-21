import { useState, useEffect, FormEvent } from 'react';
import { collection, query, getDocs, addDoc, where, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job, UserProfile, Application } from '../types';
import { Plus, Users, Briefcase, MapPin, X, Loader2, CheckCircle2, ChevronRight, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  profile: UserProfile;
}

export default function EmployerDashboard({ profile }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [tab, setTab] = useState<'listings' | 'applications'>('listings');

  // Form State
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    companyName: 'My Dubai Business',
    location: 'Dubai Marina',
    description: '',
    requirements: '',
    salaryRange: '',
    type: 'Full-time',
    isActive: true
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'jobs'), where('employerId', '==', profile.uid), orderBy('postedAt', 'desc'));
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
      // In a real app, you'd index these. For now we list all for the employer's jobs
      const q = query(collection(db, 'applications'));
      const querySnapshot = await getDocs(q);
      const allApps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      
      // Filter manually for security/convenience in demo
      const myJobsIds = jobs.map(j => j.id);
      const myApps = allApps.filter(app => myJobsIds.includes(app.jobId));
      setApplications(myApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handlePostJob = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobData = {
        ...newJob,
        employerId: profile.uid,
        postedAt: new Date(),
        isActive: true
      };
      await addDoc(collection(db, 'jobs'), jobData);
      setShowJobModal(false);
      fetchJobs();
    } catch (error) {
      console.error("Post job failed:", error);
      alert("Failed to post job. Please ensure all required fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  const updateAppStatus = async (appId: string, status: Application['status']) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status });
      fetchApplications();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to remove this listing?")) return;
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      fetchJobs();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p>Loading your Dubai business dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tighter leading-none">Employer Command</h1>
          <p className="text-gray-500 font-light text-lg">Acquire elite talent from Dubai's global marketplace.</p>
        </div>
        <button 
          onClick={() => setShowJobModal(true)}
          className="btn-gold px-8 py-4 whitespace-nowrap self-start"
        >
          <Plus className="w-5 h-5 mr-1" />
          Acquire Talent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="glass-card p-8 border-white/10 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-gold border border-white/5">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Active Postings</span>
          </div>
          <div className="text-4xl font-black text-white">{jobs.length}</div>
        </div>
        <div className="glass-card p-8 border-white/10 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-gold border border-white/5">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Total Inquiries</span>
          </div>
          <div className="text-4xl font-black text-white">{applications.length}</div>
        </div>
        <div className="glass-card p-8 border-white/10 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-brand-gold border border-white/5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Successful Placements</span>
          </div>
          <div className="text-4xl font-black text-white">{applications.filter(a => a.status === 'Accepted').length}</div>
        </div>
      </div>

      <div className="flex items-center gap-8 mb-10 border-b border-white/10">
        <button 
          onClick={() => setTab('listings')}
          className={`pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all px-2 relative ${tab === 'listings' ? 'text-brand-gold' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Managed Postings
          {tab === 'listings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-t-full" />}
        </button>
        <button 
          onClick={() => setTab('applications')}
          className={`pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all px-2 relative ${tab === 'applications' ? 'text-brand-gold' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Talent Inquiries
          {tab === 'applications' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold rounded-t-full" />}
        </button>
      </div>

      {tab === 'listings' ? (
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="glass-card p-20 border-dashed text-center text-gray-600">
              <Briefcase className="w-16 h-16 mx-auto mb-6 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest mb-4 italic">No vacancies found</p>
              <button 
                onClick={() => setShowJobModal(true)}
                className="text-brand-gold font-bold hover:underline py-2"
              >
                Initiate Talent Source &rarr;
              </button>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="glass-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group hover:border-brand-gold/30 transition-all">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{job.title}</h3>
                  <div className="flex items-center gap-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-brand-gold">{job.type}</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                      {job.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Inquiries</p>
                    <p className="text-2xl font-black text-white">{applications.filter(a => a.jobId === job.id).length}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-3 text-gray-600 hover:text-red-500 transition-colors bg-white/5 rounded-xl border border-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Talent</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Position Target</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Current Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">Acquisition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-600 italic font-light">
                    No inquiries received for your listings.
                  </td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-white tracking-tight">{app.seekerName}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 italic">{app.seekerEmail}</div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-400 font-light">
                      {jobs.find(j => j.id === app.jobId)?.title}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                        app.status === 'Accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        app.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        app.status === 'Interviewing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-white/5 text-gray-500 border-white/10'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <select 
                        value={app.status}
                        onChange={(e) => updateAppStatus(app.id, e.target.value as any)}
                        className="text-[10px] font-black uppercase tracking-widest bg-dark-bg border border-white/10 rounded-lg py-2 pl-3 pr-10 focus:ring-1 ring-brand-gold outline-none appearance-none cursor-pointer text-gray-400 hover:text-white transition-colors"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Interviewing">Interview</option>
                        <option value="Accepted">Acquire</option>
                        <option value="Rejected">Dismiss</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-3xl border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h2 className="text-3xl font-bold text-white tracking-tighter leading-none">Global Talent Source</h2>
                <button onClick={() => setShowJobModal(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handlePostJob} className="p-10 space-y-8 bg-dark-bg/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] pl-1">Professional Title*</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-brand-gold focus:ring-1 ring-brand-gold/20 outline-none transition-all placeholder:text-gray-700 font-light" 
                      placeholder="e.g. Lead Brand Ambassador"
                      value={newJob.title}
                      onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] pl-1">Strategic Location*</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-brand-gold focus:ring-1 ring-brand-gold/20 outline-none transition-all placeholder:text-gray-700 font-light" 
                      placeholder="e.g. DIFC, Dubai"
                      value={newJob.location}
                      onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] pl-1">Contract Category*</label>
                    <select 
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-brand-gold focus:ring-1 ring-brand-gold/20 outline-none transition-all appearance-none cursor-pointer font-light"
                      value={newJob.type}
                      onChange={(e) => setNewJob({...newJob, type: e.target.value as any})}
                    >
                      <option className="bg-dark-bg" value="Full-time">Permanent / Full-time</option>
                      <option className="bg-dark-bg" value="Part-time">Part-time</option>
                      <option className="bg-dark-bg" value="Contract">Fixed-term Contract</option>
                      <option className="bg-dark-bg" value="Freelance">Expert / Freelance</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] pl-1">Compensation Range (Monthly)</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-brand-gold focus:ring-1 ring-brand-gold/20 outline-none transition-all placeholder:text-gray-700 font-light" 
                      placeholder="e.g. 25,000 - 30,000 AED"
                      value={newJob.salaryRange}
                      onChange={(e) => setNewJob({...newJob, salaryRange: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] pl-1">Operational Brief*</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-brand-gold focus:ring-1 ring-brand-gold/20 outline-none transition-all placeholder:text-gray-700 resize-none font-light leading-relaxed" 
                    placeholder="Provide a detailed roadmap of the role objectives..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] pl-1">Acquisition Criteria</label>
                  <textarea 
                    rows={2}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-brand-gold focus:ring-1 ring-brand-gold/20 outline-none transition-all placeholder:text-gray-700 resize-none font-light leading-relaxed" 
                    placeholder="Mandatory skillsets, residency status, and linguistic capabilities..."
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-brand-gold text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#D6B570] transition-all shadow-2xl shadow-brand-gold/20"
                >
                  Authorize Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
