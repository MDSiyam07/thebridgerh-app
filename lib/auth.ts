import bcrypt from 'bcryptjs'

export interface AdminCredentials {
  username: string
  password: string
}

export class AuthService {
  static async verifyCredentials(credentials: AdminCredentials): Promise<boolean> {
    const expectedUsername = process.env.ADMIN_USERNAME
    const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH

    if (!expectedUsername || !expectedPasswordHash) {
      // Fallback to plain text comparison for development
      return (
        credentials.username === process.env.ADMIN_USERNAME &&
        credentials.password === process.env.ADMIN_PASSWORD
      )
    }

    const usernameMatch = credentials.username === expectedUsername
    const passwordMatch = await bcrypt.compare(credentials.password, expectedPasswordHash)

    return usernameMatch && passwordMatch
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }
} 