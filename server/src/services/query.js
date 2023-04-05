const DEFAULT_PAGE_LIMIT = 0

export function getPagination(query) {
    const page = Math.abs(query.page) || 1
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT
    const skip = limit * (page - 1)

    return {
        skip,
        limit
    }
}