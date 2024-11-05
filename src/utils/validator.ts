export class ValidatorUtils {
  /**
   * Validates a password string based on the following criteria:
   * - At least one lowercase letter
   * - At least one uppercase letter
   * - At least one digit
   * - At least one special character
   * - Minimum length of 8 characters
   *
   * @param password - The password string to validate.
   * @returns `true` if the password meets the criteria, otherwise `false`.
   */
  static validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  }
}
