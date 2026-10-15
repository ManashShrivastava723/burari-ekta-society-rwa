// ============================================================
// Tests for auth role hierarchy logic
// ============================================================
import { describe, it, expect } from 'vitest';
import type { UserRole } from '../types';

// Replicate the role hierarchy from AuthContext
const ROLE_HIERARCHY: Record<UserRole, number> = {
  superAdmin: 4,
  rwaAdmin:   3,
  staff:      2,
  resident:   1,
};

function isAuthorized(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

describe('Role-based authorization', () => {
  it('superAdmin can access all roles', () => {
    expect(isAuthorized('superAdmin', 'superAdmin')).toBe(true);
    expect(isAuthorized('superAdmin', 'rwaAdmin')).toBe(true);
    expect(isAuthorized('superAdmin', 'staff')).toBe(true);
    expect(isAuthorized('superAdmin', 'resident')).toBe(true);
  });

  it('rwaAdmin cannot access superAdmin', () => {
    expect(isAuthorized('rwaAdmin', 'superAdmin')).toBe(false);
    expect(isAuthorized('rwaAdmin', 'rwaAdmin')).toBe(true);
    expect(isAuthorized('rwaAdmin', 'staff')).toBe(true);
  });

  it('staff cannot access rwaAdmin or superAdmin', () => {
    expect(isAuthorized('staff', 'superAdmin')).toBe(false);
    expect(isAuthorized('staff', 'rwaAdmin')).toBe(false);
    expect(isAuthorized('staff', 'staff')).toBe(true);
    expect(isAuthorized('staff', 'resident')).toBe(true);
  });

  it('resident can only access resident', () => {
    expect(isAuthorized('resident', 'superAdmin')).toBe(false);
    expect(isAuthorized('resident', 'rwaAdmin')).toBe(false);
    expect(isAuthorized('resident', 'staff')).toBe(false);
    expect(isAuthorized('resident', 'resident')).toBe(true);
  });
});

describe('Complaint privacy rules', () => {
  it('staff and above can access complaints', () => {
    const roles: UserRole[] = ['staff', 'rwaAdmin', 'superAdmin'];
    roles.forEach((role) => {
      expect(isAuthorized(role, 'staff')).toBe(true);
    });
  });

  it('resident cannot access complaint admin', () => {
    expect(isAuthorized('resident', 'staff')).toBe(false);
  });
});
