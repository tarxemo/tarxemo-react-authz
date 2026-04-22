import React from 'react';
import { useAuthz } from './context';
/**
 * PermissionGuard Component
 *
 * Declarative component for RBAC checks.
 * Note: While identifiers are batched via SyncUI, standard permissions
 * are usually checked against the user's initial state.
 */
export const PermissionGuard = ({ permission, fallback = null, children }) => {
    const { authorizedUiElements } = useAuthz();
    // In many cases, we treat specific permission codes (RBAC) 
    // the same as discovered identifiers on the frontend.
    const hasPermission = authorizedUiElements.includes(permission);
    if (hasPermission) {
        return React.createElement(React.Fragment, null, children);
    }
    return React.createElement(React.Fragment, null, fallback);
};
/**
 * Hook for programmatic permission checking
 */
export const usePermissionCheck = (permission) => {
    const { authorizedUiElements } = useAuthz();
    return authorizedUiElements.includes(permission);
};
/**
 * Higher-order component for wrapping components with permission logic
 */
export const withPermission = (permission, fallback) => {
    return (Component) => {
        const WrappedComponent = (props) => (React.createElement(PermissionGuard, { permission: permission, fallback: fallback },
            React.createElement(Component, Object.assign({}, props))));
        WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name})`;
        return WrappedComponent;
    };
};
