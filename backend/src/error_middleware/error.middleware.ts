import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger";
import { IJsonResponse } from "../interface/interface";

class CustomError extends Error {
  statusCode: number;
  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export { CustomError };

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  logger.error(err.message);
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;
  const response: IJsonResponse = {
    status: statusCode,
    message: err.message,
  };
  res.status(statusCode).json(response);
  return;
};
