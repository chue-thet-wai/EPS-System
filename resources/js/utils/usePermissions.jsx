import React from 'react';

export function usePermissions(userPermissions = []) {
    const hasPermission = (permission) => userPermissions.includes(permission);
  
    const checkMenuPermissions = (menu) => {
      return {
        canCreate: hasPermission(`Create ${menu}`),
        canEdit: hasPermission(`Edit ${menu}`),
        canDelete: hasPermission(`Delete ${menu}`),
        canExport: hasPermission(`Export ${menu}`),
      };
    };
  
    return {
      checkMenuPermissions,
    };
  }