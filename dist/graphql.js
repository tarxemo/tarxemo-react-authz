import { gql } from "@apollo/client";
/** Standard response fragment to avoid repetition */
const RESPONSE_FIELDS = gql `
  fragment ResponseFields on BaseResponse {
    success
    message
    errors {
      field
      message
    }
  }
`;
export const GET_PERMISSIONS = gql `
  ${RESPONSE_FIELDS}
  query GetPermissions($filters: AuthzFilterInput) {
    permissions(filters: $filters) {
      data {
        id
        code
        description
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const GET_UI_ELEMENT = gql `
  ${RESPONSE_FIELDS}
  query GetUiElement($id: ID, $identifier: String) {
    uiElement(id: $id, identifier: $identifier) {
      data {
        uiElement {
          id
          identifier
          description
          isActive
          permissionCodes
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const SYNC_UI_ELEMENT = gql `
  ${RESPONSE_FIELDS}
  mutation SyncUiElement($input: SyncUIElementInput!) {
    syncUiElement(input: $input) {
      data {
        isAuthorized
        uiElement {
          id
          identifier
          description
          permissionCodes
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const BULK_SYNC_UI_ELEMENTS = gql `
  ${RESPONSE_FIELDS}
  mutation BulkSyncUiElements($inputs: [SyncUIElementInput!]!) {
    bulkSyncUiElements(inputs: $inputs) {
      data {
        results {
          isAuthorized
          uiElement {
            id
            identifier
            description
            permissionCodes
          }
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const UPDATE_UI_ELEMENT = gql `
  ${RESPONSE_FIELDS}
  mutation UpdateUiElement($input: UIElementUpdateInput!) {
    updateUiElement(input: $input) {
      data {
        uiElement {
          id
          identifier
          description
          permissionCodes
          isActive
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const LOGIN_USER = gql `
  ${RESPONSE_FIELDS}
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      data {
        user {
          id
          username
          email
          firstName
          lastName
          isActive
          isSuperuser
        }
        accessToken
        refreshToken
        authorizedUiElements
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const GET_ROLES = gql `
  ${RESPONSE_FIELDS}
  query GetRoles($filters: AuthzFilterInput) {
    roles(filters: $filters) {
      data {
        id
        name
        description
        permissionCodes
        isActive
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const GET_USERS = gql `
  query GetUsers {
    users {
      id
      username
      email
      firstName
      lastName
      isActive
      isSuperuser
    }
  }
`;
export const GET_USER_AUTH_DETAILS = gql `
  ${RESPONSE_FIELDS}
  query GetUserAuthDetails($userId: ID!) {
    userAuthorizationDetails(userId: $userId) {
      data {
        allPermissionCodes
        roles {
          id
          name
          permissionCodes
        }
        explicitPermissions {
          id
          permission {
            id
            code
            description
          }
          allow
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const CREATE_ROLE = gql `
  ${RESPONSE_FIELDS}
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      data {
        role {
          id
          name
          description
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const UPDATE_ROLE = gql `
  ${RESPONSE_FIELDS}
  mutation UpdateRole($input: RoleUpdateInput!) {
    updateRole(input: $input) {
      data {
        role {
          id
          name
          description
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const DELETE_ROLE = gql `
  ${RESPONSE_FIELDS}
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      response {
        ...ResponseFields
      }
    }
  }
`;
export const ASSIGN_ROLE = gql `
  ${RESPONSE_FIELDS}
  mutation AssignRole($input: AssignRoleInput!) {
    assignRole(input: $input) {
      response {
        ...ResponseFields
      }
    }
  }
`;
export const REVOKE_ROLE = gql `
  ${RESPONSE_FIELDS}
  mutation RevokeRole($input: RevokeRoleInput!) {
    revokeRole(input: $input) {
      response {
        ...ResponseFields
      }
    }
  }
`;
export const GRANT_PERMISSION = gql `
  ${RESPONSE_FIELDS}
  mutation GrantPermission($input: GrantPermissionInput!) {
    grantPermission(input: $input) {
      response {
        ...ResponseFields
      }
    }
  }
`;
export const DENY_PERMISSION = gql `
  ${RESPONSE_FIELDS}
  mutation DenyPermission($input: DenyPermissionInput!) {
    denyPermission(input: $input) {
      response {
        ...ResponseFields
      }
    }
  }
`;
export const REVOKE_USER_PERMISSION = gql `
  ${RESPONSE_FIELDS}
  mutation RevokeUserPermission($input: RevokeUserPermissionInput!) {
    revokeUserPermission(input: $input) {
      response {
        ...ResponseFields
      }
    }
  }
`;
export const CREATE_PERMISSION = gql `
  ${RESPONSE_FIELDS}
  mutation CreatePermission($input: PermissionInput!) {
    createPermission(input: $input) {
      data {
        permission {
          id
          code
          description
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const UPDATE_PERMISSION = gql `
  ${RESPONSE_FIELDS}
  mutation UpdatePermission($input: PermissionUpdateInput!) {
    updatePermission(input: $input) {
      data {
        permission {
          id
          code
          description
        }
      }
      response {
        ...ResponseFields
      }
    }
  }
`;
export const DELETE_PERMISSION = gql `
  ${RESPONSE_FIELDS}
  mutation DeletePermission($id: ID!) {
    deletePermission(id: $id) {
      response {
        ...ResponseFields
      }
    }
  }
`;
