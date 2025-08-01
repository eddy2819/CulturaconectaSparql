"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Utensils, Calendar, MapPin, Users, Landmark } from "lucide-react"

interface SuggestedQuery {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  query: string
}

const suggestedQueries: SuggestedQuery[] = [
  {
    id: "festividades-loja",
    title: "Festividades en Loja",
    description: "Encuentra festividades y celebraciones en la provincia de Loja",
    category: "Festividades",
    icon: <Calendar className="w-4 h-4" />,
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?festival ?festivalLabel ?lugar ?lugarLabel ?fecha WHERE {
  ?festival wdt:P31/wdt:P279* wd:Q132241 .
  ?festival wdt:P276 ?lugar .
  ?lugar wdt:P131* wd:Q499085 .
  OPTIONAL { ?festival wdt:P585 ?fecha }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 50`,
  },
  {
    id: "gastronomia-ecuador",
    title: "Gastronomía Ecuatoriana",
    description: "Explora platos típicos y tradiciones culinarias del Ecuador",
    category: "Gastronomía",
    icon: <Utensils className="w-4 h-4" />,
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?plato ?platoLabel ?origen ?origenLabel ?ingredientes WHERE {
  ?plato wdt:P31/wdt:P279* wd:Q746549 .
  ?plato wdt:P495 wd:Q736 .
  OPTIONAL { ?plato wdt:P276 ?origen }
  OPTIONAL { ?plato wdt:P527 ?ingredientes }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 30`,
  },
  {
    id: "patrimonio-cultural",
    title: "Patrimonio Cultural",
    description: "Sitios y elementos del patrimonio cultural ecuatoriano",
    category: "Patrimonio",
    icon: <Landmark className="w-4 h-4" />,
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?patrimonio ?patrimonioLabel ?tipo ?tipoLabel ?ubicacion ?ubicacionLabel WHERE {
  ?patrimonio wdt:P1435 ?tipo .
  ?patrimonio wdt:P17 wd:Q736 .
  OPTIONAL { ?patrimonio wdt:P276 ?ubicacion }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 40`,
  },
  {
    id: "musica-tradicional",
    title: "Música Tradicional",
    description: "Géneros musicales y artistas tradicionales del Ecuador",
    category: "Música",
    icon: <Music className="w-4 h-4" />,
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?genero ?generoLabel ?artista ?artistaLabel ?instrumento ?instrumentoLabel WHERE {
  {
    ?genero wdt:P31/wdt:P279* wd:Q188451 .
    ?genero wdt:P495 wd:Q736 .
  } UNION {
    ?artista wdt:P31 wd:Q5 .
    ?artista wdt:P27 wd:Q736 .
    ?artista wdt:P136 ?genero .
    ?genero wdt:P31/wdt:P279* wd:Q188451 .
  }
  OPTIONAL { ?genero wdt:P1303 ?instrumento }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 35`,
  },
  {
    id: "lugares-turisticos",
    title: "Lugares Turísticos",
    description: "Destinos y atracciones turísticas principales del Ecuador",
    category: "Turismo",
    icon: <MapPin className="w-4 h-4" />,
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?lugar ?lugarLabel ?provincia ?provinciaLabel ?coordenadas WHERE {
  ?lugar wdt:P31/wdt:P279* wd:Q570116 .
  ?lugar wdt:P17 wd:Q736 .
  OPTIONAL { ?lugar wdt:P131 ?provincia }
  OPTIONAL { ?lugar wdt:P625 ?coordenadas }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 50`,
  },
  {
    id: "personajes-historicos",
    title: "Personajes Históricos",
    description: "Figuras importantes en la historia y cultura del Ecuador",
    category: "Historia",
    icon: <Users className="w-4 h-4" />,
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?persona ?personaLabel ?ocupacion ?ocupacionLabel ?nacimiento ?muerte WHERE {
  ?persona wdt:P31 wd:Q5 .
  ?persona wdt:P27 wd:Q736 .
  ?persona wdt:P106 ?ocupacion .
  OPTIONAL { ?persona wdt:P569 ?nacimiento }
  OPTIONAL { ?persona wdt:P570 ?muerte }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en" }
}
LIMIT 40`,
  },
]

interface SuggestedQueriesProps {
  onQuerySelect: (query: string) => void
}

export function SuggestedQueries({ onQuerySelect }: SuggestedQueriesProps) {
  const categories = [...new Set(suggestedQueries.map((q) => q.category))]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultas Sugeridas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">{category}</h4>
            {suggestedQueries
              .filter((q) => q.category === category)
              .map((query) => (
                <Button
                  key={query.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3 text-left bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => onQuerySelect(query.query)}
                >
                  <div className="flex items-start space-x-3 w-full min-w-0">
                    <div className="mt-0.5 text-teal-600 flex-shrink-0">{query.icon}</div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="font-medium text-sm truncate">{query.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{query.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        ))}
      </CardContent>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          hyphens: auto;
        }
      `}</style>
    </Card>
  )
}
