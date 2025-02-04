export const setLocalStorageData = (key: string, data: any) => {
  localStorage.setItem(key, btoa(JSON.stringify(data)));
};

export const clearLocalStorageData = (key: string) => {
  localStorage.removeItem(key);
};

export const deleteAllLocalStorageData = () => {
  localStorage.clear();
};

export const getLocalStorageData = (key: string) => {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) {
      return null;
    }
    const parsedData = JSON.parse(atob(storedData));
    return parsedData;
  } catch (e) {
    console.error(`Error parsing ${key} data:`, e);
    return null;
  }
};
