import { FormEvent, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { BriefcaseBusiness, CheckCircle2, MapPin, Phone, Wallet } from 'lucide-react';
import { db } from '../firebaseConfig';

type JobFormState = {
  title: string;
  location: string;
  salary: string;
  contactNumber: string;
};

const initialFormState: JobFormState = {
  title: '',
  location: '',
  salary: '',
  contactNumber: '',
};

export default function AdminDashboard() {
  const [formData, setFormData] = useState<JobFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'jobs'), {
        title: formData.title.trim(),
        location: formData.location.trim(),
        salary: Number(formData.salary),
        contactNumber: formData.contactNumber.trim(),
        createdAt: serverTimestamp(),
      });

      setFormData(initialFormState);
      setSuccessMessage('Success! The job has been posted.');
    } catch (error) {
      console.error('Failed to create job posting:', error);
      setErrorMessage('We could not post this job right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof JobFormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(216,180,90,0.18),_transparent_32%),linear-gradient(180deg,_#f7f2e8_0%,_#efe6d6_42%,_#e8dcc6_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(250,204,21,0.16),_transparent_36%,_rgba(255,255,255,0.06)_100%)]" />
            <div className="relative space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/20 bg-white/5 px-4 py-2 text-sm font-medium text-amber-100 backdrop-blur">
                <BriefcaseBusiness className="h-4 w-4" />
                Priority for Quality Hiring
              </div>

              <div className="max-w-xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/80">
                  Merima Link Admin
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Publish premium job opportunities with clarity and speed.
                </h1>
                <p className="text-base leading-7 text-slate-300 sm:text-lg">
                  Built for focused recruiting teams posting roles across Dubai, Abu Dhabi,
                  and the wider UAE with a polished workflow that feels dependable on every screen.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <MapPin className="mb-3 h-5 w-5 text-amber-200" />
                  <p className="text-sm font-semibold text-white">Regional Coverage</p>
                  <p className="mt-2 text-sm text-slate-300">Dubai, Abu Dhabi, Sharjah, and more.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <Wallet className="mb-3 h-5 w-5 text-amber-200" />
                  <p className="text-sm font-semibold text-white">Structured Pay</p>
                  <p className="mt-2 text-sm text-slate-300">Clear salary capture in AED for every role.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <Phone className="mb-3 h-5 w-5 text-amber-200" />
                  <p className="text-sm font-semibold text-white">Direct Contact</p>
                  <p className="mt-2 text-sm text-slate-300">Reliable recruiter reach-out details included.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_70px_rgba(148,163,184,0.22)] backdrop-blur sm:p-8">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                Post a Job
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Admin Dashboard
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Add a new role to Firestore with clean, structured details and a server timestamp.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800" htmlFor="job-title">
                  Job Title
                </label>
                <input
                  id="job-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  placeholder="Senior Sales Executive"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800" htmlFor="work-location">
                  Work Location
                </label>
                <input
                  id="work-location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(event) => updateField('location', event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                  placeholder="Dubai"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800" htmlFor="salary">
                    Salary (AED)
                  </label>
                  <input
                    id="salary"
                    type="number"
                    min="0"
                    required
                    value={formData.salary}
                    onChange={(event) => updateField('salary', event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                    placeholder="6500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800" htmlFor="contact-number">
                    Contact Number
                  </label>
                  <input
                    id="contact-number"
                    type="tel"
                    required
                    value={formData.contactNumber}
                    onChange={(event) => updateField('contactNumber', event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>

              {successMessage ? (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? 'Posting Job...' : 'Post Job'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
