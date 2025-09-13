import { getIssueReports, getDepartments, getReportCategories } from '@/lib/cosmic';
import ReportsTable from '@/components/ReportsTable';
import ReportsFilter from '@/components/ReportsFilter';

export default async function ReportsPage() {
  const [reports, departments, categories] = await Promise.all([
    getIssueReports(),
    getDepartments(),
    getReportCategories(),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issue Reports</h1>
        <p className="text-gray-600 mt-2">View and manage all civic issue reports</p>
      </div>

      <ReportsFilter 
        departments={departments}
        categories={categories}
      />

      <ReportsTable 
        reports={reports}
        departments={departments}
        categories={categories}
      />
    </div>
  );
}