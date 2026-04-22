import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_UI_ELEMENT, GET_PERMISSIONS, UPDATE_UI_ELEMENT } from './graphql';
import { X, Search, Shield, Check, Info, AlertTriangle, Loader2 } from 'lucide-react';
import classNames from 'classnames';

export interface AuthzManagerModalProps {
    identifier: string;
    isOpen: boolean;
    onClose: () => void;
}

export const AuthzManagerModal: React.FC<AuthzManagerModalProps> = ({
    identifier,
    isOpen,
    onClose
}) => {
    const [description, setDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const { data: uiData, loading: uiLoading, error: uiError } = useQuery(GET_UI_ELEMENT, {
        variables: { identifier }, 
        skip: !isOpen,
        fetchPolicy: 'network-only'
    });

    const { data: permData, loading: permLoading } = useQuery(GET_PERMISSIONS, {
        variables: { filters: { searchTerm: searchTerm } },
        skip: !isOpen
    });

    const [updateUiElement] = useMutation(UPDATE_UI_ELEMENT);

    useEffect(() => {
        if (uiData?.uiElement?.data?.uiElement) {
            const el = uiData.uiElement.data.uiElement;
            setDescription(el.description || '');
            setSelectedPermissions(el.permissionCodes || []);
        }
    }, [uiData]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaveStatus('saving');
        setLocalErrors({});
        
        try {
            const { data } = await updateUiElement({
                variables: {
                    input: {
                        identifier,
                        description,
                        permissionCodes: selectedPermissions,
                        isActive: true
                    }
                }
            });

            const response = data?.updateUiElement?.response;
            
            if (response?.success) {
                setSaveStatus('success');
                setTimeout(() => {
                    setSaveStatus('idle');
                    onClose();
                }, 800);
            } else {
                setSaveStatus('error');
                // Map backend errors to local state
                const errors: Record<string, string> = {};
                response?.errors?.forEach((err: any) => {
                    errors[err.field || 'general'] = err.message;
                });
                setLocalErrors(errors);
            }
        } catch (err) {
            setSaveStatus('error');
            console.error('Failed to update UI element:', err);
        }
    };

    const togglePermission = (code: string) => {
        setSelectedPermissions(prev => 
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const filteredPermissions = permData?.permissions?.data || [];

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
             onClick={(e) => {
                 e.stopPropagation();
                 onClose();
             }}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                 onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <Shield size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security Architect</h3>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">UI Protection Control</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all hover:rotate-90"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 160px)' }}>
                    
                    {/* Identification Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} /> Element ID
                            </label>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl text-gray-700 dark:text-gray-300 font-mono text-sm">
                                {identifier}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Search size={14} /> Description
                            </label>
                            <input 
                                className={classNames(
                                    "w-full px-4 py-3 bg-white dark:bg-gray-950 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 dark:text-white text-sm",
                                    localErrors.description ? "border-red-400" : "border-gray-100 dark:border-gray-800 focus:border-blue-500"
                                )}
                                placeholder="Describe this element's purpose..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {localErrors.description && <p className="text-xs text-red-500 font-medium">{localErrors.description}</p>}
                        </div>
                    </div>

                    {/* Permissions Selection */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">Visibility Policies</h4>
                            <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full border border-blue-100 dark:border-blue-800">
                                {selectedPermissions.length} POLICIES ATTACHED
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 dark:text-white text-sm"
                                placeholder="Filter permissions by code or namespace..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Selectable Permissions List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {permLoading && (
                                <div className="col-span-2 py-12 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                    <p className="text-sm font-medium text-gray-400 italic">Consulting permission registry...</p>
                                </div>
                            )}
                            {!permLoading && filteredPermissions.map((perm: any) => {
                                const isSelected = selectedPermissions.includes(perm.code);
                                return (
                                    <div 
                                        key={perm.id}
                                        onClick={() => togglePermission(perm.code)}
                                        className={classNames(
                                            "group flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200",
                                            isSelected
                                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm"
                                                : "border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-transparent"
                                        )}
                                    >
                                        <div className="pr-2 truncate">
                                            <p className={classNames(
                                                "text-sm font-bold truncate transition-colors",
                                                isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                                            )}>
                                                {perm.code}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{perm.description || 'Global Policy'}</p>
                                        </div>
                                        <div className={classNames(
                                            "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                                            isSelected ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-transparent group-hover:text-gray-300"
                                        )}>
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                    {localErrors.general ? (
                        <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                            <AlertTriangle size={14} />
                            {localErrors.general}
                        </div>
                    ) : <div />}

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saveStatus === 'saving' || uiLoading}
                            className={classNames(
                                "px-8 py-3 rounded-2xl font-bold text-sm text-white transition-all shadow-xl flex items-center gap-2",
                                saveStatus === 'saving' ? "bg-gray-400" : 
                                saveStatus === 'success' ? "bg-emerald-500 shadow-emerald-500/20" : 
                                saveStatus === 'error' ? "bg-rose-500 shadow-rose-500/20" : 
                                "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-95"
                            )}
                        >
                            {saveStatus === 'saving' && <Loader2 size={16} className="animate-spin" />}
                            {saveStatus === 'success' && <Check size={16} />}
                            {saveStatus === 'error' && <AlertTriangle size={16} />}
                            {saveStatus === 'saving' ? 'Deploying...' : 
                             saveStatus === 'success' ? 'Deployed' : 
                             saveStatus === 'error' ? 'Retry' : 'Save Policies'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
