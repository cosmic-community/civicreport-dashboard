import { getIssueReports, getDepartments, getStaffMembers, getReportCategories } from '@/lib/cosmic';
import DashboardStats from '@/components/DashboardStats';
import RecentReports from '@/components/RecentReports';
import DepartmentOverview from '@/components/DepartmentOverview';
import PriorityChart from '@/components/PriorityChart';

export default async function HomePage() {
  const [reports, departments, staff, categories] = await Promise.all([
    getIssueReports(),
    getDepartments(),
    getStaffMembers(),
    getReportCategories(),
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor and manage civic issue reports</p>
      </div>

      <DashboardStats 
        reports={reports}
        departments={departments}
        staff={staff}
        categories={categories}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentReports reports={reports} />
        </div>
        <div className="space-y-6">
          <PriorityChart reports={reports} />
          <DepartmentOverview departments={departments} reports={reports} />
        </div>
      </div>
    </div>
  );
}