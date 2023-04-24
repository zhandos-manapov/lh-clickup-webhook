import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import * as clickupService from '../services/clickup.service'

const getFolders = async (req: Request, res: Response) => {
    const { space_id } = req.params
    if (!space_id) throw new BadRequestError('Please provide space_id')

    let { archived } = req.query
    if (archived !== 'true' && archived !== 'false') {
        archived = 'false'
    }

    const { data } = await clickupService.getFolders(space_id, { archived })
    res.status(StatusCodes.OK).json(data)
}

export {
    getFolders
}