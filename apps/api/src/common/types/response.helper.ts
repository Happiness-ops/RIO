export {};
import { ApiResponse, PaginatedResponse, PaginationMeta } from './types';

export function ok<T>(message: string, data: T): ApiResponse<T> {
  return { success: true, message, data };
}

export function paginated<T>(
  message: string,
  items: T[],
  meta: PaginationMeta,
): ApiResponse<PaginatedResponse<T>> {
  return { success: true, message, data: { items, pagination: meta } };
}

export function paginationMeta(
  total: number,
  limit: number,
  offset: number,
): PaginationMeta {
  return { total, limit, offset, hasMore: offset + limit < total };
}