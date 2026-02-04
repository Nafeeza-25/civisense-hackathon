import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import type { ComplaintStatus } from '@/lib/types';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  areaFilter: string;
  onAreaChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isRefreshing: boolean;
}

const categories = [
  'All Categories',
  'Water Supply',
  'Road Maintenance',
  'Healthcare',
  'Housing',
  'Social Welfare',
  'Electricity',
  'Sanitation',
  'General'
];

const areas = [
  'All Areas',
  'Anna Nagar',
  'T. Nagar',
  'Mylapore',
  'Adyar',
  'Velachery',
  'Chromepet',
  'Tambaram',
  'Guindy',
  'Other'
];

const statuses: (ComplaintStatus | 'All Statuses')[] = [
  'All Statuses',
  'New',
  'Verified',
  'Scheme Linked',
  'Assigned',
  'Resolved',
  'Closed'
];

const Filters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  areaFilter,
  onAreaChange,
  statusFilter,
  onStatusChange,
  isRefreshing
}: FiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Refresh Indicator */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search complaints"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span className="hidden sm:inline">Auto-refresh</span>
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px]" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Area Filter */}
        <Select value={areaFilter} onValueChange={onAreaChange}>
          <SelectTrigger className="w-[140px]" aria-label="Filter by area">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {areas.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filters;
