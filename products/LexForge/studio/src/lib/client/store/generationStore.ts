import { create } from "zustand";
import { JobSummaryDTO, ProgressDTO, GenerationResultDTO } from "../../services/generation/dto";

interface GenerationState {
  jobs: Record<string, JobSummaryDTO>;
  progress: Record<string, ProgressDTO>;
  results: Record<string, GenerationResultDTO>;
  selectedJobId: string | null;
  globalStreamStatus: "connecting" | "connected" | "disconnected";
  
  // Actions
  setJob: (job: JobSummaryDTO) => void;
  setJobs: (jobs: JobSummaryDTO[]) => void;
  setProgress: (jobId: string, progress: ProgressDTO) => void;
  setResult: (jobId: string, result: GenerationResultDTO) => void;
  setSelectedJob: (jobId: string | null) => void;
  setGlobalStreamStatus: (status: "connecting" | "connected" | "disconnected") => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  jobs: {},
  progress: {},
  results: {},
  selectedJobId: null,
  globalStreamStatus: "disconnected",

  setJob: (job) => set((state) => ({
    jobs: { ...state.jobs, [job.id]: job }
  })),
  
  setJobs: (jobs) => set((state) => {
    const newJobs = { ...state.jobs };
    for (const job of jobs) {
      newJobs[job.id] = job;
    }
    return { jobs: newJobs };
  }),

  setProgress: (jobId, progress) => set((state) => ({
    progress: { ...state.progress, [jobId]: progress }
  })),

  setResult: (jobId, result) => set((state) => ({
    results: { ...state.results, [jobId]: result }
  })),

  setSelectedJob: (jobId) => set({ selectedJobId: jobId }),

  setGlobalStreamStatus: (status) => set({ globalStreamStatus: status })
}));
