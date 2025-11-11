import { create } from 'zustand';

export const useBlogStore = create(set => ({
  selectedBlog: null,
  setSelectedBlog: blog => set({ selectedBlog: blog }),
}));
