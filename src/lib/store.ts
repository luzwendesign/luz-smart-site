'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LandingPageConfig, PropertyData, User } from '@/types'

interface AppStore {
  // User
  user: User | null
  setUser: (user: User | null) => void

  // Current LP being edited
  currentLP: LandingPageConfig | null
  setCurrentLP: (lp: LandingPageConfig | null) => void
  updateCurrentLP: (patch: Partial<LandingPageConfig>) => void
  updatePropertyData: (patch: Partial<PropertyData>) => void

  // All user's LPs
  landingPages: LandingPageConfig[]
  addLandingPage: (lp: LandingPageConfig) => void
  updateLandingPage: (id: string, patch: Partial<LandingPageConfig>) => void
  deleteLandingPage: (id: string) => void

  // Editor UI state
  editorTab: string
  setEditorTab: (tab: string) => void
  previewDevice: 'desktop' | 'tablet' | 'mobile'
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
  isGenerating: boolean
  setIsGenerating: (v: boolean) => void

  // Extraction step
  extractedUrl: string
  setExtractedUrl: (url: string) => void
  currentStep: number
  setCurrentStep: (step: number) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      currentLP: null,
      setCurrentLP: (lp) => set({ currentLP: lp }),
      updateCurrentLP: (patch) =>
        set((s) => ({ currentLP: s.currentLP ? { ...s.currentLP, ...patch } : null })),
      updatePropertyData: (patch) =>
        set((s) => ({
          currentLP: s.currentLP
            ? {
                ...s.currentLP,
                propertyData: { ...s.currentLP.propertyData, ...patch },
              }
            : null,
        })),

      landingPages: [],
      addLandingPage: (lp) => set((s) => ({ landingPages: [lp, ...s.landingPages] })),
      updateLandingPage: (id, patch) =>
        set((s) => ({
          landingPages: s.landingPages.map((lp) =>
            lp.id === id ? { ...lp, ...patch } : lp
          ),
        })),
      deleteLandingPage: (id) =>
        set((s) => ({ landingPages: s.landingPages.filter((lp) => lp.id !== id) })),

      editorTab: 'property',
      setEditorTab: (tab) => set({ editorTab: tab }),
      previewDevice: 'desktop',
      setPreviewDevice: (device) => set({ previewDevice: device }),
      isGenerating: false,
      setIsGenerating: (v) => set({ isGenerating: v }),

      extractedUrl: '',
      setExtractedUrl: (url) => set({ extractedUrl: url }),
      currentStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),
    }),
    {
      name: 'luz-smart-site',
      version: 3,
      migrate: (persisted: any, version: number) => {
        // Ensure all LPs have the new sections and fields added in v2/v3
        const REQUIRED_SECTIONS = [
          { id: 's4',  type: 'price_box', enabled: true, order: 4 },
          { id: 's6',  type: 'amenities', enabled: true, order: 6 },
        ]
        function migrateLp(lp: any) {
          if (!lp) return lp
          const existingTypes = (lp.sections || []).map((s: any) => s.type)
          const missing = REQUIRED_SECTIONS.filter((s) => !existingTypes.includes(s.type))
          if (missing.length > 0) {
            lp.sections = [...(lp.sections || []), ...missing]
              .sort((a: any, b: any) => a.order - b.order)
          }
          if (!lp.propertyData.availableItems) lp.propertyData.availableItems = []
          if (!lp.propertyData.unavailableItems) lp.propertyData.unavailableItems = []
          if (!lp.fontSize) lp.fontSize = 'normal'
          return lp
        }
        const state = persisted as any
        if (state.landingPages) state.landingPages = state.landingPages.map(migrateLp)
        if (state.currentLP) state.currentLP = migrateLp(state.currentLP)
        return state
      },
      partialize: (s) => ({
        user: s.user,
        landingPages: s.landingPages,
        currentLP: s.currentLP,
      }),
    }
  )
)
