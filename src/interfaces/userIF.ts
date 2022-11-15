import FacebookUser from "./FacebookIF";
import express,{Request,Response,NextFunction} from 'express'
declare global {
  namespace Express {
    interface Request {
      email?: String,
      name?: String,
      pic?: String,
      logout():Function ,
      user?:FacebookUser,
      isAuthenticated():Function
    }
  }
}
export default Request