import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useState, useEffect } from 'react' // Add React hooks import

type AuthStore = {
  token: string | null
  country: string | null
  language: string | null
  resultUnit: string
  setCountry: (value: string) => void
  setLanguage: (value: string) => void
  setResultUnit: (value: string) => void
  login: (token: string, country: string, language: string) => void
  logout: () => void
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      country: null,
      language: null,
      resultUnit: 'mg/dL',
      hasHydrated: false,
      login: (token: string, country: string, language: string) => set(() => ({ token, country, language })),
      logout: () => set(() => ({ token: null })),
      setCountry: (value) => set(() => ({ country: value })),
      setLanguage: (value) => set(() => ({ language: value })),
      setResultUnit: (value) => set(() => ({ resultUnit: value })),
      setHasHydrated: (state: boolean) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
    },
  )
)

// Custom hook with proper typing
export const useAuth = () => {
  const store = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true)
    })
    return () => unsub()
  }, [])

  return {
    ...store,
    isHydrated,
  }
}

export { useAuthStore }
