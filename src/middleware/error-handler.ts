import { NextFunction, Request, Response } from "express";
import { CustomAPIError } from "../errors";
import { StatusCodes } from "http-status-codes";

const errorHandler = (err: Error | CustomAPIError, req: Request, res: Response, next: NextFunction) => {
    console.log(err)

    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ message: err.message })
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message, err})
}

export default errorHandler