export type UserRole = 'seeker' | 'employer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  companyId?: string;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  postedAt: any;
  employerId: string;
  isActive: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Accepted' | 'Rejected';
  appliedAt: any;
  seekerName: string;
  seekerEmail: string;
}
