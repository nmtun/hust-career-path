export type DayOfWeek = 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7' | 'Chủ Nhật';
export type TimeOfDay = 'Sáng' | 'Chiều' | 'Tối' | 'Đêm';
export type TimeSlot = `${TimeOfDay} ${DayOfWeek}`;

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
