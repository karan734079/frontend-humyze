import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const extractTextFromFile = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          text += textContent.items.map(s => s.str).join(' ') + '\n';
        }
        resolve(text);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } else {
        reject(new Error('Unsupported file type'));
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const uploadFile = createAsyncThunk(
  'report/upload',
  async (file, thunkAPI) => {
    try {
      const user = (await supabase.auth.getUser()).data?.user;
      if (!user) throw new Error("User not authenticated");

      const text = await extractTextFromFile(file);

      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('uploads')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      // Get public URL or private signed URL (we use signed URL for private or just passing the path)
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
      const fileUrl = urlData?.publicUrl || ''; 

      // Send to detect-ai Edge Function
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('detect-ai', {
        body: {
          text,
          file_name: file.name,
          file_url: fileUrl
        }
      });

      if (edgeError) throw edgeError;

      return { reportId: edgeData.id, ...edgeData };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getReports = createAsyncThunk(
  'report/getAll',
  async (_, thunkAPI) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(d => ({
        _id: d.id,
        id: d.id,
        humanScore: d.human_score,
        aiScore: d.ai_score,
        humanizedText: d.humanized_text,
        originalText: d.original_text,
        aiSentences: d.ai_sentences,
        originalFileName: d.file_name,
        createdAt: d.created_at,
        confidence: d.confidence
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getReport = createAsyncThunk(
  'report/get',
  async (id, thunkAPI) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return {
        _id: data.id,
        id: data.id,
        humanScore: data.human_score,
        aiScore: data.ai_score,
        humanizedText: data.humanized_text,
        originalText: data.original_text,
        aiSentences: data.ai_sentences,
        originalFileName: data.file_name,
        createdAt: data.created_at,
        confidence: data.confidence
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const humanizeReport = createAsyncThunk(
  'report/humanize',
  async (id, thunkAPI) => {
    try {
      // First, get original text
      const reportData = thunkAPI.getState().report.currentReport;
      if (!reportData) throw new Error("No current report");

      const { data, error } = await supabase.functions.invoke('humanize-text', {
        body: {
          text: reportData.originalText,
          report_id: id
        }
      });

      if (error) throw error;
      
      return {
        humanizedText: data.rewrittenText,
        humanScore: 100, // Or whatever metric is appropriate post-humanization
        aiScore: 0
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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
