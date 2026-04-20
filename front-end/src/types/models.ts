export type TimeSlot =
  | 'Sang Thu 2'
  | 'Chieu Thu 2'
  | 'Sang Thu 3'
  | 'Chieu Thu 3'
  | 'Sang Thu 4'
  | 'Chieu Thu 4'
  | 'Sang Thu 5'
  | 'Chieu Thu 5'
  | 'Sang Thu 6'
  | 'Chieu Thu 6'
  | 'Sang Thu 7'
  | 'Chieu Thu 7';

export interface CompanyInfo {
  name: string;
  logo: string;
  industry: string;
  companySize: string;
  address: string;
  website: string;
  isVerified: boolean;
  verifiedAt: string;
  verifiedBy: string;
}

export interface JobReview {
  id: string;
  userName: string;
  major: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  postedDate: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  hiringSteps: string[];
  applicationDeadline: string;
  skills: string[];
  workSlots: TimeSlot[];
  distanceKm: number;
  companyInfo: CompanyInfo;
  reviews: JobReview[];
  isHot?: boolean;
}

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogoInitials: string;
  applyDate: string;
  status: 'Pending' | 'Accepted' | 'Applied';
}

export interface StudentPreference {
  homeAddress: string;
  maxDistanceKm: number;
  classSchedule: TimeSlot[];
  freeTime: TimeSlot[];
}
