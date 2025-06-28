
import React, { useState, useEffect } from 'react';
import { User, Search, Filter, Edit, Trash2, Check, Plus } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import AdminLayout from '../components/AdminLayout';
import { Button } from '../components/ui/button';
import UserEditModal from '../components/UserEditModal';
import { usersApi } from '../lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'inactive';
  registeredDate: string;
  lastLogin: string;
  password?: string;
  username?: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await usersApi.getAll();
      console.log('Fetched users:', fetchedUsers);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Using offline mode.",
        variant: "destructive",
      });
      // Fallback to localStorage if API fails
      const savedUsers = localStorage.getItem('martilhaven_users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter users by search term and role
  const filteredUsers = users.filter(user => {
    // Filter by search term
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by role
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getUserStatusBadgeClass = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getUserRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (selectedUser) {
      try {
        await usersApi.delete(selectedUser.id);
        await loadUsers(); // Reload users from API
        setIsConfirmDialogOpen(false);
        setSelectedUser(null);
        
        toast({
          title: "User Deleted",
          description: "The user has been successfully deleted.",
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddModalOpen(true);
  };

  const handleChangePassword = (user: UserData) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordDialogOpen(true);
  };

  const confirmChangePassword = async () => {
    if (selectedUser && newPassword) {
      try {
        await usersApi.update(selectedUser.id, {
          ...selectedUser,
          password: newPassword
        });
        
        setIsPasswordDialogOpen(false);
        setSelectedUser(null);
        setNewPassword('');
        
        toast({
          title: "Password Changed",
          description: "The user's password has been successfully changed.",
        });
      } catch (error) {
        console.error('Error changing password:', error);
        toast({
          title: "Error",
          description: "Failed to change password. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveUser = async (userData: UserData) => {
    try {
      if (selectedUser) {
        // Edit existing user
        await usersApi.update(selectedUser.id, userData);
        toast({
          title: "User Updated",
          description: "The user information has been successfully updated.",
        });
      } else {
        // Add new user
        await usersApi.create(userData);
        toast({
          title: "User Added",
          description: "New user has been successfully added.",
        });
      }
      
      await loadUsers(); // Reload users from API
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save user. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moroccan-blue mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-moroccan-blue focus:border-moroccan-blue w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">Role:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-moroccan-blue focus:border-moroccan-blue"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          
          <Button 
            onClick={handleAddUser}
            className="bg-moroccan-blue text-white hover:bg-moroccan-blue/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add User
          </Button>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.username ? `@${user.username}` : `ID: ${user.id}`}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getUserRoleBadgeClass(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getUserStatusBadgeClass(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">Registered: {user.registeredDate}</div>
                    <div className="text-sm text-gray-500">Last login: {user.lastLogin}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleChangePassword(user)}
                        className="text-amber-600 hover:text-amber-800"
                        title="Change Password"
                      >
                        <User size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? `No users match "${searchTerm}"` 
                : filterRole !== 'all' 
                  ? `No users with role "${filterRole}" found`
                  : 'No users have been added yet.'}
            </p>
            {!searchTerm && !filterRole && (
              <div className="mt-6">
                <Button
                  onClick={handleAddUser}
                  className="bg-moroccan-blue hover:bg-moroccan-blue/90"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add User
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Password</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Enter a new password for {selectedUser?.name}
            </p>
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-moroccan-blue focus:border-moroccan-blue"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-moroccan-blue hover:bg-moroccan-blue/90" 
              onClick={confirmChangePassword}
              disabled={!newPassword}
            >
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit or Add User Modal */}
      {(isEditModalOpen || isAddModalOpen) && (
        <UserEditModal
          user={selectedUser}
          isOpen={isEditModalOpen || isAddModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setIsAddModalOpen(false);
          }}
          onSave={handleSaveUser}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
