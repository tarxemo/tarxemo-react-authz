import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { BULK_SYNC_UI_ELEMENTS } from './graphql';

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

const AuthzContext = createContext<AuthzContextType | undefined>(undefined);

export interface AuthzProviderProps {
    children: React.ReactNode;
    userAuthorizedUiElements: string[];
    onUpdateAuthorizedUiElements: (newElements: string[]) => void;
    /** Debounce time for bulk sync in ms (default: 50) */
    syncDebounceMs?: number;
}

export const AuthzProvider: React.FC<AuthzProviderProps> = ({ 
    children, 
    userAuthorizedUiElements,
    onUpdateAuthorizedUiElements,
    syncDebounceMs = 50
}) => {
    // Check if config mode was previously on
    const [configMode, setConfigMode] = useState<boolean>(() => {
        try {
            const stored = localStorage.getItem('authz_config_mode');
            return stored === 'true';
        } catch {
            return false;
        }
    });

    const [bulkSync] = useMutation(BULK_SYNC_UI_ELEMENTS);
    
    // Batching logic
    const syncQueue = useRef<Record<string, SyncRequest>>({});
    const syncTimeout = useRef<NodeJS.Timeout | null>(null);

    const toggleConfigMode = () => {
        setConfigMode(prev => {
            const newValue = !prev;
            try {
                localStorage.setItem('authz_config_mode', String(newValue));
            } catch (e) {
                console.warn('Failed to save config mode state', e);
            }
            return newValue;
        });
    };

    const processQueue = useCallback(async () => {
        const mutations = Object.values(syncQueue.current);
        if (mutations.length === 0) return;

        // Clear queue immediately to avoid duplicates during network wait
        const currentInputs = [...mutations];
        syncQueue.current = {};
        syncTimeout.current = null;

        try {
            const { data } = await bulkSync({
                variables: { inputs: currentInputs }
            });

            if (data?.bulkSyncUiElements?.response?.success) {
                const results = data.bulkSyncUiElements.data.results;
                const newAuthorizedOnes = results
                    .filter((r: any) => r.isAuthorized)
                    .map((r: any) => r.uiElement.identifier);
                
                // Merge with existing ones (ensure uniqueness)
                const combined = Array.from(new Set([...userAuthorizedUiElements, ...newAuthorizedOnes]));
                onUpdateAuthorizedUiElements(combined);
            }
        } catch (err) {
            console.error('Authz: Bulk sync failed', err);
        }
    }, [bulkSync, userAuthorizedUiElements, onUpdateAuthorizedUiElements]);

    const registerForSync = useCallback((request: SyncRequest) => {
        // Collect in queue
        syncQueue.current[request.identifier] = request;

        // Reset debounce timer
        if (syncTimeout.current) clearTimeout(syncTimeout.current);
        syncTimeout.current = setTimeout(processQueue, syncDebounceMs);
    }, [processQueue, syncDebounceMs]);

    return (
        <AuthzContext.Provider value={{ 
            configMode, 
            toggleConfigMode,
            authorizedUiElements: userAuthorizedUiElements || [],
            updateAuthorizedUiElements: onUpdateAuthorizedUiElements,
            registerForSync
        }}>
            {children}
        </AuthzContext.Provider>
    );
};

export const useAuthz = () => {
    const ctx = useContext(AuthzContext);
    if (!ctx) {
        throw new Error('useAuthz must be used within an AuthzProvider');
    }
    return ctx;
};
