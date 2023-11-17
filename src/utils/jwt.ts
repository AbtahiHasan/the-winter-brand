import { Response } from "express";
import jwt from "jsonwebtoken"
import { IUser } from "../models/user.model";
import config from "../config";
import { nodeCache } from "../app";

interface ITokenOption {
    exprire: Date;
    maxAge: number;
    httpOnly: boolean;
    semeSite: "lex" | "strict" | "none" | undefined;
    secure?: boolean;
}


const accessTokenExpire = parseInt(config.jwt.expires_in || "300", 10)
const refreshTokenExpire = parseInt(config.jwt.refresh_expires_in || "1200", 10)

export const accessTokenOption: ITokenOption = {
    exprire: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    semeSite: "lex",
    secure: config.env === "production",
}

export const refreshTokenOption: ITokenOption = {
    exprire: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    semeSite: "lex",
    secure: config.env === "production",
}


const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = jwt.sign({ email: user.email }, config.jwt.secret || "", {
        expiresIn: "5m"
    })
    const refreshToken = jwt.sign({ email: user.email }, config.jwt.refresh_secret || "", {
        expiresIn: "3d"
    })



    nodeCache.set("user:" + user.email, JSON.stringify(user) as string)
    res.cookie("access_token", accessToken, accessTokenOption)
    res.cookie("refresh_token", refreshToken, refreshTokenOption)
    res.status(statusCode).json({
        success: true,
        user,
        accessToken
    })
}



export default sendToken