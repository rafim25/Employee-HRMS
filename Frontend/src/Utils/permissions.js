export const checkUserPermission = (item, currentUser) => {
    if (!item || !currentUser) return false;
    
    // Check if user is the creator
    const isCreator = item.created_by_id === currentUser.user_id;
    
    // Check if user is admin
    const isAdmin = currentUser.role === 'admin';
    
    // Check if user is in the editable_by array
    const isEditor = item.editable_by && item.editable_by.includes(currentUser.user_id);
    
    // For jobs, return true if user is creator, admin, or editor
    if (item.hasOwnProperty('editable_by')) {
        return isCreator || isAdmin || isEditor;
    }
    
    // For other items (like candidates), keep the original logic
    return isCreator || isAdmin;
}; 