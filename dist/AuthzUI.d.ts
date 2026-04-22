import React from 'react';
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
export declare const AuthzUI: React.FC<AuthzUIProps>;
