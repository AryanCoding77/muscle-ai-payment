// This is a simplified auth implementation for demonstration purposes

export async function getSession() {
  try {
    // In a real app, you would properly verify Auth0 session
    // For now, we'll just return a mock session
    return {
      user: {
        sub: 'mock-user-id',
        email: 'admin@example.com',
        name: 'Admin User'
      }
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function isUserAdmin(userId: string) {
  // In a real app, you would check against database or Auth0 roles
  // This is a placeholder implementation that allows all users
  return true;
} 