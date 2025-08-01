"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, Globe } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState("ES")

  const toggleLanguage = () => {
    setLanguage(language === "ES" ? "EN" : "ES")
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CulturaConecta</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#explorar"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Explorar
            </a>
            <a
              href="#consultas"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
            >
              Consultas sugeridas
            </a>
            <a
              href="#wikidata"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
            >
              ¿Qué es Wikidata?
            </a>
            <a href="#acerca" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400">
              Acerca de
            </a>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="hidden sm:flex">
              <Globe className="w-4 h-4 mr-1" />
              {language}
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <a href="#explorar" className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                Explorar
              </a>
              <a href="#consultas" className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                Consultas sugeridas
              </a>
              <a href="#wikidata" className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                ¿Qué es Wikidata?
              </a>
              <a href="#acerca" className="px-2 py-1 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                Acerca de
              </a>
              <Button variant="ghost" size="sm" onClick={toggleLanguage} className="justify-start px-2">
                <Globe className="w-4 h-4 mr-2" />
                Idioma: {language}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
