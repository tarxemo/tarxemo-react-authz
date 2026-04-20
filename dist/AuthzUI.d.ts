import React from 'react';
export interface AuthzUIProps {
    /** Unique identifier for this UI element */
    id: string;
    /** Default permissions to associate if auto-created */
    requiredPermissions?: string[];
    /** Description for auto-creation */
    description?: string;
    /** The component to protect */
    children: React.ReactElement;
    /** Optional class for the wrapper in config mode */
    className?: string;
}
export declare const AuthzUI: React.FC<AuthzUIProps>;
