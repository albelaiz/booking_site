import { useState, useEffect } from 'react';
import { History, Search, Eye, Clock, User, Activity, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import AdminLayout from '../components/AdminLayout';
import { Button } from '../components/ui/button';
import { auditLogsApi, usersApi } from '../lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

interface AuditLogData {
  id: number;
  userId: number;
  action: string;
  entity: string;
  entityId?: number;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description?: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminAuditLogs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [auditLogs, setAuditLogs] = useState<AuditLogData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(50);

  // Load audit logs and users from API
  useEffect(() => {
    loadData();
  }, [currentPage, filterAction, filterEntity, filterSeverity, filterUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Build filters
      const filters: any = {
        page: currentPage,
        limit: pageLimit,
      };
      
      if (filterAction !== 'all') filters.action = filterAction;
      if (filterEntity !== 'all') filters.entity = filterEntity;
      if (filterSeverity !== 'all') filters.severity = filterSeverity;
      if (filterUser !== 'all') filters.userId = parseInt(filterUser);

      const [fetchedLogs, fetchedUsers] = await Promise.all([
        auditLogsApi.getAll(filters),
        usersApi.getAll()
      ]);

      // Merge user data with audit logs
      const logsWithUsers = fetchedLogs.map((log: AuditLogData) => ({
        ...log,
        user: fetchedUsers.find((user: UserData) => user.id === log.userId)
      }));

      setAuditLogs(logsWithUsers);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to load audit logs. Using offline mode.",
        variant: "destructive",
      });
      // You could add fallback data here if needed
    } finally {
      setLoading(false);
    }
  };

  // Filter logs by search term
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.entity && log.entity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.user?.name && log.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.user?.email && log.user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'error':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  const getActionBadgeClass = (action: string) => {
    if (action.includes('create')) return 'bg-green-100 text-green-800';
    if (action.includes('update')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete')) return 'bg-red-100 text-red-800';
    if (action.includes('login')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleViewDetails = (log: AuditLogData) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const parseJsonSafely = (jsonString?: string) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return jsonString;
    }
  };

  // Get unique actions, entities for filter dropdowns
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];
  const uniqueEntities = [...new Set(auditLogs.map(log => log.entity))];

  return (
    <AdminLayout title="Audit Logs" currentPath="/admin/audit-logs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-moroccan-blue" />
            <h2 className="text-lg font-medium text-gray-900">System Activity History</h2>
          </div>
          <div className="text-sm text-gray-500">
            Total Logs: {auditLogs.length}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by action, entity, user, or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-moroccan-blue focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {uniqueEntities.map(entity => (
                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id.toString()} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moroccan-blue"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Severity</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getSeverityIcon(log.severity)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(log.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-sm">{log.user?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{log.user?.role || 'N/A'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{log.entity}</span>
                          {log.entityId && (
                            <span className="text-xs text-gray-500">#{log.entityId}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {log.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Page {currentPage} • Showing {filteredLogs.length} of {auditLogs.length} logs
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={filteredLogs.length < pageLimit}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Audit Log Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedLog.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Severity</label>
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(selectedLog.severity)}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityBadgeClass(selectedLog.severity)}`}>
                      {selectedLog.severity}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">User</label>
                  <p className="text-sm text-gray-900">
                    {selectedLog.user?.name || 'Unknown'} ({selectedLog.user?.role || 'N/A'})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Action</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeClass(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Entity</label>
                  <p className="text-sm text-gray-900">
                    {selectedLog.entity}
                    {selectedLog.entityId && ` #${selectedLog.entityId}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address</label>
                  <p className="text-sm text-gray-900">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
              </div>

              {/* Description */}
              {selectedLog.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLog.description}</p>
                </div>
              )}

              {/* Changes */}
              {(selectedLog.oldValues || selectedLog.newValues) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Changes</h3>
                  
                  {selectedLog.oldValues && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Old Values</label>
                      <pre className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(parseJsonSafely(selectedLog.oldValues), null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {selectedLog.newValues && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">New Values</label>
                      <pre className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(parseJsonSafely(selectedLog.newValues), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Technical Information */}
              {selectedLog.userAgent && (
                <div>
                  <label className="text-sm font-medium text-gray-700">User Agent</label>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAuditLogs;
