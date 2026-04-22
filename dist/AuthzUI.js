import React, { useEffect, useState } from 'react';
import { Settings, ShieldCheck, ShieldAlert } from 'lucide-react';
import classNames from 'classnames';
import { useAuthz } from './context';
import { AuthzManagerModal } from './AuthzManagerModal';
export const AuthzUI = ({ id, requiredPermissions = [], description, objId, context, children, className }) => {
    const { authorizedUiElements, configMode, registerForSync } = useAuthz();
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    useEffect(() => {
        // Register for batched synchronization on mount
        registerForSync({
            identifier: id,
            permissionCodes: requiredPermissions,
            description: description || `Auto-discovered: ${id}`
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const isAuthorized = authorizedUiElements.includes(id);
    if (configMode) {
        return (React.createElement("div", { className: classNames("relative group transition-all duration-300", isAuthorized ? "ring-2 ring-emerald-500/20" : "ring-2 ring-amber-500/20", className) },
            React.createElement("div", { className: classNames("absolute inset-0 z-[50] pointer-events-none rounded transition-colors border-2 border-dashed", isAuthorized
                    ? "bg-emerald-500/5 border-emerald-500/30 group-hover:bg-emerald-500/10"
                    : "bg-amber-500/5 border-amber-500/30 group-hover:bg-amber-500/10") }),
            React.createElement("div", { className: "relative z-10" }, children),
            React.createElement("button", { type: "button", className: classNames("absolute -top-1.5 -right-1.5 flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border-2 border-white dark:border-gray-900 cursor-pointer hover:scale-110 active:scale-95 transition-all text-white font-bold text-[10px] pointer-events-auto", isAuthorized ? "bg-emerald-500 shadow-emerald-500/30" : "bg-amber-500 shadow-amber-500/30"), style: { zIndex: 99999 }, onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsManagerOpen(true);
                } },
                isAuthorized ? React.createElement(ShieldCheck, { size: 12 }) : React.createElement(ShieldAlert, { size: 12 }),
                React.createElement(Settings, { size: 10, className: "ml-0.5 opacity-90" })),
            isManagerOpen && (React.createElement(AuthzManagerModal, { identifier: id, isOpen: isManagerOpen, onClose: () => setIsManagerOpen(false) }))));
    }
    if (!isAuthorized) {
        return null;
    }
    return children;
};
