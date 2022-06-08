import { InsertResult } from "typeorm";
import { dataSource } from "../db/data-source";
import { SessionEntity, Status } from "../entities/Session";
import { UserEntity } from "../entities/User";

enum Rdate {
  TODAY = "Today",
  LASTWEEK = "LastWeek"
}

export class Session {

  private sessionRepository;

  constructor() {
    this.sessionRepository = dataSource.getRepository(SessionEntity)
  }

  async getSessionByUsername({ username, rdate, start_date, end_date, pdoaId }: { username: string, rdate?: Rdate, start_date?: Date, end_date?: Date, pdoaId?: string }): Promise<SessionEntity[] | null> {
    let session: SessionEntity[] | null;
    const query = this.sessionRepository.createQueryBuilder('session');
    query.where("session.username = :username", { username });

    if (pdoaId) {
      query.andWhere("session.pdoaId = :pdoaId", { pdoaId });
    }

    if (rdate) {
      const startDate = new Date(); startDate.setHours(0); startDate.setMinutes(0); startDate.setSeconds(0); startDate.setMilliseconds(0);
      const endDate = new Date();
      query.andWhere(
        "session.accessTimestamp BETWEEN :startDate and :endDate", { startDate, endDate }
      )

    }

    if (start_date && end_date) {
      query.andWhere(
        "session.accessTimestamp BETWEEN :startDate and :endDate", { startDate: start_date, endDate: end_date }
      )
    }

    session = await query.getMany()

    return session;
  }

  async createSession({ user, pdoaId, username, accessTimestamp, status }:
    { user: UserEntity, pdoaId: string, username: string, accessTimestamp: Date, status: Status }):
    Promise<InsertResult> {
    return await this.sessionRepository.insert({
      username,
      pdoaId,
      accessTimestamp,
      status,
      user
    })
  }
}
