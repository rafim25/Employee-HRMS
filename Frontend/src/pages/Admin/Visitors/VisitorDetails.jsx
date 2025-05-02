import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaEdit, FaTrash, FaHistory } from 'react-icons/fa';

const VisitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchVisitorDetails();
    fetchVisitorBookings();
  }, [id]);

  const fetchVisitorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/visitors/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched visitor details:', data);
      setVisitor(data);
    } catch (error) {
      console.error('Error fetching visitor details:', error);
      toast.error('Failed to fetch visitor details');
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitorBookings = async () => {
    try {
      const response = await fetch(`/api/visitors/${id}/bookings`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched visitor bookings:', data);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching visitor bookings:', error);
      toast.error('Failed to fetch visitor bookings');
    }
  };

  const handleBack = () => {
    navigate('/admin/visitors/list');
  };

  const handleEdit = () => {
    navigate(`/admin/visitors/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this visitor?')) {
      try {
        const response = await fetch(`/api/visitors/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast.success('Visitor deleted successfully');
        navigate('/admin/visitors/list');
      } catch (error) {
        console.error('Error deleting visitor:', error);
        toast.error('Failed to delete visitor');
      }
    }
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  if (!visitor) {
    return (
      <DefaultLayoutAdmin>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-gray-500 mb-4">Visitor not found</p>
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Visitors
            </button>
          </div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Visitor Details
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-4 text-center font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              <FaArrowLeft className="mr-2" /> Back to List
            </button>
            <button
              onClick={handleEdit}
              className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-md bg-danger py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <div className="col-span-1 md:col-span-2 xl:col-span-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Visitor Information
                </h3>
              </div>
              <div className="p-6.5">
                <div className="mb-6 flex flex-col gap-5.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-2xl font-semibold">
                        {visitor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-black dark:text-white">
                        {visitor.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {visitor.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${visitor.status === 'active'
                      ? 'bg-success text-success'
                      : 'bg-danger text-danger'
                      }`}>
                      {visitor.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                      Contact Information
                    </h4>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-base font-medium text-black dark:text-white">
                          {visitor.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-base font-medium text-black dark:text-white">
                          {visitor.address || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                      Identification
                    </h4>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ID Type</p>
                        <p className="text-base font-medium text-black dark:text-white">
                          {visitor.id_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ID Number</p>
                        <p className="text-base font-medium text-black dark:text-white">
                          {visitor.id_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {visitor.notes && (
                  <div className="mt-5.5">
                    <h4 className="mb-3 text-lg font-semibold text-black dark:text-white">
                      Additional Notes
                    </h4>
                    <p className="text-base text-black dark:text-white">
                      {visitor.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 xl:col-span-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-black dark:text-white">
                    Booking History
                  </h3>
                  <FaHistory className="text-primary" />
                </div>
              </div>
              <div className="p-6.5">
                {bookings.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No booking history found for this visitor.
                  </p>
                ) : (
                  <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Booking ID
                          </th>
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Room
                          </th>
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Check-in
                          </th>
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Check-out
                          </th>
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-[#eee] dark:border-strokedark">
                            <td className="py-5 px-4">
                              <p className="text-sm text-black dark:text-white">
                                {booking.booking_id}
                              </p>
                            </td>
                            <td className="py-5 px-4">
                              <p className="text-sm text-black dark:text-white">
                                {booking.room?.room_number || 'N/A'}
                              </p>
                            </td>
                            <td className="py-5 px-4">
                              <p className="text-sm text-black dark:text-white">
                                {new Date(booking.check_in_date).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="py-5 px-4">
                              <p className="text-sm text-black dark:text-white">
                                {new Date(booking.check_out_date).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="py-5 px-4">
                              <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${booking.status === 'confirmed'
                                ? 'bg-success text-success'
                                : booking.status === 'pending'
                                  ? 'bg-warning text-warning'
                                  : 'bg-danger text-danger'
                                }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default VisitorDetails; 