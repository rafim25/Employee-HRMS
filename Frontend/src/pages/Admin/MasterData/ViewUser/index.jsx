// When displaying permissions in the view, extract and display the type
const renderPermissions = (permissions) => {
  if (!permissions) return 'No permissions set';

  try {
    // If permissions is a string, try to parse it
    const permissionsData = typeof permissions === 'string'
      ? JSON.parse(permissions)
      : permissions;

    // Return just the type if it exists
    return permissionsData.type || 'No permissions set';
  } catch (error) {
    // If it's just a string value, return it directly
    return permissions;
  }
};

// In your JSX where you display the permissions
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Permissions
  </label>
  <div className="mt-1">
    <span className="text-gray-900 dark:text-gray-100">
      {renderPermissions(userData.permissions)}
    </span>
  </div>
</div>

// If you want to show detailed permissions, you can create a more detailed display
const renderDetailedPermissions = (permissions) => {
  if (!permissions) return 'No permissions set';

  try {
    const permissionsData = typeof permissions === 'string'
      ? JSON.parse(permissions)
      : permissions;

    return (
      <div>
        <div className="font-medium">{permissionsData.type}</div>
        {permissionsData.permissions && (
          <div className="text-sm text-gray-500">
            {permissionsData.permissions.join(', ')}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return permissions;
  }
};

// Use it in your JSX like this
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Permissions
  </label>
  <div className="mt-1">
    {renderDetailedPermissions(userData.permissions)}
  </div>
</div> 