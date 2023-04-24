import axios from "axios";
import fs from 'fs/promises'
import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { genHash, issueJWT, validPassword } from "../utils/auth.utils";


const getToken = async (req: Request, res: Response) => {
    // Done by the client
    const { code } = req.query
    if (!code) throw new BadRequestError('Please provide the authorization code')

    // Access token endpoint
    const accessTokenEndpoint = `${process.env.CLICKUP_API}/oauth/token`

    // Get access token
    const params = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code
    }
    const response = await axios.post(accessTokenEndpoint, null, { params })
    const { data } = response
    console.log(data)

    // Write token to DB
    await fs.writeFile('src/db/token.json', JSON.stringify(data))
    res.status(StatusCodes.OK).json(data)
}


const signin = async (req: Request, res: Response) => {
    const user: { email: string, password: string } = req.body

    const { default: users }: { default: { [key: string]: any } } = await import('../db/user.json')
    if(user.email in users){
        const verify = validPassword(user.password, users[user.email].hash, users[user.email].salt)
        if(verify){
            const token = issueJWT(user)
            return res.status(StatusCodes.OK).json(token)
        }else{
            throw new UnauthorizedError('Invalid credentials')
        }
    }else{  
        throw new Error('Email doesn\'t exist')
    }

}


const signup = async (req: Request, res: Response) => {
    const { salt, hash } = genHash(req.body.password)
    const user = { email: req.body.email, salt, hash }

    const { default: users }: { default: { [key: string]: any } } = await import('../db/user.json')

    if (user.email in users) throw new Error('User with this email already exists')

    users[user.email] = user

    await fs.writeFile(`${__dirname}/../db/user.json`, JSON.stringify(users))
    res.status(StatusCodes.OK).json({ message: 'Successfully registed' })
}


export {
    getToken,
    signin,
    signup
}