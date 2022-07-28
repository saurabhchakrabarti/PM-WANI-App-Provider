import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { kcAdminClient } from "../keycloak/keycloak-admin-client";

interface customUserRepresentation extends UserRepresentation {
  preferredPayment: string,
  waniPassword: string,
  phoneNumber: string,
}

export class User {


  static async getUserById(id: string) {
    const user = await kcAdminClient.users.findOne({
      id
    }) as customUserRepresentation
    return user;
  }

  static async getUserByUsername(username: string) {
    const users = await kcAdminClient.users.find({
      username
    }) as customUserRepresentation[]
    return users[0];
  }

  static async createUser({ firstName, lastName, username, email, password, phone, preferredPayment }:
    { firstName: string, lastName: string, username: string, email?: string, password: string, phone: string, preferredPayment?: string }) {
    return await kcAdminClient.users.create({
      username,
      email,
      firstName,
      lastName,
      credentials: [{
        type: "password",
        value: password,
        temporary: false
      }],
      attributes: {
        phone,
        preferredPayment
      },
      // enabled required to be true in order to send actions email
      emailVerified: true,
      enabled: true,
      realmRoles: ['app-user']
    });


  }

  // TODO
  static async createBulkUsers(usersArray: { firstName: string, lastName: string, username: string, email: string, password: string, phone: string, preferredPayment: string }[]) {
  }

  static async updateUser({ id, ...updates }:
    { id: string, firstName?: string, lastName?: string, username?: string, email?: string, phone?: string, preferredPayment?: string }) {

    await kcAdminClient.users.update({
      id,
    }, {
      ...updates
    });
  }
}