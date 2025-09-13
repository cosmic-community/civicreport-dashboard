import type { Department } from '@/types';
import { Building2, Mail, Phone, Users, Tag } from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  staffCount: number;
}

export default function DepartmentCard({ department, staffCount }: DepartmentCardProps) {
  const categories = department.metadata?.handles_categories || [];

  return (
    <div className="dashboard-card hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Building2 className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {department.metadata?.name || department.title}
            </h3>
            {department.metadata?.department_head && (
              <p className="text-xs text-gray-500">
                Head: {department.metadata.department_head}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">{staffCount}</span>
        </div>
      </div>

      {department.metadata?.description && (
        <p className="text-sm text-gray-600 mb-4">
          {department.metadata.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        {department.metadata?.contact_email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{department.metadata.contact_email}</span>
          </div>
        )}
        {department.metadata?.contact_phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{department.metadata.contact_phone}</span>
          </div>
        )}
      </div>

      {categories.length > 0 && (
        <div>
          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
            <Tag className="h-3 w-3" />
            <span>Handles {categories.length} categories</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <span
                key={category.id}
                className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                <span className="mr-1">{category.metadata?.icon}</span>
                {category.metadata?.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}