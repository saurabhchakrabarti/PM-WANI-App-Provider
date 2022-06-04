import { InsertResult, UpdateResult } from "typeorm";
import { dataSource } from "../db/data-source";
import { UserEntity } from "../entities/User";

export class User {

  private userRepository;

  constructor() {
    this.userRepository = dataSource.getRepository(UserEntity)
  }

  async getUserByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneBy({
      username
    })
    return user;
  }

  async getUserByCredential(username: string, password: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({
      username,
      password
    })

  }

  async createUser({ firstName, lastName, username, email, password, phone }:
    { firstName: string, lastName: string, username: string, email: string, password: string, phone: string }):
    Promise<InsertResult> {
    return await this.userRepository.insert({
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
    })
  }

  async createBulkUsers(usersArray: { firstName: string, lastName: string, username: string, email: string, password: string, phone: string }[]):
    Promise<UserEntity[]> {
    const userEntities = this.userRepository.create(usersArray);
    await this.userRepository.insert(userEntities);
    return userEntities;

  }

  async updateUser({ id, firstName, lastName, username, email, phone }:
    { id: number, firstName?: string, lastName?: string, username?: string, email?: string, phone?: string }):
    Promise<UpdateResult> {
    return await this.userRepository.update({
      id
    }, {
      username,
      firstName,
      lastName,
      email,
      phone
    })
  }
}