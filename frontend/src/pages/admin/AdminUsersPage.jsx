import React, { useState, useEffect, useCallback } from 'react'
import { adminService } from '@/services/adminService'
import { useApp } from '@/context/AppContext'
import { useDebounce } from '@/hooks/useDebounce'
import { formatDate } from '@/utils/formatDate'
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  MoreVertical,
  Check,
} from 'lucide-react'
import {
  Card,
  Button,
  Input,
  Badge,
  Avatar,
  Pagination,
  EmptyState,
  ErrorState,
  ConfirmDialog,
  Skeleton,
} from '@/components/common'

export function AdminUsersPage() {
  const { addToast } = useApp()

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 350)

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = { page, limit: 10 }
      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim()
      }
      const response = await adminService.getUsers(params)
      const data = response.data || []
      setUsers(Array.isArray(data) ? data : [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.warn('Failed to load users:', err)
      setError(err.message || 'Unable to retrieve user records.')
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    fetchUsers(1)
  }, [fetchUsers])

  const handleToggleStatus = async (targetUser) => {
    const userId = targetUser._id || targetUser.id
    const newStatus = !targetUser.isActive
    try {
      await adminService.updateUserStatus(userId, newStatus)
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, isActive: newStatus } : u))
      )
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `User status changed to ${newStatus ? 'Active' : 'Suspended'}.`,
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not update user status.',
      })
    }
  }

  const handleToggleRole = async (targetUser) => {
    const userId = targetUser._id || targetUser.id
    const newRole = targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN'
    try {
      await adminService.updateUserRole(userId, newRole)
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: newRole } : u))
      )
      addToast({
        type: 'success',
        title: 'Role Updated',
        message: `User role changed to ${newRole}.`,
      })
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: err.message || 'Could not update user role.',
      })
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    setIsDeleting(true)
    const userId = userToDelete._id || userToDelete.id
    try {
      await adminService.deleteUser(userId)
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId))
      addToast({
        type: 'success',
        title: 'User Deleted',
        message: 'The user account has been permanently removed.',
      })
      setUserToDelete(null)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Could not delete user.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">User Management</h1>
        <p className="text-xs text-slate-400 mt-1">Audit accounts, manage roles, and review access status</p>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
        <Input
          placeholder="Search by name, email, or username..."
          icon={Search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load users"
          message={error}
          onRetry={() => fetchUsers(pagination.page)}
        />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try changing your search terms."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <>
          <div className="hidden md:block overflow-hidden bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-subtle)] shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 border-b border-[var(--color-border-subtle)] text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const uId = u._id || u.id
                  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || 'User'
                  const isAdmin = u.role === 'ADMIN'
                  const isActive = u.isActive !== false

                  return (
                    <tr key={uId} className="hover:bg-slate-800/50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.profileImage} name={fullName} size="sm" />
                          <div>
                            <p className="font-bold text-white">{fullName}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isAdmin ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-800/50 text-slate-300 border-[var(--color-border-subtle)]'
                        }`}>
                          {u.role || 'USER'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(u.createdAt || new Date())}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[11px] h-7"
                            onClick={() => handleToggleRole(u)}
                          >
                            {isAdmin ? 'Make User' : 'Make Admin'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`text-[11px] h-7 ${isActive ? 'text-amber-600' : 'text-emerald-600'}`}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {isActive ? 'Suspend' : 'Activate'}
                          </Button>
                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {users.map((u) => {
              const uId = u._id || u.id
              const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username || 'User'
              const isAdmin = u.role === 'ADMIN'
              const isActive = u.isActive !== false

              return (
                <Card key={uId} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={u.profileImage} name={fullName} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-white">{fullName}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <Badge variant={isAdmin ? 'primary' : 'secondary'} size="sm">
                      {u.role || 'USER'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-xs">
                    <span className={isActive ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {isActive ? 'Active' : 'Suspended'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="text-[10px] h-7" onClick={() => handleToggleRole(u)}>
                        {isAdmin ? 'Demote' : 'Promote'}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => fetchUsers(p)}
          />
        </>
      )}

      {/* Delete User Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title={`Delete user account?`}
        message={`Are you sure you want to permanently delete the account for "${userToDelete?.email}"? This action cannot be undone.`}
        confirmText="Delete User"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default AdminUsersPage
