import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBell } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, AppTable } from '../../../components';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { PAGE_SIZE, emptyPagination, normalizePagination } from '../../../constants/pagination';
import { SectionTitle, cardClass } from './shared';

const Notifications = ({ Layout = DefaultLayoutAdmin, Breadcrumb = BreadcrumbAdmin }) => {
  const [rows, setRows] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination());

  const load = async () => {
    try {
      const res = await api.get(`${HR.NOTIFICATIONS}?page=${page}&limit=${PAGE_SIZE}`);
      setRows(res.data?.data || []);
      setUnreadCount(res.data?.unreadCount || 0);
      setPagination(normalizePagination(res.data?.pagination, page, PAGE_SIZE));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load notifications');
    }
  };

  useEffect(() => { load(); }, [page]);

  const markRead = async (id) => {
    await api.post(`${HR.NOTIFICATIONS}/${id}/read`);
    load();
  };

  const markAll = async () => {
    await api.post(`${HR.NOTIFICATIONS}/read-all`);
    toast.success('All marked as read');
    load();
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (n) => <span className="font-medium">{n.title}</span>,
    },
    { key: 'message', header: 'Message' },
    {
      key: 'when',
      header: 'When',
      render: (n) => new Date(n.createdAt).toLocaleString(),
    },
  ];

  return (
    <Layout>
      <Breadcrumb pageName="Notifications" icon={FaBell} backButton={false} />
      <div className={cardClass}>
        <SectionTitle
          title={`Notifications (${unreadCount} unread)`}
          action={
            <button type="button" className="btn-outline" onClick={markAll}>
              Mark all read
            </button>
          }
        />
        <AppTable
          columns={columns}
          data={rows}
          emptyText="No notifications"
          currentPage={pagination.page || page}
          totalItems={pagination.totalRecords}
          totalPages={pagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
          actions={(n) =>
            n.is_read ? (
              <span className="text-sm text-[#5b6b7c]">Read</span>
            ) : (
              <button
                type="button"
                className="text-sm font-medium text-primary underline"
                onClick={() => markRead(n.id)}
              >
                Mark read
              </button>
            )
          }
        />
      </div>
    </Layout>
  );
};

export default Notifications;
