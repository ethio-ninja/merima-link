/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logout } from './lib/firebase';
import { UserProfile, UserRole } from './types';
import Navbar from './components/Navbar';
import SeekerDashboard from './components/SeekerDashboard';
import EmployerDashboard from './components/EmployerDashboard';
import LandingPage from './components/LandingPage';
import RoleSelector from './components/RoleSelector';
import { Briefcase, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
          setShowRoleSelector(false);
        } else {
          setShowRoleSelector(true);
        }
      } else {
        setUser(null);
        setProfile(null);
        setShowRoleSelector(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSetRole = async (role: UserRole) => {
    if (!user) return;
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      role: role,
      skills: [],
      bio: ''
    };
    await setDoc(doc(db, 'users', user.uid), newProfile);
    setProfile(newProfile);
    setShowRoleSelector(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col font-sans">
      <Navbar user={user} profile={profile} onLogin={loginWithGoogle} onLogout={logout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {showRoleSelector && (
          <RoleSelector onSelect={handleSetRole} />
        )}
        
        {!showRoleSelector && !user && (
          <LandingPage onLogin={loginWithGoogle} />
        )}

        {!showRoleSelector && user && profile && (
          <>
            {profile.role === 'seeker' ? (
              <SeekerDashboard profile={profile} />
            ) : (
              <EmployerDashboard profile={profile} />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-white/10 mt-24 py-16 text-center bg-black/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center font-bold text-black text-sm">D</div>
              <span className="font-bold text-white tracking-widest text-sm uppercase">DUBAI JOB CONNECT</span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase max-w-md">Bridging Global Ambition with Middle Eastern Opportunity</p>
            <div className="h-px w-20 bg-brand-gold/20"></div>
            <p className="text-[10px] text-gray-600 font-medium tracking-wider">&copy; {new Date().getFullYear()} DUBAI GLOBAL EXCELLENCE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

