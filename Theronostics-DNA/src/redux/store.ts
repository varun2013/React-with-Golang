import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import CryptoJS from 'crypto-js';
// import config from '../config/config';


// // Custom storage with double encryption
// const doubleEncryptedStorage = {
//   setItem: (key: string, value: any) => {
//     const firstEncryption = CryptoJS.AES.encrypt(JSON.stringify(value), config.ENCRYPTION_KEY_1).toString();
//     const secondEncryption = CryptoJS.AES.encrypt(firstEncryption, config.ENCRYPTION_KEY_2).toString();
//     return storage.setItem(key, secondEncryption);
//   },
//   getItem: (key: string) => {
//     return storage.getItem(key).then((doubleEncrypted) => {
//       if (doubleEncrypted) {
//         const firstDecryption = CryptoJS.AES.decrypt(doubleEncrypted, config.ENCRYPTION_KEY_2).toString(CryptoJS.enc.Utf8);
//         const secondDecryption = CryptoJS.AES.decrypt(firstDecryption, config.ENCRYPTION_KEY_1).toString(CryptoJS.enc.Utf8);
//         return JSON.parse(secondDecryption);
//       }
//       return null;
//     });
//   },
//   removeItem: (key: string) => {
//     return storage.removeItem(key);
//   }
// };

// const persistConfig = {
//   key: 'root',
//   storage: doubleEncryptedStorage,
//   // Optionally, you can blacklist specific reducers if you don't want to persist them
//   // blacklist: ['someReducer']
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }),
// });

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;