import { createAsyncThunk } from "@reduxjs/toolkit";
import main_url from "../../service";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (url, { rejectWithValue }) => {
    try {
      const response = await main_url.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
