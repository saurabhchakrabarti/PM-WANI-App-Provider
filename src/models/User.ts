import { InsertResult, UpdateResult } from "typeorm";
import { dataSource } from "../db/data-source";
import { UserEntity } from "../entities/User";


export class User {

  private static userRepository = dataSource.getRepository(UserEntity);

  static async getUserByUsername(username: string): Promise<UserEntity | null> {
    const user = await User.userRepository.findOneBy({
      username
    })
    return user;
  }

  static async getUserByCredential(username: string, password: string): Promise<UserEntity | null> {
    return await User.userRepository.findOneBy({
      username,
      password
    })

  }

  static async createUser({ firstName, lastName, username, email, password, phone, preferredPayment }:
    { firstName: string, lastName: string, username: string, email?: string, password: string, phone: string, preferredPayment?: string }):
    Promise<InsertResult> {
    return await User.userRepository.insert({
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      preferredPayment
    })
  }

  static async createBulkUsers(usersArray: { firstName: string, lastName: string, username: string, email: string, password: string, phone: string, preferredPayment: string }[]):
    Promise<UserEntity[]> {
    const userEntities = User.userRepository.create(usersArray);
    await User.userRepository.insert(userEntities);
    return userEntities;

  }

  static async updateUser({ id, ...updates }:
    { id: number, firstName?: string, lastName?: string, username?: string, email?: string, phone?: string, preferredPayment?: string }):
    Promise<UpdateResult> {
    return await User.userRepository.update({
      id
    }, {
      ...updates
    })
  }
}