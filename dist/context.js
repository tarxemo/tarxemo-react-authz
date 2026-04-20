import React, { createContext, useContext, useState } from 'react';
const AuthzContext = createContext(undefined);
export const AuthzProvider = ({ children, userAuthorizedUiElements, onUpdateAuthorizedUiElements }) => {
    // Check if config mode was previously on
    const [configMode, setConfigMode] = useState(() => {
        try {
            const stored = localStorage.getItem('authz_config_mode');
            return stored === 'true';
        }
        catch (_a) {
            return false;
        }
    });
    const toggleConfigMode = () => {
        setConfigMode(prev => {
            const newValue = !prev;
            try {
                localStorage.setItem('authz_config_mode', String(newValue));
            }
            catch (e) {
                console.warn('Failed to save config mode state', e);
            }
            return newValue;
        });
    };
    return (React.createElement(AuthzContext.Provider, { value: {
            configMode,
            toggleConfigMode,
            authorizedUiElements: userAuthorizedUiElements || [],
            updateAuthorizedUiElements: onUpdateAuthorizedUiElements
        } }, children));
};
export const useAuthz = () => {
    const ctx = useContext(AuthzContext);
    if (!ctx) {
        throw new Error('useAuthz must be used within an AuthzProvider');
    }
    return ctx;
};
