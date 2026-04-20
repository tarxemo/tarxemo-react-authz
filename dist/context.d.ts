import React from 'react';
type AuthzContextType = {
    authorizedUiElements: string[];
    updateAuthorizedUiElements: (elements: string[]) => void;
    configMode: boolean;
    toggleConfigMode: () => void;
};
export interface AuthzProviderProps {
    children: React.ReactNode;
    userAuthorizedUiElements: string[];
    onUpdateAuthorizedUiElements: (newElements: string[]) => void;
}
export declare const AuthzProvider: React.FC<AuthzProviderProps>;
export declare const useAuthz: () => AuthzContextType;
export {};
