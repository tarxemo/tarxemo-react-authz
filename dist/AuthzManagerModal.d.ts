import React from 'react';
export interface AuthzManagerModalProps {
    identifier: string;
    isOpen: boolean;
    onClose: () => void;
}
export declare const AuthzManagerModal: React.FC<AuthzManagerModalProps>;
