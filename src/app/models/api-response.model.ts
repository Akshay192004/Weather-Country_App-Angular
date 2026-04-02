export interface ApiResponse<T> {
    data?: T;
    error?: string;
    isLoading?: boolean;
  }