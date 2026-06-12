import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface ContactState {
  formData: ContactFormData;
  submissions: ContactFormData[];
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

const initialState: ContactState = {
  formData: {
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  },
  submissions: [],
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,
};

// Async thunk for form submission
export const submitContactForm = createAsyncThunk(
  'contact/submitForm',
  async (formData: ContactFormData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real app, you would make an API call here
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit form');
      // }
      
      return formData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to submit form');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<ContactFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.submitError = null;
      state.submitSuccess = false;
    },
    clearSubmitStatus: (state) => {
      state.submitError = null;
      state.submitSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
        state.submissions.push(action.payload);
        state.formData = initialState.formData;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload as string;
        state.submitSuccess = false;
      });
  },
});

export const { updateFormData, resetForm, clearSubmitStatus } = contactSlice.actions;
export default contactSlice.reducer;
