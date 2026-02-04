import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Shield } from 'lucide-react';
import StatsCards from '@/components/dashboard/StatsCards';
import Filters from '@/components/dashboard/Filters';
import ComplaintsTable from '@/components/dashboard/ComplaintsTable';
import { api } from '@/services/api';
import type { Complaint, DashboardStats, ComplaintStatus } from '@/lib/types';

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, resolved: 0, highPriority: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Check authentication
  useEffect(() => {
    const token = sessionStorage.getItem('officerToken');
    if (!token) {
      navigate('/officer');
    }
  }, [navigate]);

  // Fetch data
  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    
    try {
      const data = await api.getDashboard();
      setComplaints(data.recent_high_priority || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle status change
  const handleStatusChange = async (id: string, status: ComplaintStatus) => {
    await api.updateStatus(Number(id), status);
    fetchData();
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('officerToken');
    navigate('/officer');
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All Categories' || complaint.category === categoryFilter;
    const matchesArea = areaFilter === 'All Areas' || complaint.area === areaFilter;
    const matchesStatus = statusFilter === 'All Statuses' || complaint.status === statusFilter;

    return matchesSearch && matchesCategory && matchesArea && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="font-semibold text-lg">Civisense Dashboard</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Complaints Section */}
        <Card>
          <CardHeader>
            <CardTitle>Complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <Filters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              areaFilter={areaFilter}
              onAreaChange={setAreaFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              isRefreshing={isRefreshing}
            />

            {/* Table */}
            <ComplaintsTable
              complaints={filteredComplaints}
              onStatusChange={handleStatusChange}
            />

            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              Showing {filteredComplaints.length} of {complaints.length} complaints
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OfficerDashboard;
