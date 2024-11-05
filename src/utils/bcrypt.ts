import * as bcrypt from 'bcrypt';

export class BcryptUtils {
  /**
   * Hashes a plain text password using bcrypt.
   *
   * @param password - The plain text password to be hashed.
   * @returns The hashed password.
   */
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * Compares a plain text password with a hashed password.
   *
   * @param password - The plain text password to compare.
   * @param hashedPassword - The hashed password to compare against.
   * @returns `true` if the passwords match, `false` otherwise.
   */
  static comparePasswords(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
