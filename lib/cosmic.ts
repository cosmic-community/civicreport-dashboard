import { createBucketClient } from '@cosmicjs/sdk';
import type { IssueReport, Department, StaffMember, ReportCategory, hasStatus } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Fetch all issue reports
export async function getIssueReports(): Promise<IssueReport[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'issue-reports' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(2);
    
    return response.objects as IssueReport[];
  } catch (error) {
    if ((error as any)?.status === 404) {
      return [];
    }
    console.error('Error fetching issue reports:', error);
    throw new Error('Failed to fetch issue reports');
  }
}

// Fetch all departments
export async function getDepartments(): Promise<Department[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'departments' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(2);
    
    return response.objects as Department[];
  } catch (error) {
    if ((error as any)?.status === 404) {
      return [];
    }
    console.error('Error fetching departments:', error);
    throw new Error('Failed to fetch departments');
  }
}

// Fetch all staff members
export async function getStaffMembers(): Promise<StaffMember[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'staff-members' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(2);
    
    return response.objects as StaffMember[];
  } catch (error) {
    if ((error as any)?.status === 404) {
      return [];
    }
    console.error('Error fetching staff members:', error);
    throw new Error('Failed to fetch staff members');
  }
}

// Fetch all report categories
export async function getReportCategories(): Promise<ReportCategory[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'report-categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as ReportCategory[];
  } catch (error) {
    if ((error as any)?.status === 404) {
      return [];
    }
    console.error('Error fetching report categories:', error);
    throw new Error('Failed to fetch report categories');
  }
}

// Update issue report status
export async function updateReportStatus(reportId: string, status: string): Promise<void> {
  try {
    await cosmic.objects.updateOne(reportId, {
      metadata: {
        status: {
          key: status.toLowerCase().replace(' ', '_'),
          value: status
        }
      }
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    throw new Error('Failed to update report status');
  }
}

// Assign staff to report
export async function assignStaffToReport(reportId: string, staffId: string): Promise<void> {
  try {
    await cosmic.objects.updateOne(reportId, {
      metadata: {
        assigned_staff: staffId
      }
    });
  } catch (error) {
    console.error('Error assigning staff:', error);
    throw new Error('Failed to assign staff to report');
  }
}

// Assign department to report
export async function assignDepartmentToReport(reportId: string, departmentId: string): Promise<void> {
  try {
    await cosmic.objects.updateOne(reportId, {
      metadata: {
        assigned_department: departmentId
      }
    });
  } catch (error) {
    console.error('Error assigning department:', error);
    throw new Error('Failed to assign department to report');
  }
}