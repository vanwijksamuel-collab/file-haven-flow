import { create } from 'zustand';

export interface VideoClip {
  id: string;
  name: string;
  file: File;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  muted: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  fadeIn: number;
  fadeOut: number;
  position: number; // Position on timeline in seconds
}

export interface Project {
  id: string;
  name: string;
  clips: VideoClip[];
  currentTime: number;
  duration: number;
  zoom: number;
  quality: '480p' | '720p' | '1080p';
}

interface VideoEditorState {
  project: Project | null;
  selectedClip: VideoClip | null;
  isPlaying: boolean;
  isLoading: boolean;
  mediaLibrary: File[];
  exportProgress: number;
  isExporting: boolean;
  
  // Actions
  createProject: (name: string) => void;
  addMediaFile: (file: File) => void;
  addClipToTimeline: (file: File, position: number) => void;
  selectClip: (clipId: string | null) => void;
  updateClip: (clipId: string, updates: Partial<VideoClip>) => void;
  deleteClip: (clipId: string) => void;
  moveClip: (clipId: string, newPosition: number) => void;
  splitClip: (clipId: string, splitTime: number) => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  setPlaying: (playing: boolean) => void;
  setQuality: (quality: '480p' | '720p' | '1080p') => void;
  setExportProgress: (progress: number) => void;
  setExporting: (exporting: boolean) => void;
}

export const useVideoEditorStore = create<VideoEditorState>((set, get) => ({
  project: null,
  selectedClip: null,
  isPlaying: false,
  isLoading: false,
  mediaLibrary: [],
  exportProgress: 0,
  isExporting: false,

  createProject: (name: string) => {
    const project: Project = {
      id: Date.now().toString(),
      name,
      clips: [],
      currentTime: 0,
      duration: 0,
      zoom: 1,
      quality: '1080p',
    };
    set({ project });
  },

  addMediaFile: (file: File) => {
    set(state => ({
      mediaLibrary: [...state.mediaLibrary, file]
    }));
  },

  addClipToTimeline: async (file: File, position: number) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;
    
    video.onloadedmetadata = () => {
      const clip: VideoClip = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        file,
        url,
        duration: video.duration,
        startTime: 0,
        endTime: video.duration,
        volume: 1,
        muted: false,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        fadeIn: 0,
        fadeOut: 0,
        position,
      };

      set(state => {
        if (!state.project) return state;
        
        const updatedClips = [...state.project.clips, clip].sort((a, b) => a.position - b.position);
        const totalDuration = Math.max(...updatedClips.map(c => c.position + c.duration), 0);
        
        return {
          project: {
            ...state.project,
            clips: updatedClips,
            duration: totalDuration,
          }
        };
      });
    };
  },

  selectClip: (clipId: string | null) => {
    const state = get();
    const clip = clipId ? state.project?.clips.find(c => c.id === clipId) || null : null;
    set({ selectedClip: clip });
  },

  updateClip: (clipId: string, updates: Partial<VideoClip>) => {
    set(state => {
      if (!state.project) return state;
      
      const updatedClips = state.project.clips.map(clip =>
        clip.id === clipId ? { ...clip, ...updates } : clip
      );
      
      return {
        project: {
          ...state.project,
          clips: updatedClips,
        },
        selectedClip: state.selectedClip?.id === clipId 
          ? { ...state.selectedClip, ...updates } 
          : state.selectedClip,
      };
    });
  },

  deleteClip: (clipId: string) => {
    set(state => {
      if (!state.project) return state;
      
      const updatedClips = state.project.clips.filter(clip => clip.id !== clipId);
      
      return {
        project: {
          ...state.project,
          clips: updatedClips,
        },
        selectedClip: state.selectedClip?.id === clipId ? null : state.selectedClip,
      };
    });
  },

  moveClip: (clipId: string, newPosition: number) => {
    set(state => {
      if (!state.project) return state;
      
      const updatedClips = state.project.clips.map(clip =>
        clip.id === clipId ? { ...clip, position: Math.max(0, newPosition) } : clip
      ).sort((a, b) => a.position - b.position);
      
      const totalDuration = Math.max(...updatedClips.map(c => c.position + c.duration), 0);
      
      return {
        project: {
          ...state.project,
          clips: updatedClips,
          duration: totalDuration,
        }
      };
    });
  },

  splitClip: (clipId: string, splitTime: number) => {
    set(state => {
      if (!state.project) return state;
      
      const clipIndex = state.project.clips.findIndex(c => c.id === clipId);
      if (clipIndex === -1) return state;
      
      const originalClip = state.project.clips[clipIndex];
      const relativeTime = splitTime - originalClip.position;
      
      if (relativeTime <= 0 || relativeTime >= originalClip.duration) return state;
      
      // First part
      const firstClip: VideoClip = {
        ...originalClip,
        id: Date.now().toString() + '_1',
        endTime: originalClip.startTime + relativeTime,
        duration: relativeTime,
      };
      
      // Second part
      const secondClip: VideoClip = {
        ...originalClip,
        id: Date.now().toString() + '_2',
        startTime: originalClip.startTime + relativeTime,
        duration: originalClip.duration - relativeTime,
        position: originalClip.position + relativeTime,
      };
      
      const updatedClips = [
        ...state.project.clips.slice(0, clipIndex),
        firstClip,
        secondClip,
        ...state.project.clips.slice(clipIndex + 1),
      ];
      
      return {
        project: {
          ...state.project,
          clips: updatedClips,
        }
      };
    });
  },

  setCurrentTime: (time: number) => {
    set(state => ({
      project: state.project ? { ...state.project, currentTime: time } : null
    }));
  },

  setZoom: (zoom: number) => {
    set(state => ({
      project: state.project ? { ...state.project, zoom } : null
    }));
  },

  setPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setQuality: (quality: '480p' | '720p' | '1080p') => {
    set(state => ({
      project: state.project ? { ...state.project, quality } : null
    }));
  },

  setExportProgress: (progress: number) => {
    set({ exportProgress: progress });
  },

  setExporting: (exporting: boolean) => {
    set({ isExporting: exporting });
  },
}));