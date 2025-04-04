import { Response } from "express";

class ApiResponse {
  constructor(
    public status: string,
    public message: string,
    public statusCode: number,
    public data?: unknown
  ) {}
}

class Success extends ApiResponse {
  constructor(message: string, data?: unknown) {
    super("success", message, 200, data);
  }
}

class NotFound extends ApiResponse {
  constructor(message: string, data?: unknown) {
    super("not found", message, 404, data);
  }
}

class BadRequest extends ApiResponse {
  constructor(message: string, data?: unknown) {
    super("bad request", message, 400, data);
  }
}

class Unauthorized extends ApiResponse {
  constructor(message: string, data?: unknown) {
    super("unauthorized", message, 401, data);
  }
}

class Created extends ApiResponse {
  constructor(message: string, data?: unknown) {
    super("created", message, 201, data);
  }
}

class InternalServerError extends ApiResponse {
  constructor(message: string, data?: unknown) {
    super("internal server error", message, 500, data);
  }
}

function sendResponse(res: Response, response: ApiResponse): void {
  res.status(response.statusCode).json({
    status: response.status,
    message: response.message,
    data: response.data,
  });
}

export {
  ApiResponse,
  Success,
  NotFound,
  BadRequest,
  Unauthorized,
  Created,
  InternalServerError,
  sendResponse,
};
