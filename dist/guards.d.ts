import React from 'react';
export interface PermissionGuardProps {
    /** Permission code to check (e.g., "properties.create") */
    permission: string;
    /** Content to render if user doesn't have permission */
    fallback?: React.ReactNode;
    /** Content to render if user has permission */
    children: React.ReactNode;
}
/**
 * PermissionGuard Component
 *
 * Declarative component for RBAC checks.
 * Note: While identifiers are batched via SyncUI, standard permissions
 * are usually checked against the user's initial state.
 */
export declare const PermissionGuard: React.FC<PermissionGuardProps>;
/**
 * Hook for programmatic permission checking
 */
export declare const usePermissionCheck: (permission: string) => boolean;
/**
 * Higher-order component for wrapping components with permission logic
 */
export declare const withPermission: (permission: string, fallback?: React.ReactNode) => <P extends object>(Component: React.ComponentType<P>) => React.FC<P>;
