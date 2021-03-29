import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { JwtPayload } from '@quangdvnnnn/go-n-share';
import { DriverService } from './datasources/driver.service';

declare module 'express-session' {
  interface SessionData {
    token: string;
  }
}

export interface GraphContext {
  req: Request & {
    session: Session & Partial<SessionData> & { currentUser?: JwtPayload };
  };
  res: Response;
  driverService?: DriverService;
}
