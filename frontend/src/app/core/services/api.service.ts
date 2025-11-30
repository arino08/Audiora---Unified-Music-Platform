import { Injectable, inject } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { ApiResponse, ApiError, PaginatedResponse } from "../models";

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  withCredentials?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl || "/api";

  /**
   * Performs a GET request
   */
  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Performs a GET request with raw response (no ApiResponse wrapper)
   */
  getRaw<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a GET request for paginated data
   */
  getPaginated<T>(
    endpoint: string,
    page = 0,
    limit = 20,
    options?: RequestOptions,
  ): Observable<PaginatedResponse<T>> {
    const params = new HttpParams()
      .set("offset", (page * limit).toString())
      .set("limit", limit.toString());

    // Merge any additional params from options
    let mergedParams = params;
    if (options?.params) {
      if (options.params instanceof HttpParams) {
        const httpParams = options.params as HttpParams;
        httpParams.keys().forEach((key) => {
          mergedParams = mergedParams.set(key, httpParams.get(key) || "");
        });
      } else {
        const objParams = options.params as {
          [param: string]: string | string[];
        };
        Object.entries(objParams).forEach(([key, value]) => {
          mergedParams = mergedParams.set(
            key,
            Array.isArray(value) ? value.join(",") : value,
          );
        });
      }
    }

    return this.http
      .get<PaginatedResponse<T>>(`${this.baseUrl}${endpoint}`, {
        headers: options?.headers,
        params: mergedParams,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a POST request
   */
  post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Performs a POST request with raw response
   */
  postRaw<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a PUT request
   */
  put<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Performs a PUT request with raw response
   */
  putRaw<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Performs a PATCH request
   */
  patch<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions,
  ): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, body, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Performs a DELETE request
   */
  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Performs a DELETE request with raw response
   */
  deleteRaw<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, {
        headers: options?.headers,
        params: options?.params,
        withCredentials: options?.withCredentials ?? true,
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Upload a file using multipart/form-data
   */
  upload<T>(endpoint: string, file: File, fieldName = "file"): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);

    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, formData, {
        withCredentials: true,
      })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Extract data from ApiResponse wrapper
   */
  private extractData<T>(response: ApiResponse<T> | T): T {
    if (
      response &&
      typeof response === "object" &&
      "success" in response &&
      "data" in response
    ) {
      return (response as ApiResponse<T>).data;
    }
    return response as T;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unexpected error occurred";
    let errorCode = "UNKNOWN_ERROR";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
      errorCode = "CLIENT_ERROR";
    } else {
      // Server-side error
      if (error.error && typeof error.error === "object") {
        const apiError = error.error as ApiError;
        if (apiError.error) {
          errorMessage = apiError.error.message || errorMessage;
          errorCode = apiError.error.code || `HTTP_${error.status}`;
        } else if ("message" in error.error) {
          errorMessage = (error.error as { message: string }).message;
          errorCode = `HTTP_${error.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
        errorCode = `HTTP_${error.status}`;
      }

      // Map common HTTP status codes to user-friendly messages
      switch (error.status) {
        case 0:
          errorMessage =
            "Unable to connect to the server. Please check your internet connection.";
          errorCode = "NETWORK_ERROR";
          break;
        case 400:
          errorMessage =
            errorMessage || "Invalid request. Please check your input.";
          break;
        case 401:
          errorMessage = "Your session has expired. Please log in again.";
          errorCode = "UNAUTHORIZED";
          break;
        case 403:
          errorMessage = "You do not have permission to perform this action.";
          errorCode = "FORBIDDEN";
          break;
        case 404:
          errorMessage =
            errorMessage || "The requested resource was not found.";
          errorCode = "NOT_FOUND";
          break;
        case 409:
          errorMessage =
            errorMessage || "A conflict occurred with the current state.";
          errorCode = "CONFLICT";
          break;
        case 422:
          errorMessage = errorMessage || "The request could not be processed.";
          errorCode = "UNPROCESSABLE_ENTITY";
          break;
        case 429:
          errorMessage = "Too many requests. Please try again later.";
          errorCode = "RATE_LIMITED";
          break;
        case 500:
          errorMessage =
            "An internal server error occurred. Please try again later.";
          errorCode = "SERVER_ERROR";
          break;
        case 502:
        case 503:
        case 504:
          errorMessage =
            "The service is temporarily unavailable. Please try again later.";
          errorCode = "SERVICE_UNAVAILABLE";
          break;
      }
    }

    console.error(`[API Error] ${errorCode}: ${errorMessage}`, error);

    return throwError(() => ({
      code: errorCode,
      message: errorMessage,
      status: error.status,
      originalError: error,
    }));
  }
}
