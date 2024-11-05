import { ValidatorUtils } from './validator';

describe('ValidatorUtils', () => {
  describe('validatePassword', () => {
    it('should return true for a valid password', () => {
      const validPassword = 'Valid1@password';
      expect(ValidatorUtils.validatePassword(validPassword)).toBe(true);
    });

    it('should return false for a password without lowercase letters', () => {
      const invalidPassword = 'INVALID1@PASSWORD';
      expect(ValidatorUtils.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for a password without uppercase letters', () => {
      const invalidPassword = 'invalid1@password';
      expect(ValidatorUtils.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for a password without digits', () => {
      const invalidPassword = 'Invalid@password';
      expect(ValidatorUtils.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for a password without special characters', () => {
      const invalidPassword = 'Invalid1password';
      expect(ValidatorUtils.validatePassword(invalidPassword)).toBe(false);
    });

    it('should return false for a password with less than 8 characters', () => {
      const invalidPassword = 'V1@p';
      expect(ValidatorUtils.validatePassword(invalidPassword)).toBe(false);
    });
  });
});
