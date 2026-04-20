import { gql } from '@apollo/client';
export const GET_PERMISSIONS = gql `
  query GetPermissions($search: String, $page: Int, $pageSize: Int) {
    permissions(search: $search, page: $page, pageSize: $pageSize) {
      data {
        id
        code
        description
      }
    }
  }
`;
export const GET_UI_ELEMENT = gql `
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
    }
  }
`;
export const SYNC_UI_ELEMENT = gql `
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
    }
  }
`;
export const UPDATE_UI_ELEMENT = gql `
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
    }
  }
`;
