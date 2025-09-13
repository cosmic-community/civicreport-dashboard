import { Suspense } from 'react';
import ReportTracker from '@/components/ReportTracker';

export default function TrackReportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Track Your Report</h1>
              <p className="text-gray-600 mt-2">
                Check the status of your submitted civic issue report
              </p>
            </div>

            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <ReportTracker />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}