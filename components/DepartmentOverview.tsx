import type { Department, IssueReport } from '@/types';
import { Building2, FileText } from 'lucide-react';

interface DepartmentOverviewProps {
  departments: Department[];
  reports: IssueReport[];
}

export default function DepartmentOverview({ departments, reports }: DepartmentOverviewProps) {
  const departmentStats = departments.map(dept => {
    const assignedReports = reports.filter(r => {
      const assignedDept = r.metadata?.assigned_department;
      if (!assignedDept) return false;
      return typeof assignedDept === 'string' ? assignedDept === dept.id : assignedDept.id === dept.id;
    });

    return {
      department: dept,
      reportCount: assignedReports.length,
      activeReports: assignedReports.filter(r => 
        r.metadata?.status?.value !== 'Resolved' && 
        r.metadata?.status?.value !== 'Closed'
      ).length,
    };
  }).sort((a, b) => b.reportCount - a.reportCount);

  return (
    <div className="dashboard-card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Workload</h2>
      
      {departmentStats.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No departments found</p>
      ) : (
        <div className="space-y-3">
          {departmentStats.map(stat => (
            <div key={stat.department.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {stat.department.metadata?.name || stat.department.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.activeReports} active
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">{stat.reportCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}