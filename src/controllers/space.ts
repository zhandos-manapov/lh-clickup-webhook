import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";

const getSpaces = async (req: Request, res: Response) => {
    const { access_token: token } = await import('../db/token.json')

    const { team_id } = req.params
    if (!team_id) throw new BadRequestError('Please provide team_id')

    let { archived } = req.query
    if (archived !== 'true' && archived !== 'false') {
        archived = 'false'
    }

    const endpoint = `${process.env.CLICKUP_API}/team/${team_id}/space`
    const response = await axios.get(endpoint, {
        params: { archived },
        headers: { 'Authorization': token }
    })
    const { data } = response

    res.status(StatusCodes.OK).json(data)
}

export {
    getSpaces
}