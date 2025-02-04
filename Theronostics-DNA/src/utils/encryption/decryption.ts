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
 * Performs double decryption similar to the Go implementation
 * @param encryptedText Base64 encrypted text
 * @returns Decrypted plaintext
 */
export const decrypt = (encryptedText: string): string => {
  try {
    // Prepare keys for Base64 encoding
    const key1Base64 = encryptionConfig.key1;
    const key2Base64 = encryptionConfig.key2;

    // Convert keys to WordArray
    const key1 = CryptoJS.enc.Base64.parse(key1Base64);
    const key2 = CryptoJS.enc.Base64.parse(key2Base64);

    // First decryption with key2
    const iv2 = extractIV(key2Base64);
    
    const decrypted2 = CryptoJS.AES.decrypt(encryptedText, key2, {
      iv: iv2,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convert decrypted2 to string
    const decrypted2Str = decrypted2.toString(CryptoJS.enc.Utf8);

    // Second decryption with key1
    const iv1 = extractIV(key1Base64);
    
    const decrypted1 = CryptoJS.AES.decrypt(decrypted2Str, key1, {
      iv: iv1,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convert to UTF-8 string
    return decrypted1.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed", error);
    throw error;
  }
};