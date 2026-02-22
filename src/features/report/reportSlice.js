import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axios';

export const uploadFile = createAsyncThunk(
  'report/upload',
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/report/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getReports = createAsyncThunk(
  'report/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/report');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getReport = createAsyncThunk(
  'report/get',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/report/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const humanizeReport = createAsyncThunk(
  'report/humanize',
  async (id, thunkAPI) => {
    try {
      const response = await api.post(`/report/humanize/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  currentReport: null,
  reports: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetReport: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentReport = action.payload;
      })
      .addCase(getReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(humanizeReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(humanizeReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.currentReport) {
          state.currentReport.humanizedText = action.payload.humanizedText;
          state.currentReport.humanScore = action.payload.humanScore;
          state.currentReport.aiScore = action.payload.aiScore;
        }
      })
      .addCase(humanizeReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetReport } = reportSlice.actions;
export default reportSlice.reducer;
