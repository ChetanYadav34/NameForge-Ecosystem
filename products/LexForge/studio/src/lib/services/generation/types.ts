import { JobSummaryDTO, ProgressDTO, ArtifactDTO, GenerationResultDTO } from "./dto";

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
