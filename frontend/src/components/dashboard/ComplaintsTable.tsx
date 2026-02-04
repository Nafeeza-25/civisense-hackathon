import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Complaint, ComplaintStatus } from '@/lib/types';
import { format } from 'date-fns';

interface ComplaintsTableProps {
  complaints: Complaint[];
  onStatusChange: (id: string, status: ComplaintStatus) => void;
}

type SortField = 'timestamp' | 'priority' | 'category' | 'area' | 'status';
type SortDirection = 'asc' | 'desc';

const statusOptions: ComplaintStatus[] = [
  'New',
  'Verified',
  'Scheme Linked',
  'Assigned',
  'Resolved',
  'Closed'
];

const priorityOrder = { high: 3, medium: 2, low: 1 };

const ComplaintsTable = ({ complaints, onStatusChange }: ComplaintsTableProps) => {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'timestamp':
        return multiplier * (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      case 'priority':
        return multiplier * (priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'category':
        return multiplier * a.category.localeCompare(b.category);
      case 'area':
        return multiplier * a.area.localeCompare(b.area);
      case 'status':
        return multiplier * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3" aria-hidden="true" />
    </Button>
  );

  const getPriorityBadge = (priority: Complaint['priority']) => {
    const styles = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge variant="outline" className={styles[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    const styles: Record<ComplaintStatus, string> = {
      'New': 'bg-blue-100 text-blue-800',
      'Verified': 'bg-purple-100 text-purple-800',
      'Scheme Linked': 'bg-indigo-100 text-indigo-800',
      'Assigned': 'bg-orange-100 text-orange-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={styles[status]}>
        {status}
      </Badge>
    );
  };

  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No complaints found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[30px]"></TableHead>
            <TableHead className="min-w-[200px]">Complaint</TableHead>
            <TableHead>
              <SortButton field="category">Category</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="priority">Priority</SortButton>
            </TableHead>
            <TableHead>Scheme</TableHead>
            <TableHead>
              <SortButton field="area">Area</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="timestamp">Time</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedComplaints.map((complaint) => {
            const isExpanded = expandedId === complaint.id;
            
            return (
              <>
                <TableRow 
                  key={complaint.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    isExpanded && "bg-muted/30"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : complaint.id)}
                >
                  <TableCell>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="max-w-[250px] truncate" title={complaint.description}>
                      {complaint.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ID: {complaint.id}
                    </div>
                  </TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                  <TableCell>
                    <span className="text-sm">{complaint.scheme}</span>
                  </TableCell>
                  <TableCell>{complaint.area}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={complaint.status}
                      onValueChange={(value: ComplaintStatus) => onStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status} className="text-xs">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(complaint.timestamp), 'MMM d, HH:mm')}
                  </TableCell>
                </TableRow>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <TableRow key={`${complaint.id}-details`} className="bg-muted/20">
                    <TableCell colSpan={8} className="p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Full Complaint</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {complaint.description}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-1">Contact Information</h4>
                            <p className="text-sm text-muted-foreground">
                              {complaint.contact.name} • {complaint.contact.phone}
                              {complaint.contact.email && ` • ${complaint.contact.email}`}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Vulnerability Flags</h4>
                            <div className="flex flex-wrap gap-2">
                              {complaint.vulnerability.seniorCitizen && (
                                <Badge variant="secondary">Senior Citizen</Badge>
                              )}
                              {complaint.vulnerability.lowIncome && (
                                <Badge variant="secondary">Low Income</Badge>
                              )}
                              {complaint.vulnerability.disability && (
                                <Badge variant="secondary">Disability</Badge>
                              )}
                              {!complaint.vulnerability.seniorCitizen && 
                               !complaint.vulnerability.lowIncome && 
                               !complaint.vulnerability.disability && (
                                <span className="text-sm text-muted-foreground">None reported</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Current Status</h4>
                            {getStatusBadge(complaint.status)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComplaintsTable;
