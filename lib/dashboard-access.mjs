const permissions = Object.freeze({
  owner: ['social:read', 'social:write', 'campaigns:read', 'campaigns:write', 'campaigns:publish', 'motel-plus:read', 'finance:read', 'maintenance:read', 'maintenance:write', 'payroll:read', 'payroll:write'],
  editor: ['social:read', 'social:write', 'campaigns:read', 'campaigns:write'],
});

// Only a server-verified user can grant access. user_metadata is user-editable.
export async function authorizeDashboard(request, verifyUser, requiredPermission) {
  const authorization = request.headers.get('authorization') || '';
  const match = /^Bearer ([^\s]+)$/i.exec(authorization);
  if (!match || match[1].length > 8192) return { status: 401 };
  if (!verifyUser) return { status: 503 };

  let user;
  try {
    user = await verifyUser(match[1]);
  } catch {
    return { status: 503 };
  }
  if (!user?.id) return { status: 401 };
  const role = user.app_metadata?.private_motel_role;
  const capabilities = typeof role === 'string' && Object.hasOwn(permissions, role) ? permissions[role] : null;
  if (!capabilities || (requiredPermission && !capabilities.includes(requiredPermission))) {
    return { status: 403 };
  }
  return { status: 200, userId: user.id, role, capabilities: [...capabilities] };
}
