export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CaseStatisticsDto {
  totalCases: number;
  pendingBatch: number;
  awaitingAction: number;
  autoResolved: number;
  completed: number;
}
