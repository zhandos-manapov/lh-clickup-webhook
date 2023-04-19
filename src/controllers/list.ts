import axios from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";

const getLists = async (req: Request, res: Response) => {
    const { access_token: token } = await import('../db/token.json')

    const { folder_id } = req.params
    if (!folder_id) throw new BadRequestError('Please provide folder_id')

    let { archived } = req.query
    if (archived !== 'true' && archived !== 'false') {
        archived = 'false'
    }

    const endpoint = `${process.env.CLICKUP_API}/folder/${folder_id}/list`
    const response = await axios.get(endpoint, {
        params: { archived },
        headers: { 'Authorization': token }
    })
    const { data } = response
    res.status(StatusCodes.OK).json(data)
}

const getFolderlessLists = async (req: Request, res: Response) => {
    const { access_token: token } = await import('../db/token.json')

    const { space_id } = req.params
    if (!space_id) throw new BadRequestError('Please provide space_id')

    let { archived } = req.query
    if (archived !== 'true' && archived !== 'false') {
        archived = 'false'
    }

    const endpoint = `${process.env.CLICKUP_API}/space/${space_id}/list`
    const response = await axios.get(endpoint, {
        params: { archived },
        headers: { 'Authorization': token }
    })
    const { data } = response
    res.status(StatusCodes.OK).json(data)
}

export {
    getLists,
    getFolderlessLists
}