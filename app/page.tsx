"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { SPARQLEditor } from "@/components/sparql-editor"
import { ResultsViewer } from "@/components/results-viewer"
import { SuggestedQueries } from "@/components/suggested-queries"
import { AIAssistant } from "@/components/ai-assistant"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorDisplay } from "@/components/error-display"

export interface QueryResult {
  head: {
    vars: string[]
  }
  results: {
    bindings: Record<string, { type: string; value: string; "xml:lang"?: string }>[]
  }
}

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [executionTime, setExecutionTime] = useState<number | null>(null)

  const executeQuery = async (sparqlQuery: string) => {
    if (!sparqlQuery.trim()) return

    setLoading(true)
    setError(null)
    setResults(null)

    const startTime = Date.now()

    try {
      const encodedQuery = encodeURIComponent(sparqlQuery)
      const url = `https://query.wikidata.org/sparql?query=${encodedQuery}&format=json`

      const response = await fetch(url, {
        headers: {
          Accept: "application/sparql-results+json",
          "User-Agent": "CulturaConecta/1.0 (https://culturaconecta.app)",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)
      setExecutionTime(Date.now() - startTime)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al ejecutar la consulta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Área principal - Centro */}
          <div className="lg:col-span-3 space-y-6">
            {/* Editor SPARQL */}
            <SPARQLEditor query={query} onQueryChange={setQuery} onExecute={executeQuery} loading={loading} />

            {/* Estado de carga */}
            {loading && <LoadingSpinner />}

            {/* Error */}
            {error && <ErrorDisplay error={error} />}

            {/* Resultados */}
            {results && <ResultsViewer results={results} query={query} executionTime={executionTime} />}
          </div>

          {/* Panel lateral - Derecha */}
          <div className="lg:col-span-1 space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              <AIAssistant onQueryGenerated={setQuery} />
              <SuggestedQueries onQuerySelect={setQuery} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
