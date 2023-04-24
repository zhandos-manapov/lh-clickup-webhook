import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import * as clickupService from '../services/clickup.service'

const getSpaces = async (req: Request, res: Response) => {
    const { team_id } = req.params
    if (!team_id) throw new BadRequestError('Please provide team_id')

    let { archived } = req.query
    if (archived !== 'true' && archived !== 'false') {
        archived = 'false'
    }

    const { data } = await clickupService.getSpaces(team_id, { archived })
    res.status(StatusCodes.OK).json(data)
}

export {
    getSpaces
}