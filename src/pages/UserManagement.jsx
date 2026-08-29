/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - User Management (Admin)                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/utils/LanguageContext";
import CryptoShield, { useCryptoShield } from "../components/admin/CryptoShield";
import Pagination from "../components/utils/Pagination";
import {
  Users, UserCircle, Shield, Search, Mail, Calendar,
  Edit, Trash2, Crown, User as UserIcon, AlertCircle, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

function UserManagementContent() {
  const { language } = useLanguage();
  const { user: adminUser } = useCryptoShield();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const pageSize = 20;

  // Fetch users with service role
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users-management', currentPage, searchQuery, roleFilter],
    queryFn: async () => {
      let allUsers = await base44.asServiceRole.entities.User.list('-created_date');
      
      // Apply filters
      if (roleFilter !== 'all') {
        allUsers = allUsers.filter(u => u.role === roleFilter);
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        allUsers = allUsers.filter(u => 
          u.email?.toLowerCase().includes(query) ||
          u.full_name?.toLowerCase().includes(query)
        );
      }

      // Pagination
      const start = (currentPage - 1) * pageSize;
      const items = allUsers.slice(start, start + pageSize);
      
      return { items, total: allUsers.length };
    },
    initialData: { items: [], total: 0 },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }) => base44.asServiceRole.entities.User.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      setEditingUser(null);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => base44.asServiceRole.entities.User.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-management'] });
      setUserToDelete(null);
    },
  });

  const handleUpdateUser = (data) => {
    updateUserMutation.mutate({ userId: editingUser.id, data });
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  const renderUserCard = (userData, index) => (
    <motion.div 
      key={userData.id} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0 }}
    >
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 bg-gradient-to-br ${
              userData.role === 'admin' ? 'from-red-500 to-orange-600' : 'from-purple-100 to-indigo-100'
            } rounded-xl flex items-center justify-center flex-shrink-0`}>
              {userData.role === 'admin' ? (
                <Crown className="w-6 h-6 text-white" />
              ) : (
                <UserCircle className="w-6 h-6 text-purple-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-900 truncate">{userData.full_name || userData.email}</div>
              <div className="text-sm text-slate-600 truncate">{userData.email}</div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={userData.role === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>
                  {userData.role}
                </Badge>
                <span className="text-xs text-slate-500">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date(userData.created_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          {userData.id !== adminUser.id && (
            <div className="flex gap-2 flex-shrink-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingUser(userData)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{language === 'en' ? 'Edit User' : 'Modifier l\'Utilisateur'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'en' ? 'Full Name' : 'Nom Complet'}
                      </label>
                      <Input
                        defaultValue={userData.full_name}
                        id="edit-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {language === 'en' ? 'Role' : 'Rôle'}
                      </label>
                      <Select defaultValue={userData.role}>
                        <SelectTrigger id="edit-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        const name = document.getElementById('edit-name').value;
                        const role = document.getElementById('edit-role').textContent;
                        handleUpdateUser({ full_name: name, role: role.toLowerCase() });
                      }}
                      disabled={updateUserMutation.isPending}
                    >
                      {language === 'en' ? 'Save' : 'Sauvegarder'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={userToDelete?.id === userData.id} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUserToDelete(userData)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{language === 'en' ? 'Delete User' : 'Supprimer l\'Utilisateur'}</DialogTitle>
                  </DialogHeader>
                  <p className="text-slate-600 py-4">
                    {language === 'en' 
                      ? `Are you sure you want to delete ${userData.email}? This action cannot be undone.`
                      : `Êtes-vous sûr de vouloir supprimer ${userData.email} ? Cette action est irréversible.`
                    }
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUserToDelete(null)}>
                      {language === 'en' ? 'Cancel' : 'Annuler'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteUser}
                      disabled={deleteUserMutation.isPending}
                    >
                      {language === 'en' ? 'Delete' : 'Supprimer'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-6 shadow-xl flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Users className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {language === 'en' ? 'User Management' : 'Gestion des Utilisateurs'}
                </h1>
                <p className="text-purple-100 text-sm">
                  {language === 'en' ? 'Manage user accounts and permissions' : 'Gérer les comptes et permissions'}
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => navigate(createPageUrl('ArchitectDashboard'))}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>

          <Alert className="bg-blue-500/20 border-blue-400/50 text-white">
            <AlertCircle className="h-4 w-4 text-blue-200" />
            <AlertTitle className="text-white">
              {language === 'en' ? 'How to invite users' : 'Comment inviter des utilisateurs'}
            </AlertTitle>
            <AlertDescription className="text-blue-100">
              {language === 'en' 
                ? 'To add new users, go to your Base44 Dashboard > Users > Invite User. Users cannot be created directly in the app.'
                : 'Pour ajouter des utilisateurs, allez dans votre Dashboard Base44 > Utilisateurs > Inviter un Utilisateur. Les utilisateurs ne peuvent pas être créés directement dans l\'app.'
              }
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={language === 'en' ? 'Search by name or email...' : 'Rechercher par nom ou email...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'en' ? 'All Roles' : 'Tous les Rôles'}</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="font-medium">{language === 'en' ? 'Total:' : 'Total :'}</span>
            <span className="font-bold text-purple-600">{usersData?.total || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-red-500" />
            <span className="font-medium">{language === 'en' ? 'Admins:' : 'Admins :'}</span>
            <span className="font-bold text-red-600">
              {usersData?.items?.filter(u => u.role === 'admin').length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{language === 'en' ? 'Users:' : 'Utilisateurs :'}</span>
            <span className="font-bold text-blue-600">
              {usersData?.items?.filter(u => u.role === 'user').length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
            </div>
          ) : usersData?.items?.length > 0 ? (
            <>
              <div className="space-y-3">
                {usersData.items.map((userData, idx) => renderUserCard(userData, idx))}
              </div>
              
              {usersData.total > pageSize && (
                <div className="mt-6">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={Math.ceil(usersData.total / pageSize)} 
                    totalItems={usersData.total} 
                    onPageChange={setCurrentPage} 
                    itemsPerPage={pageSize} 
                  />
                </div>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-2">
                {language === 'en' ? 'No users found' : 'Aucun utilisateur trouvé'}
              </p>
              <p className="text-slate-500 text-sm">
                {language === 'en' ? 'Try adjusting your filters' : 'Essayez d\'ajuster vos filtres'}
              </p>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function UserManagement() {
  return (
    <CryptoShield>
      <UserManagementContent />
    </CryptoShield>
  );
}