import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.MESSAGING_ENCRYPTION_KEY || 'UniMateDefaultKey';

export const encrypt = (text: string): string => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (cipherText: string): string => {
  if (!cipherText) return cipherText;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) {
      // If decryption fails (e.g. not encrypted), return as is
      return cipherText;
    }
    return originalText;
  } catch (error) {
    // If decryption errors, it's likely already plain text
    return cipherText;
  }
};
