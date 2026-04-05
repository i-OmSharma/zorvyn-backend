import { Response } from "express";

interface ApiResponse {
    statusCode: number;
    message: string;
    data?: unknown;
}

export const sendResponse = (
    res: Response,
    { statusCode, message, data }: ApiResponse
) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data: data ?? null,
    });
}