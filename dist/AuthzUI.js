import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Settings } from 'lucide-react';
import classNames from 'classnames';
import { useAuthz } from './context';
import { SYNC_UI_ELEMENT } from './graphql';
import { AuthzManagerModal } from './AuthzManagerModal';
export const AuthzUI = ({ id, requiredPermissions = [], description, children, className }) => {
    const { authorizedUiElements, updateAuthorizedUiElements, configMode } = useAuthz();
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [syncUiElement] = useMutation(SYNC_UI_ELEMENT);
    useEffect(() => {
        // Skip sync if we already know they are authorized 
        // Note: this assumes elements don't get restricted often mid-session
        syncUiElement({
            variables: {
                input: {
                    identifier: id,
                    permissionCodes: requiredPermissions,
                    description: description || `UI Element: ${id}`
                }
            }
        }).then(result => {
            var _a, _b;
            const data = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.syncUiElement) === null || _b === void 0 ? void 0 : _b.data;
            if (data) {
                const { isAuthorized } = data;
                if (isAuthorized && !authorizedUiElements.includes(id)) {
                    updateAuthorizedUiElements([...authorizedUiElements, id]);
                }
                else if (!isAuthorized && authorizedUiElements.includes(id)) {
                    updateAuthorizedUiElements(authorizedUiElements.filter(cid => cid !== id));
                }
            }
        }).catch(err => console.error(`Failed to sync UI element ${id}:`, err));
        // We only want this to run once when the component mounts with this specific ID
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const isAuthorized = authorizedUiElements.includes(id);
    if (configMode) {
        return (React.createElement("div", { className: classNames("relative group rounded", className) },
            React.createElement("div", { className: "absolute -top-2 -right-2 z-[60] bg-[var(--color-primary,dodgerblue)] text-white rounded-full p-1 shadow-lg border-2 border-white dark:border-gray-900 cursor-pointer hover:scale-110 transition-transform", onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsManagerOpen(true);
                } },
                React.createElement(Settings, { size: 12 })),
            React.createElement("div", { className: "border-2 border-dashed border-[var(--color-primary,dodgerblue)]/40 hover:border-[var(--color-primary,dodgerblue)] transition-colors rounded" }, children),
            isManagerOpen && (React.createElement(AuthzManagerModal, { identifier: id, isOpen: isManagerOpen, onClose: () => setIsManagerOpen(false) }))));
    }
    if (!isAuthorized) {
        return null;
    }
    return children;
};
