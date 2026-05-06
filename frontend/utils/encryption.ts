import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.EXPO_PUBLIC_MESSAGING_ENCRYPTION_KEY || 'UniMateDefaultKey';

export const encrypt = (text: string): string => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (cipherText: string): string => {
  if (!cipherText || typeof cipherText !== 'string') return cipherText;
  
  // Basic check to see if it looks like AES cipher text (starts with U2FsdGVkX1)
  // or contains space (AES strings don't usually have spaces unless padded)
  if (!cipherText.startsWith('U2FsdGVkX1')) {
    return cipherText;
  }

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
