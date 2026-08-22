const getPaginationParams = (reqQuery) => {
  const page = Math.max(1, parseInt(reqQuery.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(reqQuery.limit || '10', 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMeta
};
