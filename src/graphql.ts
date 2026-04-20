import { gql } from '@apollo/client';

/** Standard response fragment to avoid repetition */
const RESPONSE_FIELDS = gql`
  fragment ResponseFields on BaseResponse {
    success
    message
    errors {
      field
      message
    }
  }
`;

export const GET_PERMISSIONS = gql`
  ${RESPONSE_FIELDS}
  query GetPermissions($filters: BaseFilterInput) {
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

export const GET_UI_ELEMENT = gql`
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

export const SYNC_UI_ELEMENT = gql`
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

export const BULK_SYNC_UI_ELEMENTS = gql`
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

export const UPDATE_UI_ELEMENT = gql`
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
