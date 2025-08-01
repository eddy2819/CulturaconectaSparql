"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIAssistantProps {
  onQueryGenerated: (query: string) => void
}

export function AIAssistant({ onQueryGenerated }: AIAssistantProps) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateQuery = async () => {
    if (!input.trim()) return

    setLoading(true)

    try {
      // Simulamos la generación de consulta SPARQL basada en texto natural
      // En una implementación real, aquí usarías una API de IA como OpenAI o Gemini
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const sparqlQuery = generateSPARQLFromText(input)
      onQueryGenerated(sparqlQuery)

      toast({
        title: "Consulta generada",
        description: "Se ha generado una consulta SPARQL basada en tu descripción.",
      })

      setInput("")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la consulta. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSPARQLFromText = (text: string): string => {
    const lowerText = text.toLowerCase()

    if (lowerText.includes("festival") || lowerText.includes("fiesta") || lowerText.includes("celebracion")) {
      return `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?festival ?festivalLabel ?lugar ?lugarLabel ?fecha WHERE {
  ?festival wdt:P31/wdt:P279* wd:Q132241 .
  ?festival wdt:P17 wd:Q736 .
  OPTIONAL { ?festival wdt:P276 ?lugar }
  OPTIONAL { ?festival wdt:P585 ?fecha }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 50`
    }

    if (lowerText.includes("comida") || lowerText.includes("plato") || lowerText.includes("gastronomia")) {
      return `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?plato ?platoLabel ?origen ?origenLabel WHERE {
  ?plato wdt:P31/wdt:P279* wd:Q746549 .
  ?plato wdt:P495 wd:Q736 .
  OPTIONAL { ?plato wdt:P276 ?origen }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 30`
    }

    if (lowerText.includes("musica") || lowerText.includes("cancion") || lowerText.includes("artista")) {
      return `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?artista ?artistaLabel ?genero ?generoLabel WHERE {
  ?artista wdt:P31 wd:Q5 .
  ?artista wdt:P27 wd:Q736 .
  ?artista wdt:P136 ?genero .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 40`
    }

    // Consulta genérica para cultura ecuatoriana
    return `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?item ?itemLabel ?tipo ?tipoLabel WHERE {
  ?item wdt:P17 wd:Q736 .
  ?item wdt:P31 ?tipo .
  FILTER(?tipo IN (wd:Q132241, wd:Q746549, wd:Q188451, wd:Q570116))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 50`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span>Asistente IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Describe lo que quieres buscar en lenguaje natural y generaré una consulta SPARQL para ti.
        </div>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: Buscar festividades religiosas en Ecuador"
          onKeyPress={(e) => e.key === "Enter" && generateQuery()}
        />

        <Button
          onClick={generateQuery}
          disabled={loading || !input.trim()}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generar Consulta
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500">
          <strong>Ejemplos:</strong>
          <ul className="mt-1 space-y-1">
            <li>• "Festividades en Quito"</li>
            <li>• "Platos típicos del Ecuador"</li>
            <li>• "Música tradicional andina"</li>
            <li>• "Lugares turísticos en Galápagos"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
