import { BcryptUtils } from './bcrypt';

describe('BcryptUtils', () => {
  const password = 'plainPassword';
  let hashedPassword: string;

  beforeAll(() => {
    hashedPassword = BcryptUtils.hashPassword(password);
  });

  describe('hashPassword', () => {
    it('should hash a plain text password', () => {
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(password);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for matching passwords', () => {
      const isMatch = BcryptUtils.comparePasswords(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching passwords', () => {
      const isMatch = BcryptUtils.comparePasswords(
        'wrongPassword',
        hashedPassword,
      );
      expect(isMatch).toBe(false);
    });
  });
});
