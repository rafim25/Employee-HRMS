export const checkUserPermission = (item, currentUser) => {
    if (!item || !currentUser) return false;
    
    // Check if user is the creator
    const isCreator = item.created_by_id === currentUser.user_id;
    
    // Add admin check if you have admin roles
    const isAdmin = currentUser.role === 'admin';
    
    return isCreator || isAdmin;
}; 