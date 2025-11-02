import { useState, useEffect, useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Users, Trash2, Shield, User, Mail, Calendar, AlertTriangle, UserCheck, UserX } from 'lucide-react'
import '../css/Administration.css'

const Administration = () => {
  const { backendurl, userData } = useContext(AppContent)
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, userId: null, userName: '' })

  // Check if user is admin
  useEffect(() => {
    if (!userData) {
      navigate('/')
      return
    }
    
    if (userData.role !== 'admin') {
      toast.error('Access denied. Admin only.')
      navigate('/')
      return
    }

    fetchAllUsers()
  }, [userData, navigate])

  // Fetch all users
  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendurl}/api/user/DataUsers`)
      
      if (response.data.success) {
        const allUsers = response.data.users
        
        // Separate users by role
        const regularUsers = allUsers.filter(user => user.role === 'user')
        const ownerUsers = allUsers.filter(user => user.role === 'owner')
        
        setUsers(regularUsers)
        setOwners(ownerUsers)
      } else {
        toast.error('Failed to load users')
      }
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // Show delete confirmation
  const handleDeleteClick = (userId, userName) => {
    setDeleteConfirm({ show: true, userId, userName })
  }

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, userId: null, userName: '' })
  }

  // Confirm delete user
  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${backendurl}/api/user/admin/${deleteConfirm.userId}`)
      
      if (response.data.success) {
        toast.success('User deleted successfully')
        
        // Remove user from state
        setUsers(prev => prev.filter(user => user._id !== deleteConfirm.userId))
        setOwners(prev => prev.filter(owner => owner._id !== deleteConfirm.userId))
        
        handleCancelDelete()
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      console.error('Delete user error:', error)
      toast.error('Failed to delete user')
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-section">
          <Shield size={40} className="admin-icon" />
          <div>
            <h1 className="admin-title">Administration Dashboard</h1>
            <p className="admin-subtitle">Manage all users and owners</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card stat-users">
            <Users size={24} />
            <div>
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">Users</div>
            </div>
          </div>
          <div className="stat-card stat-owners">
            <UserCheck size={24} />
            <div>
              <div className="stat-number">{owners.length}</div>
              <div className="stat-label">Owners</div>
            </div>
          </div>
          <div className="stat-card stat-total">
            <Users size={24} />
            <div>
              <div className="stat-number">{users.length + owners.length}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <User size={20} />
          Users ({users.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'owners' ? 'active' : ''}`}
          onClick={() => setActiveTab('owners')}
        >
          <UserCheck size={20} />
          Owners ({owners.length})
        </button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="table-container">
          {users.length === 0 ? (
            <div className="empty-state">
              <UserX size={64} />
              <h2>No Users Found</h2>
              <p>There are currently no regular users in the system.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <User size={18} className="cell-icon" />
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="email-cell">
                          <Mail size={18} className="cell-icon" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isAccountverified ? 'verified' : 'unverified'}`}>
                          {user.isAccountverified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={18} className="cell-icon" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteClick(user._id, user.name)}
                          className="btn-delete"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Owners Table */}
      {activeTab === 'owners' && (
        <div className="table-container">
          {owners.length === 0 ? (
            <div className="empty-state">
              <UserX size={64} />
              <h2>No Owners Found</h2>
              <p>There are currently no property owners in the system.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Verified</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {owners.map(owner => (
                    <tr key={owner._id}>
                      <td>
                        <div className="user-cell">
                          <UserCheck size={18} className="cell-icon" />
                          <span>{owner.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="email-cell">
                          <Mail size={18} className="cell-icon" />
                          <span>{owner.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${owner.isAccountverified ? 'verified' : 'unverified'}`}>
                          {owner.isAccountverified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={18} className="cell-icon" />
                          <span>{formatDate(owner.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteClick(owner._id, owner.name)}
                          className="btn-delete"
                          title="Delete owner"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <AlertTriangle size={48} />
            </div>
            <h2>Delete User</h2>
            <p>Are you sure you want to delete <strong>{deleteConfirm.userName}{" "}</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            
            <div className="modal-actions">
              <button onClick={handleCancelDelete} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn-confirm-delete">
                <Trash2 size={18} />
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Administration