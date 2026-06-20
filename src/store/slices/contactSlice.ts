import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

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
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.service,
          message: formData.message,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(result.message || 'Failed to submit form');
      }

      return formData;
    } catch {
      return rejectWithValue('Failed to connect to the server');
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
