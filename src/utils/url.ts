export class UrlUtils {
  /**
   * Generates a random short URL string consisting of 6 characters.
   * The characters can be uppercase letters, lowercase letters, or digits.
   *
   * @returns {string} A randomly generated short URL string.
   */
  static generateShortUrl(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
