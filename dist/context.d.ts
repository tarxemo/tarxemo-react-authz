import React from 'react';
export interface SyncRequest {
    identifier: string;
    permissionCodes: string[];
    description?: string;
}
type AuthzContextType = {
    authorizedUiElements: string[];
    updateAuthorizedUiElements: (elements: string[]) => void;
    configMode: boolean;
    toggleConfigMode: () => void;
    /** Register an element for bulk synchronization */
    registerForSync: (request: SyncRequest) => void;
};
export interface AuthzProviderProps {
    children: React.ReactNode;
    userAuthorizedUiElements: string[];
    onUpdateAuthorizedUiElements: (newElements: string[]) => void;
    /** Debounce time for bulk sync in ms (default: 50) */
    syncDebounceMs?: number;
}
export declare const AuthzProvider: React.FC<AuthzProviderProps>;
export declare const useAuthz: () => AuthzContextType;
export {};
