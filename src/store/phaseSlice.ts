import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "./taskSlice";

export interface Phase {
  _id: string;
  phaseTimeStart: string; // ISO string format
  phaseTimeEnd: string; // ISO string format
  tasks: Task[];
}
interface GetPhasesState {
  phases: Phase[];
  isLoading: boolean;
  error: boolean;
  errorMsg: string;
}
interface PhaseSliceState {
  getPhases: GetPhasesState;
  createPhase: GetPhasesState;
}
const initialState: PhaseSliceState = {
  getPhases: {
    phases: [],
    isLoading: false,
    error: false,
    errorMsg: "",
  },
  createPhase: {
    phases: [],
    isLoading: false,
    error: false,
    errorMsg: "",
  },
};

const phaseSlice = createSlice({
  name: "phases",
  initialState,
  reducers: {
    getPhasesStart: (state) => {
      state.getPhases.isLoading = true;
    },
    getPhasesSuccess: (state, action: PayloadAction<Phase[]>) => {
      state.getPhases.isLoading = false;
      state.getPhases.phases = action.payload;
      state.getPhases.error = false;
    },
    getPhasesFailure: (state, action: PayloadAction<string>) => {
      state.getPhases.isLoading = false;
      state.getPhases.error = true;
      state.getPhases.errorMsg = action.payload;
    },
    // Create phase
    createPhaseStart: (state) => {
      state.createPhase.isLoading = true;
    },
    createPhaseSuccess: (state, action: PayloadAction<Phase[]>) => {
      state.createPhase.isLoading = false;
      state.createPhase.phases = action.payload;
      state.createPhase.error = false;
    },
    createPhaseFailure: (state, action: PayloadAction<string>) => {
      state.createPhase.isLoading = false;
      state.createPhase.error = true;
      state.createPhase.errorMsg = action.payload;
    },
  },
});
export const { getPhasesStart, getPhasesSuccess, getPhasesFailure, createPhaseStart, createPhaseSuccess, createPhaseFailure } =
  phaseSlice.actions;
export default phaseSlice.reducer;
