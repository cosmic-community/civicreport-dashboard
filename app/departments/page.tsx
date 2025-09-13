import { getDepartments, getStaffMembers, getReportCategories } from '@/lib/cosmic';
import DepartmentCard from '@/components/DepartmentCard';
import { Building2 } from 'lucide-react';

export default async function DepartmentsPage() {
  const [departments, staff, categories] = await Promise.all([
    getDepartments(),
    getStaffMembers(),
    getReportCategories(),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <p className="text-gray-600 mt-2">Municipal departments and their responsibilities</p>
      </div>

      {departments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No departments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(department => {
            const deptStaff = staff.filter(s => {
              const deptId = typeof s.metadata?.department === 'string' 
                ? s.metadata.department 
                : s.metadata?.department?.id;
              return deptId === department.id;
            });

            return (
              <DepartmentCard 
                key={department.id}
                department={department}
                staffCount={deptStaff.length}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}