import { NextRequest, NextResponse } from 'next/server';
import { submitCitizenReport } from '@/lib/cosmic';
import type { ReportSubmissionData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category_id', 'location_address', 'reporter_name', 'reporter_email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const submissionData: ReportSubmissionData = {
      title: body.title,
      description: body.description,
      category_id: body.category_id,
      location_address: body.location_address,
      reporter_name: body.reporter_name,
      reporter_email: body.reporter_email,
      reporter_phone: body.reporter_phone || '',
      gps_coordinates: body.gps_coordinates || undefined,
    };

    const result = await submitCitizenReport(submissionData);

    return NextResponse.json({
      success: true,
      reportId: result.reportId,
      publicId: result.publicId,
      message: 'Report submitted successfully'
    });
  } catch (error) {
    console.error('Error in submit-report API:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}