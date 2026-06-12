import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  currentPath: string;
  previousPath: string;
  history: string[];
}

const initialState: NavigationState = {
  currentPath: window.location.pathname,
  previousPath: '',
  history: [window.location.pathname],
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.previousPath = state.currentPath;
      state.currentPath = action.payload;
      if (!state.history.includes(action.payload)) {
        state.history.push(action.payload);
      }
    },
    goBack: (state) => {
      if (state.history.length > 1) {
        state.history.pop();
        const previous = state.history[state.history.length - 1];
        state.previousPath = state.currentPath;
        state.currentPath = previous;
      }
    },
    clearHistory: (state) => {
      state.history = [state.currentPath];
    },
  },
});

export const { setCurrentPath, goBack, clearHistory } = navigationSlice.actions;
export default navigationSlice.reducer;
