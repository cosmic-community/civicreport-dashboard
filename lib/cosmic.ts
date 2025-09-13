import { createBucketClient } from '@cosmicjs/sdk';
import type { IssueReport, Department, StaffMember, ReportCategory, CitizenReporter, ReportSubmissionData } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Generate a public tracking ID for reports
function generatePublicId(): string {
  return 'CR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

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

// Fetch all citizen reporters
export async function getCitizenReporters(): Promise<CitizenReporter[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'citizen-reporters' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects as CitizenReporter[];
  } catch (error) {
    if ((error as any)?.status === 404) {
      return [];
    }
    console.error('Error fetching citizen reporters:', error);
    throw new Error('Failed to fetch citizen reporters');
  }
}

// Find or create a citizen reporter
export async function findOrCreateCitizenReporter(email: string, name: string, phone?: string): Promise<CitizenReporter> {
  try {
    // First, try to find existing citizen reporter by email
    const existingResponse = await cosmic.objects
      .find({ 
        type: 'citizen-reporters',
        'metadata.email': email 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    if (existingResponse.objects.length > 0) {
      return existingResponse.objects[0] as CitizenReporter;
    }

    // Create new citizen reporter if not found
    const newCitizen = await cosmic.objects.insertOne({
      title: name,
      type: 'citizen-reporters',
      metadata: {
        full_name: name,
        email: email,
        phone: phone || '',
        verified_email: false,
        registration_date: new Date().toISOString().split('T')[0]
      }
    });

    return newCitizen.object as CitizenReporter;
  } catch (error) {
    console.error('Error finding/creating citizen reporter:', error);
    throw new Error('Failed to process citizen reporter');
  }
}

// Submit a new report from a citizen
export async function submitCitizenReport(data: ReportSubmissionData): Promise<{ reportId: string; publicId: string }> {
  try {
    // Find or create citizen reporter
    const citizenReporter = await findOrCreateCitizenReporter(
      data.reporter_email, 
      data.reporter_name, 
      data.reporter_phone
    );

    // Get the category to determine default priority
    const category = await cosmic.objects.findOne({
      type: 'report-categories',
      id: data.category_id
    }).depth(1);

    const publicId = generatePublicId();
    
    // Create the issue report
    const report = await cosmic.objects.insertOne({
      title: data.title,
      type: 'issue-reports',
      metadata: {
        description: data.description,
        category: data.category_id,
        location_address: data.location_address,
        gps_coordinates: data.gps_coordinates,
        priority: category.object?.metadata?.default_priority || { key: 'medium', value: 'Medium' },
        status: { key: 'new', value: 'New' },
        reporter_name: data.reporter_name,
        reporter_contact: data.reporter_email,
        citizen_reporter: citizenReporter.id,
        reported_date: new Date().toISOString().split('T')[0],
        public_id: publicId
      }
    });

    return {
      reportId: report.object.id,
      publicId: publicId
    };
  } catch (error) {
    console.error('Error submitting citizen report:', error);
    throw new Error('Failed to submit report');
  }
}

// Get reports by citizen email
export async function getCitizenReports(email: string): Promise<IssueReport[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'issue-reports',
        'metadata.reporter_contact': email 
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(2);
    
    return response.objects as IssueReport[];
  } catch (error) {
    if ((error as any)?.status === 404) {
      return [];
    }
    console.error('Error fetching citizen reports:', error);
    throw new Error('Failed to fetch citizen reports');
  }
}

// Get report by public ID
export async function getReportByPublicId(publicId: string): Promise<IssueReport | null> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'issue-reports',
        'metadata.public_id': publicId 
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at', 'modified_at'])
      .depth(2);
    
    return response.objects.length > 0 ? response.objects[0] as IssueReport : null;
  } catch (error) {
    if ((error as any)?.status === 404) {
      return null;
    }
    console.error('Error fetching report by public ID:', error);
    throw new Error('Failed to fetch report');
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