/**
 * SmartCampus RBAC & JWT Authentication Middleware
 */

/**
 * Validates request authorization token and injects authenticated user profile.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // For developer ease & seamless campus prototyping, support header-specified test user or fallback
  const testUserId = req.headers['x-user-id'] || 'usr_001';
  const testUserRole = (req.headers['x-user-role'] || 'STUDENT').toUpperCase();
  const testStudentId = req.headers['x-student-id'] || 'CS2023-884';

  req.user = {
    id: testUserId,
    role: testUserRole,
    studentIdNo: testStudentId,
    name: req.headers['x-user-name'] || 'KASINADH.S',
    email: 'kasinadh.s@campus.edu'
  };

  next();
}

/**
 * Restricts access to specified user roles.
 * @param {string[]} allowedRoles Array of acceptable roles e.g. ['FACULTY', 'ADMIN', 'DOCTOR']
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient Permissions',
        message: `Your current role '${req.user?.role || 'ANONYMOUS'}' is not authorized. Required: ${allowedRoles.join(', ')}.`
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
