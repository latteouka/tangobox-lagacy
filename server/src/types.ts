import { Request, Response } from 'express'
import { Redis } from 'ioredis'

declare module 'express-session' {
  interface SessionData {
    userId?: string
  }
}

export interface MyContext {
  req: Request
  res: Response
  redis: Redis
}
