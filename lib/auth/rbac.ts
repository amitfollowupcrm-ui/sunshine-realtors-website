// Role-Based Access Control (RBAC) utilities
// Permission checking and authorization

import { UserRole, ROLE_PERMISSIONS } from '@/types/user.types';

interface Permission {
  resource: string;
  action: string;
}

export class RBAC {
  /**
   * Check if user has permission
   */
  static hasPermission(userRole: UserRole, permission: string): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

    // Super admin has all permissions
    if (userRole === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Check for wildcard permission
    if (rolePermissions.includes('*')) {
      return true;
    }

    // Check exact permission
    if (rolePermissions.includes(permission)) {
      return true;
    }

    // Check wildcard resource permission (e.g., 'properties:*')
    const [resource, action] = permission.split(':');
    if (action && rolePermissions.includes(`${resource}:*`)) {
      return true;
    }

    return false;
  }

  /**
   * Check if user has any of the required permissions
   */
  static hasAnyPermission(userRole: UserRole, permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }

  /**
   * Check if user has all required permissions
   */
  static hasAllPermissions(userRole: UserRole, permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }

  /**
   * Parse permission string into resource and action
   */
  static parsePermission(permission: string): Permission {
    const [resource, action] = permission.split(':');
    return { resource: resource || '', action: action || '*' };
  }

  /**
   * Check if user can access resource
   */
  static canAccessResource(
    userRole: UserRole,
    resource: string,
    action: string
  ): boolean {
    return this.hasPermission(userRole, `${resource}:${action}`);
  }

  /**
   * Check if user owns resource (userId matches)
   */
  static canAccessOwnResource(
    userRole: UserRole,
    resource: string,
    action: string,
    resourceUserId: string,
    currentUserId: string
  ): boolean {
    // Can access own resource with 'own' permission
    if (
      resourceUserId === currentUserId &&
      this.hasPermission(userRole, `${resource}:${action}:own`)
    ) {
      return true;
    }

    // Can access any resource with regular permission
    return this.hasPermission(userRole, `${resource}:${action}`);
  }

  /**
   * Get user permissions
   */
  static getUserPermissions(userRole: UserRole): string[] {
    return ROLE_PERMISSIONS[userRole] || [];
  }

  /**
   * Check if role is admin
   */
  static isAdmin(userRole: UserRole): boolean {
    return [
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ].includes(userRole);
  }

  /**
   * Check if role is internal team
   */
  static isInternalTeam(userRole: UserRole): boolean {
    return [
      UserRole.INTERNAL_SALES,
      UserRole.INTERNAL_MARKETING,
      UserRole.INTERNAL_OPS,
      UserRole.ADMIN,
      UserRole.SUPER_ADMIN,
    ].includes(userRole);
  }

  /**
   * Check if role is dealer/distributor
   */
  static isDealer(userRole: UserRole): boolean {
    return [
      UserRole.DEALER,
      UserRole.DISTRIBUTOR,
    ].includes(userRole);
  }

  /**
   * Check if role can list properties
   */
  static canListProperties(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'properties:create');
  }

  /**
   * Check if role can manage leads
   */
  static canManageLeads(userRole: UserRole): boolean {
    return this.hasAnyPermission(userRole, [
      'leads:read',
      'leads:update',
      'leads:assign',
    ]);
  }
}



