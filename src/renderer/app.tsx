import { RouterProvider } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/stores/auth"
import routes from "@/routes"
import "@/globals.css"
import "@/custom.css"
import "@/i18n/config"
import { useEffect, useState } from "react"
import { getWindowMode, setLocalStorageWindowMode } from "@/lib/utils"

export default function App() {
  const token = useAuthStore((state) => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  // Optional: you can show a loading spinner while rehydrating
  if (!hasHydrated) {
    return <div>Loading...</div>
  }

  useEffect(() => {
    const handleLogout = () => {
      window.location.reload()
    }

    const unsubscribe = window.electron.ipcRenderer.on("logout-event", handleLogout)

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    async function fetchAndStoreWindowMode() {
      const mode = await getWindowMode()
      console.log("fetchWindowMode", mode)

      setLocalStorageWindowMode(mode)
    }

    fetchAndStoreWindowMode()
  }, [])

  return (
    <AnimatePresence>
      <RouterProvider router={routes(!!token)} />
    </AnimatePresence>
  )
}
