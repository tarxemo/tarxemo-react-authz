var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_UI_ELEMENT, GET_PERMISSIONS, UPDATE_UI_ELEMENT } from './graphql';
import { X, Search, Shield, Check } from 'lucide-react';
import classNames from 'classnames';
export const AuthzManagerModal = ({ identifier, isOpen, onClose }) => {
    var _a;
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: uiData, loading: uiLoading } = useQuery(GET_UI_ELEMENT, {
        variables: { identifier },
        skip: !isOpen
    });
    const { data: permData, loading: permLoading } = useQuery(GET_PERMISSIONS, {
        variables: { search: searchTerm, pageSize: 100 },
        skip: !isOpen
    });
    const [updateUiElement, { loading: saving }] = useMutation(UPDATE_UI_ELEMENT);
    useEffect(() => {
        var _a, _b;
        if ((_b = (_a = uiData === null || uiData === void 0 ? void 0 : uiData.uiElement) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.uiElement) {
            const el = uiData.uiElement.data.uiElement;
            setDescription(el.description || '');
            setSelectedPermissions(el.permissionCodes || []);
        }
    }, [uiData]);
    if (!isOpen)
        return null;
    const handleSave = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield updateUiElement({
                variables: {
                    input: {
                        identifier,
                        description,
                        permissionCodes: selectedPermissions,
                        isActive: true
                    }
                }
            });
            onClose();
        }
        catch (err) {
            console.error('Failed to update UI element:', err);
        }
    });
    const togglePermission = (code) => {
        setSelectedPermissions(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
    };
    const filteredPermissions = ((_a = permData === null || permData === void 0 ? void 0 : permData.permissions) === null || _a === void 0 ? void 0 : _a.data) || [];
    const modalContent = (React.createElement("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: (e) => {
            e.stopPropagation();
            onClose();
        } },
        React.createElement("div", { className: "bg-[var(--color-surface,white)] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden", onClick: (e) => e.stopPropagation() },
            React.createElement("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-[var(--color-bg,#f3f4f6)]/50" },
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement("div", { className: "p-2 bg-[var(--color-primary,dodgerblue)]/10 rounded-lg text-[var(--color-primary,dodgerblue)]" },
                        React.createElement(Shield, { size: 20 })),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "text-lg font-bold text-[var(--color-text,#1f2937)]" }, "UI Permission Manager"),
                        React.createElement("p", { className: "text-xs text-[var(--color-text-muted,#6b7280)]" },
                            "Control visibility for ",
                            React.createElement("code", null, identifier)))),
                React.createElement("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" },
                    React.createElement(X, { size: 20, className: "text-[var(--color-text-muted,#6b7280)]" }))),
            React.createElement("div", { className: "p-6 space-y-6 max-h-[70vh] overflow-y-auto" },
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", { className: "flex flex-col gap-1" },
                        React.createElement("label", { className: "text-sm font-medium text-[var(--color-text,#1f2937)]" }, "Identifier (Global Name)"),
                        React.createElement("input", { className: "w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-[var(--color-text,#1f2937)] cursor-not-allowed", value: identifier, disabled: true })),
                    React.createElement("div", { className: "flex flex-col gap-1" },
                        React.createElement("label", { className: "text-sm font-medium text-[var(--color-text,#1f2937)]" }, "Description"),
                        React.createElement("input", { className: "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary,dodgerblue)] outline-none transition-shadow bg-[var(--color-surface,white)] text-[var(--color-text,#1f2937)]", placeholder: "What does this UI element do?", value: description, onChange: (e) => setDescription(e.target.value) }))),
                React.createElement("div", { className: "space-y-3" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("label", { className: "text-sm font-semibold text-[var(--color-text,#1f2937)] ml-1" }, "Authorized Permissions"),
                        React.createElement("span", { className: "text-xs text-[var(--color-primary,dodgerblue)] font-medium bg-[var(--color-primary,dodgerblue)]/10 px-2 py-0.5 rounded-full" },
                            selectedPermissions.length,
                            " selected")),
                    React.createElement("div", { className: "relative" },
                        React.createElement(Search, { size: 18, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
                        React.createElement("input", { className: "w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary,dodgerblue)] outline-none transition-shadow text-[var(--color-text,#1f2937)] bg-[var(--color-surface,white)]", placeholder: "Search permissions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })),
                    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2" },
                        permLoading && React.createElement("div", { className: "col-span-2 py-10 text-center text-sm text-[var(--color-text-muted,#6b7280)] italic" }, "Loading permissions..."),
                        !permLoading && filteredPermissions.map((perm) => (React.createElement("div", { key: perm.id, onClick: () => togglePermission(perm.code), className: classNames("flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all", selectedPermissions.includes(perm.code)
                                ? "border-[var(--color-primary,dodgerblue)] bg-[var(--color-primary,dodgerblue)]/5 shadow-sm"
                                : "border-gray-200 dark:border-gray-800 hover:border-gray-400") },
                            React.createElement("div", { className: "overflow-hidden" },
                                React.createElement("p", { className: "text-sm font-semibold text-[var(--color-text,#1f2937)] truncate" }, perm.code),
                                React.createElement("p", { className: "text-[10px] text-[var(--color-text-muted,#6b7280)] truncate" }, perm.description || 'No description')),
                            selectedPermissions.includes(perm.code) && (React.createElement("div", { className: "flex-shrink-0 bg-[var(--color-primary,dodgerblue)] text-white p-0.5 rounded-full" },
                                React.createElement(Check, { size: 12, strokeWidth: 4 }))))))))),
            React.createElement("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-[var(--color-bg,#f3f4f6)]/50 flex items-center justify-end gap-3" },
                React.createElement("button", { onClick: onClose, className: "px-4 py-2 rounded-lg font-medium text-[var(--color-text-muted,#6b7280)] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" }, "Cancel"),
                React.createElement("button", { onClick: handleSave, disabled: saving || uiLoading, className: "px-4 py-2 rounded-lg font-medium text-white bg-[var(--color-primary,dodgerblue)] hover:opacity-90 disabled:opacity-50 transition-colors flex items-center gap-2" }, saving ? 'Saving...' : 'Save Changes')))));
    return createPortal(modalContent, document.body);
};
