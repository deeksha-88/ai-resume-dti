import { useSyncExternalStore } from "react";
import type { AnalysisResult } from "@/lib/api";

type State = {
  result: AnalysisResult | null;
  resumeText: string;
  jobRole: string;
  fileName: string;
};

let state: State = { result: null, resumeText: "", jobRole: "", fileName: "" };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const analysisStore = {
  getState: () => state,
  set: (patch: Partial<State>) => {
    state = { ...state, ...patch };
    emit();
  },
  reset: () => {
    state = { result: null, resumeText: "", jobRole: "", fileName: "" };
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useAnalysis() {
  return useSyncExternalStore(analysisStore.subscribe, analysisStore.getState, analysisStore.getState);
}