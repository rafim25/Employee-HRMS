import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar,
  FaUserTag, FaIdCard, FaBriefcase, FaVenusMars, FaBuilding,
  FaIdBadge, FaAddressCard, FaCheckCircle, FaKey
} from 'react-icons/fa';
import { format } from 'date-fns';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleImageError = () => {
    setImageError(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success/10', text: 'text-success', icon: '🟢' },
      inactive: { bg: 'bg-danger/10', text: 'text-danger', icon: '🔴' },
      deleted: { bg: 'bg-danger/10', text: 'text-danger', icon: '🔴' },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;

    return (
      <div className={`flex items-center gap-2 ${config.bg} ${config.text} px-4 py-2 rounded-full text-sm font-medium`}>
        <span>{config.icon}</span>
        <span>{status?.toUpperCase()}</span>
      </div>
    );
  };

  // Add this function to render permissions
  const renderPermissions = (permissions) => {
    if (!permissions) return 'No permissions set';
    
    try {
      // If permissions is a string, try to parse it
      const permissionsData = typeof permissions === 'string' 
        ? JSON.parse(permissions) 
        : permissions;

      // If it's already a simple string, return it directly
      if (typeof permissionsData === 'string') {
        return permissionsData;
      }

      // If it's an object with type, return the type
      if (permissionsData.type) {
        return permissionsData.type;
      }

      // Fallback
      return 'No permissions set';
    } catch (error) {
      // If parsing fails, return the raw value
      return permissions;
    }
  };

  // Update the InfoField component to handle permissions specially
  const InfoField = ({ icon, label, value, isPermission }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors duration-200">
      <span className="text-xl text-primary">{icon}</span>
      <div>
        <span className="block text-sm font-medium text-black dark:text-white mb-1">
          {label}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isPermission ? renderPermissions(value) : (value || 'N/A')}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="User Details" />
      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
          <div className=" flex justify-between border-b border-stroke py-4 px-7 dark:border-strokedark bg-gradient-to-r from-primary/10 to-transparent">
            <h3 className="font-semibold text-xl text-black dark:text-white flex items-center gap-2">
              <FaUser className="text-primary" />
              Personal Information
            </h3>
            <div className="flex justify-between ">
              {user?.status && (
                <div className="mr-4">
                  {getStatusBadge(user.status)}
                </div>
              )}
            </div>
          </div>
          <div className="p-7">
            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
              <div className="w-full sm:w-1/4">
                <div className="relative mx-auto w-full max-w-60">
                  <div className="rounded-full overflow-hidden shadow-lg aspect-square">
                    {!imageError && (user?.url || user?.photo) ? (
                      <img
                        src={user.url || user.photo}
                        onError={handleImageError}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400">
                        <FaUser className="text-6xl" />
                      </div>
                    )}

                  </div>
                </div>
              </div>

              <div className="w-full sm:w-3/4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InfoField icon={<FaIdCard />} label="User ID" value={user?.user_id} />
                  <InfoField icon={<FaUser />} label="Username" value={user?.username} />
                  <InfoField icon={<FaEnvelope />} label="Email" value={user?.email} />
                  <InfoField icon={<FaUserTag />} label="Role" value={user?.role} />
                  <InfoField icon={<FaVenusMars />} label="Gender" value={user?.gender} />
                  <InfoField
                    icon={<FaCalendar />}
                    label="Date Joined"
                    value={user?.date_joined ? format(new Date(user.date_joined), 'PPP') : 'N/A'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Professional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark bg-gradient-to-r from-success/10 to-transparent">
              <h3 className="font-semibold text-xl text-black dark:text-white flex items-center gap-2">
                <FaPhone className="text-success" />
                Contact Information
              </h3>
            </div>
            <div className="p-7">
              <div className="grid grid-cols-1 gap-6">
                <InfoField icon={<FaPhone />} label="Mobile Number" value={user?.mobile_number} />
                <InfoField icon={<FaPhone />} label="Alternative Mobile" value={user?.alt_mobile_number} />
                <InfoField icon={<FaMapMarkerAlt />} label="Address" value={user?.address} />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark bg-gradient-to-r from-warning/10 to-transparent">
              <h3 className="font-semibold text-xl text-black dark:text-white flex items-center gap-2">
                <FaBriefcase className="text-warning" />
                Professional Information
              </h3>
            </div>
            <div className="p-7">
              <div className="grid grid-cols-1 gap-6">
                <InfoField icon={<FaBuilding />} label="Department" value={user?.department} />
                <InfoField icon={<FaBriefcase />} label="Designation" value={user?.designation} />
                <InfoField icon={<FaIdBadge />} label="PAN Number" value={user?.pan_number} />
                <InfoField icon={<FaAddressCard />} label="Aadhar Number" value={user?.aadhar_number} />
                <InfoField 
                  icon={<FaKey />} 
                  label="Permissions" 
                  value={user?.permissions}
                  isPermission={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default UserDetails; 