import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const serviceKey = req.headers['service-key'];

    if (serviceKey !== process.env.SERVICE_KEY) {
      return res.status(403).json({ message: 'Something went wrong!' });
    }
    next();
  }
}
