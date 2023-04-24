import { Request, Response } from "express";
import axios from "axios";
import { StatusCodes } from "http-status-codes";
import * as clickupService from "../services/clickup.service";

const getTeams = async (req: Request, res: Response) => {
    const { data } = await clickupService.getTeams()
    res.status(StatusCodes.OK).json(data)
}

export {
    getTeams
}