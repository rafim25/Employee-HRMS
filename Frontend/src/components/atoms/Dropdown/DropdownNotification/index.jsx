import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { HR } from '../../../../constants/hrEndpoints';

const formatWhen = (value) => {
  if (!value) return '';
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  if (!isValid(date)) return '';
  return format(date, 'dd MMM, yyyy · HH:mm');
};

const DropdownNotification = () => {
  const { state } = useAuth();
  const role = String(state?.user?.role || '').toLowerCase();
  const inboxPath =
    role === 'admin' ? '/admin/hr/notifications' : '/employee/hr/notifications';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!state?.user) return;
    try {
      setLoading(true);
      const res = await api.get(`${HR.NOTIFICATIONS}?page=1&limit=10`);
      setNotifications(res.data?.data || []);
      setUnreadCount(Number(res.data?.unreadCount) || 0);
    } catch {
      // Keep header quiet if notifications API is unavailable
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [state?.user]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60_000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    if (dropdownOpen) loadNotifications();
  }, [dropdownOpen, loadNotifications]);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current?.contains(target)
      ) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const markRead = async (id) => {
    try {
      await api.post(`${HR.NOTIFICATIONS}/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      await api.post(`${HR.NOTIFICATIONS}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  return (
    <li className="relative">
      <button
        type="button"
        ref={trigger}
        onClick={() => setDropdownOpen((open) => !open)}
        aria-label="Notifications"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 z-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-meta-1 px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        <svg
          className="fill-current duration-300 ease-in-out"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
            fill=""
          />
        </svg>
      </button>

      <div
        ref={dropdown}
        className={`absolute -right-27 mt-2.5 flex max-h-90 w-75 flex-col overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
          dropdownOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stroke px-4.5 py-3 dark:border-strokedark">
          <h5 className="text-sm font-semibold text-[#0b1d36] dark:text-white">
            Notifications
            {unreadCount > 0 ? (
              <span className="ml-2 text-xs font-medium text-meta-1">
                {unreadCount} unread
              </span>
            ) : null}
          </h5>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-medium text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <ul className="flex max-h-72 flex-col overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <li className="px-4.5 py-6 text-center text-sm text-bodydark2">
              Loading…
            </li>
          ) : notifications.length === 0 ? (
            <li className="px-4.5 py-6 text-center text-sm text-bodydark2">
              No notifications yet
            </li>
          ) : (
            notifications.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!item.is_read) markRead(item.id);
                  }}
                  className={`flex w-full flex-col gap-1.5 border-t border-stroke px-4.5 py-3 text-left transition hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 ${
                    item.is_read ? 'opacity-70' : 'bg-[#f8f4e8]/40'
                  }`}
                >
                  <p className="text-sm">
                    <span className="font-semibold text-black dark:text-white">
                      {item.title || 'Notification'}
                    </span>
                    {item.message ? (
                      <>
                        {' '}
                        <span className="text-bodydark2">{item.message}</span>
                      </>
                    ) : null}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-bodydark2">
                      {formatWhen(item.createdAt)}
                    </p>
                    {!item.is_read && (
                      <span className="rounded-full bg-meta-1/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-meta-1">
                        New
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="border-t border-stroke px-4.5 py-3 dark:border-strokedark">
          <Link
            to={inboxPath}
            onClick={() => setDropdownOpen(false)}
            className="block text-center text-sm font-medium text-primary hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </li>
  );
};

export default DropdownNotification;
