import React from 'react';
import { useAuthz } from './context';

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
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    permission,
    fallback = null,
    children
}) => {
    const { authorizedUiElements } = useAuthz();

    // In many cases, we treat specific permission codes (RBAC) 
    // the same as discovered identifiers on the frontend.
    const hasPermission = authorizedUiElements.includes(permission);

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

/**
 * Hook for programmatic permission checking
 */
export const usePermissionCheck = (permission: string): boolean => {
    const { authorizedUiElements } = useAuthz();
    return authorizedUiElements.includes(permission);
};

/**
 * Higher-order component for wrapping components with permission logic
 */
export const withPermission = (permission: string, fallback?: React.ReactNode) => {
    return <P extends object>(Component: React.ComponentType<P>) => {
        const WrappedComponent: React.FC<P> = (props) => (
            <PermissionGuard permission={permission} fallback={fallback}>
                <Component {...props} />
            </PermissionGuard>
        );

        WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name})`;

        return WrappedComponent;
    };
};
