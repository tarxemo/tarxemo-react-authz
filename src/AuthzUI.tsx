import React, { useEffect, useState } from 'react';
import { Settings, ShieldCheck, ShieldAlert } from 'lucide-react';
import classNames from 'classnames';
import { useAuthz } from './context';
import { AuthzManagerModal } from './AuthzManagerModal';

export interface AuthzUIProps {
    /** Unique identifier for this UI element */
    id: string;
    
    /** Default permissions to associate if auto-created */
    requiredPermissions?: string[];
    
    /** Description for auto-creation */
    description?: string;

    /** 
     * Optional object ID for Policy-Based Access Control (PBAC).
     * Useful for things like 'edit-article' where permission depends on ownership.
     */
    objId?: string | number;

    /** Additional context for policy evaluation */
    context?: Record<string, any>;
    
    /** The component to protect */
    children: React.ReactElement;
    
    /** Optional class for the wrapper in config mode */
    className?: string;
}

export const AuthzUI: React.FC<AuthzUIProps> = ({
    id,
    requiredPermissions = [],
    description,
    objId,
    context,
    children,
    className
}) => {
    const { 
        authorizedUiElements, 
        configMode,
        registerForSync
    } = useAuthz();
    
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
        return (
            <div className={classNames(
                "relative group transition-all duration-300",
                isAuthorized ? "ring-2 ring-emerald-500/20" : "ring-2 ring-amber-500/20",
                className
            )}>
                {/* Status Indicator / Management Trigger */}
                <div 
                    className={classNames(
                        "absolute -top-3 -right-3 z-[100] flex items-center gap-1.5 px-2 py-1 rounded-full shadow-lg border-2 border-white dark:border-gray-900 cursor-pointer hover:scale-105 transition-all text-white font-medium text-[10px]",
                        isAuthorized ? "bg-emerald-500" : "bg-amber-500"
                    )}
                    onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         setIsManagerOpen(true);
                    }}
                >
                    {isAuthorized ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    <Settings size={10} className="ml-0.5 opacity-80" />
                </div>
                
                {/* Overlay highlight */}
                <div className={classNames(
                    "absolute inset-0 z-[50] pointer-events-none rounded transition-colors border-2 border-dashed",
                    isAuthorized 
                        ? "bg-emerald-500/5 border-emerald-500/30 group-hover:bg-emerald-500/10" 
                        : "bg-amber-500/5 border-amber-500/30 group-hover:bg-amber-500/10"
                )} />

                <div className="relative z-10">
                    {children}
                </div>

                {isManagerOpen && (
                    <AuthzManagerModal 
                        identifier={id} 
                        isOpen={isManagerOpen} 
                        onClose={() => setIsManagerOpen(false)} 
                    />
                )}
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return children;
};
