var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { BULK_SYNC_UI_ELEMENTS } from './graphql';
const AuthzContext = createContext(undefined);
export const AuthzProvider = ({ children, userAuthorizedUiElements, onUpdateAuthorizedUiElements, syncDebounceMs = 50 }) => {
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
    const [bulkSync] = useMutation(BULK_SYNC_UI_ELEMENTS);
    // Batching logic
    const syncQueue = useRef({});
    const syncTimeout = useRef(null);
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
    const processQueue = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const mutations = Object.values(syncQueue.current);
        if (mutations.length === 0)
            return;
        // Clear queue immediately to avoid duplicates during network wait
        const currentInputs = [...mutations];
        syncQueue.current = {};
        syncTimeout.current = null;
        try {
            const { data } = yield bulkSync({
                variables: { inputs: currentInputs }
            });
            if ((_b = (_a = data === null || data === void 0 ? void 0 : data.bulkSyncUiElements) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.success) {
                const results = data.bulkSyncUiElements.data.results;
                const newAuthorizedOnes = results
                    .filter((r) => r.isAuthorized)
                    .map((r) => r.uiElement.identifier);
                // Merge with existing ones (ensure uniqueness)
                const combined = Array.from(new Set([...userAuthorizedUiElements, ...newAuthorizedOnes]));
                onUpdateAuthorizedUiElements(combined);
            }
        }
        catch (err) {
            console.error('Authz: Bulk sync failed', err);
        }
    }), [bulkSync, userAuthorizedUiElements, onUpdateAuthorizedUiElements]);
    const registerForSync = useCallback((request) => {
        // Collect in queue
        syncQueue.current[request.identifier] = request;
        // Reset debounce timer
        if (syncTimeout.current)
            clearTimeout(syncTimeout.current);
        syncTimeout.current = setTimeout(processQueue, syncDebounceMs);
    }, [processQueue, syncDebounceMs]);
    return (React.createElement(AuthzContext.Provider, { value: {
            configMode,
            toggleConfigMode,
            authorizedUiElements: userAuthorizedUiElements || [],
            updateAuthorizedUiElements: onUpdateAuthorizedUiElements,
            registerForSync
        } }, children));
};
export const useAuthz = () => {
    const ctx = useContext(AuthzContext);
    if (!ctx) {
        throw new Error('useAuthz must be used within an AuthzProvider');
    }
    return ctx;
};
