/** Shared list pagination helpers (default 10 / page, max 100). */

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const parsePagination = (query = {}, defaults = {}) => {
  const defaultLimit = defaults.limit ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const requested = parseInt(query.limit, 10);
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number.isFinite(requested) ? requested : defaultLimit)
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const paginationMeta = (page, limit, totalRecords) => ({
  page,
  limit,
  totalRecords,
  totalPages: Math.ceil(totalRecords / limit) || 0,
});

export const paginatedResponse = (data, page, limit, totalRecords) => ({
  data,
  pagination: paginationMeta(page, limit, totalRecords),
});

/** True when the client asked for page-based results. */
export const wantsPagination = (query = {}) =>
  query.page != null || query.limit != null || query.paginated === "true";
