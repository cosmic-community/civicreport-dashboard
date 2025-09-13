import ReportSubmissionForm from '@/components/ReportSubmissionForm';
import { getReportCategories } from '@/lib/cosmic';

export default async function SubmitReportPage() {
  const categories = await getReportCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Report a Civic Issue</h1>
              <p className="text-gray-600 mt-2">
                Help improve your community by reporting issues that need attention
              </p>
            </div>

            <ReportSubmissionForm categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}