//------ Keycloak admin API ------

import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

const kcAdminClient = new KeycloakAdminClient({
  baseUrl: process.env.KEYCLOAK_BASE_URL,
  realmName: process.env.KEYCLOAK_REALM_NAME
});

export { kcAdminClient };

