import CryptoJS from "crypto-js";
import config from "../../config/config";

// Configuration object (in a real app, this would come from a secure config)
const encryptionConfig = {
  key1: config.ENCRYPTION_KEY_1, // Utf8 encoded 32-byte key
  key2: config.ENCRYPTION_KEY_2, // Utf8 encoded 32-byte key
};

/**
 * Extracts first 16 bytes (IV) from a key
 * @param key Base64 encoded key
 * @returns IV as WordArray
 */
const extractIV = (key: string): CryptoJS.lib.WordArray => {
  const keyWordArray = CryptoJS.enc.Base64.parse(key);

  // Create a new WordArray with first 4 words (16 bytes)
  const ivWords = keyWordArray.words.slice(0, 4);
  return CryptoJS.lib.WordArray.create(ivWords, 16);
};

/**
 * Performs double encryption similar to the Go implementation
 * @param plaintext Text to encrypt
 * @returns Encrypted Base64 string
 */
export const encrypt = (plaintext: string): string => {
  try {
    // Prepare keys for Base64 encoding
    const key1Base64 = encryptionConfig.key1;
    const key2Base64 = encryptionConfig.key2;

    // Convert keys to WordArray
    const key1 = CryptoJS.enc.Base64.parse(key1Base64);
    const key2 = CryptoJS.enc.Base64.parse(key2Base64);

    // First encryption with key1
    const iv1 = extractIV(key1Base64);
    const encrypted1 = CryptoJS.AES.encrypt(plaintext, key1, {
      iv: iv1,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Base64 encode first encryption result
    const encrypted1B64 = encrypted1.toString();

    // Second encryption with key2
    const iv2 = extractIV(key2Base64);
    const encrypted2 = CryptoJS.AES.encrypt(encrypted1B64, key2, {
      iv: iv2,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Return Base64 encoded final ciphertext
    return encrypted2.toString();
  } catch (error) {
    console.error("Encryption failed", error);
    throw error;
  }
};
