import { Request, Response } from "express";
import axios from "axios";
import { StatusCodes } from "http-status-codes";

const getTeams = async (req: Request, res: Response) => {
    const { access_token: token } = await import('../db/token.json')

    const endpoint = `${process.env.CLICKUP_API}/team`
    const response = await axios.get(endpoint, { headers: { 'Authorization': token } })
    const { data } = response

    res.status(StatusCodes.OK).json(data)
}

export {
    getTeams
}