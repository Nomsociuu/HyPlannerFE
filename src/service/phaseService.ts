import { Dispatch } from "@reduxjs/toolkit";
import { createPhaseFailure, createPhaseStart, createPhaseSuccess, getPhasesFailure, getPhasesStart, getPhasesSuccess, Phase } from "../store/phaseSlice";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_SCHEME;

export const getPhases = async (eventId: string, dispatch: Dispatch) => {
  dispatch(getPhasesStart());
  try {
    const response = await axios.get(`${API_BASE_URL}/phases/getAllPhases/${eventId}`);
    dispatch(getPhasesSuccess(response.data as Phase[]));
  } catch (error: any) {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Error fetching phases";
    dispatch(getPhasesFailure(message));
  }
};

export const createPhase = async (eventId: string, phaseData: { phaseTimeStart: string; phaseTimeEnd: string }, dispatch: Dispatch) => {
  dispatch(createPhaseStart());
    try {
        const response = await axios.post(`${API_BASE_URL}/phases/createPhase/${eventId}`, phaseData);
        dispatch(createPhaseSuccess(response.data as Phase[]));
    } catch (error: any) {
        const message =
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "Error creating phase";
        dispatch(createPhaseFailure(message));
    }
};