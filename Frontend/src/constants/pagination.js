/** Canonical page size for all list tables in the app. */
export const PAGE_SIZE = 10;

export const emptyPagination = (page = 1, limit = PAGE_SIZE) => ({
  page,
  limit,
  totalRecords: 0,
  totalPages: 0,
});

/** Normalize API pagination payloads into a consistent shape. */
export const normalizePagination = (raw, fallbackPage = 1, fallbackLimit = PAGE_SIZE) => {
  if (!raw || typeof raw !== 'object') {
    return emptyPagination(fallbackPage, fallbackLimit);
  }
  const page = Math.max(1, Number(raw.page) || fallbackPage);
  const limit = Math.max(1, Number(raw.limit) || fallbackLimit);
  const totalRecords = Math.max(0, Number(raw.totalRecords ?? raw.total ?? 0));
  const totalPages =
    Number(raw.totalPages) ||
    (limit > 0 ? Math.ceil(totalRecords / limit) : 0);
  return { page, limit, totalRecords, totalPages };
};

/** Client-side slice helper when an endpoint still returns a full array. */
export const paginateClient = (items = [], page = 1, limit = PAGE_SIZE) => {
  const list = Array.isArray(items) ? items : [];
  const totalRecords = list.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  return {
    data: list.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      totalRecords,
      totalPages: totalRecords === 0 ? 0 : totalPages,
    },
  };
};
