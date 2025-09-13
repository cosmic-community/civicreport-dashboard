// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
  status?: string;
  published_at?: string;
  thumbnail?: string;
}

// Citizen Reporter type
export interface CitizenReporter extends CosmicObject {
  type: 'citizen-reporters';
  metadata: {
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    verified_email?: boolean;
    registration_date?: string;
  };
}

// Issue Report type (updated to include citizen reporter)
export interface IssueReport extends CosmicObject {
  type: 'issue-reports';
  metadata: {
    description?: string;
    category?: ReportCategory;
    location_address?: string;
    gps_coordinates?: {
      lat: number;
      lng: number;
    };
    photo_evidence?: Array<{
      url: string;
      imgix_url: string;
    }>;
    priority?: {
      key: string;
      value: PriorityLevel;
    };
    status?: {
      key: string;
      value: ReportStatus;
    };
    assigned_department?: Department;
    assigned_staff?: StaffMember;
    reporter_name?: string;
    reporter_contact?: string;
    citizen_reporter?: CitizenReporter; // New field for registered citizens
    resolution_notes?: string;
    reported_date?: string;
    resolution_date?: string | null;
    public_id?: string; // For citizens to track their reports
  };
}

// Department type
export interface Department extends CosmicObject {
  type: 'departments';
  metadata: {
    name?: string;
    description?: string;
    contact_email?: string;
    contact_phone?: string;
    department_head?: string;
    handles_categories?: ReportCategory[];
  };
}

// Staff Member type
export interface StaffMember extends CosmicObject {
  type: 'staff-members';
  metadata: {
    full_name?: string;
    role?: string;
    department?: Department | string;
    email?: string;
    phone?: string;
    employee_id?: string;
    active?: boolean;
  };
}

// Report Category type
export interface ReportCategory extends CosmicObject {
  type: 'report-categories';
  metadata: {
    name?: string;
    description?: string;
    icon?: string;
    default_priority?: {
      key: string;
      value: PriorityLevel;
    };
    response_time_target?: number;
  };
}

// Type literals for select-dropdown values
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ReportStatus = 'New' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Closed';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip?: number;
}

// Form data types
export interface ReportSubmissionData {
  title: string;
  description: string;
  category_id: string;
  location_address: string;
  gps_coordinates?: {
    lat: number;
    lng: number;
  };
  reporter_name: string;
  reporter_email: string;
  reporter_phone?: string;
  photo_evidence?: File[];
}

// Type guards
export function isIssueReport(obj: CosmicObject): obj is IssueReport {
  return obj.type === 'issue-reports';
}

export function isDepartment(obj: CosmicObject): obj is Department {
  return obj.type === 'departments';
}

export function isStaffMember(obj: CosmicObject): obj is StaffMember {
  return obj.type === 'staff-members';
}

export function isReportCategory(obj: CosmicObject): obj is ReportCategory {
  return obj.type === 'report-categories';
}

export function isCitizenReporter(obj: CosmicObject): obj is CitizenReporter {
  return obj.type === 'citizen-reporters';
}

// Error helper for Cosmic SDK
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}