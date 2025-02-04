import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getLocalStorageData, setLocalStorageData } from "../../../utils/storage/localStorageUtils";


interface ThemeInterface {
  theme: string;
}

// Retrieve theme from local storage or set default theme
const getInitialThemeState = () => {
  const storedTheme = getLocalStorageData("theme");
  return storedTheme ? storedTheme : "light";
};

const initialState: ThemeInterface = {
  theme: getInitialThemeState(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<any>) => {
      state.theme = action.payload;
      setLocalStorageData("theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
