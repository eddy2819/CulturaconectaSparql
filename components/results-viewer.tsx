"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Download, Search, ExternalLink, Clock, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { QueryResult } from "@/app/page"

interface ResultsViewerProps {
  results: QueryResult
  query: string
  executionTime: number | null
}

function GraphVisualization({ bindings, variables }: { bindings: any[]; variables: string[] }) {
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])

  useEffect(() => {
    const nodeMap = new Map()
    const edgeSet = new Set()
    const newEdges: any[] = []

    bindings.forEach((binding, index) => {
      variables.forEach((variable) => {
        const value = binding[variable]
        if (value) {
          const nodeId = value.value
          const label = value.value.split("/").pop() || value.value

          if (!nodeMap.has(nodeId)) {
            nodeMap.set(nodeId, {
              id: nodeId,
              label: label.length > 20 ? label.substring(0, 20) + "..." : label,
              title: value.value,
              color: value.type === "uri" ? "#009688" : "#FFC107",
              shape: value.type === "uri" ? "dot" : "box",
            })
          }
        }
      })

      // Crear conexiones entre variables del mismo binding
      const bindingValues = variables.map((v) => binding[v]).filter(Boolean)
      for (let i = 0; i < bindingValues.length - 1; i++) {
        for (let j = i + 1; j < bindingValues.length; j++) {
          const from = bindingValues[i].value
          const to = bindingValues[j].value
          const edgeId = `${from}-${to}`

          if (!edgeSet.has(edgeId) && from !== to) {
            edgeSet.add(edgeId)
            newEdges.push({
              id: edgeId,
              from: from,
              to: to,
              color: "#cccccc",
              width: 1,
            })
          }
        }
      }
    })

    setNodes(Array.from(nodeMap.values()))
    setEdges(newEdges)
  }, [bindings, variables])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {nodes.length} nodos, {edges.length} conexiones
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
            <span className="text-xs">URIs</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <span className="text-xs">Literales</span>
          </div>
        </div>
      </div>

      <div className="relative h-96 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
        <SVGGraph nodes={nodes} edges={edges} />
      </div>
    </div>
  )
}

function SVGGraph({ nodes, edges }: { nodes: any[]; edges: any[] }) {
  const [selectedNode, setSelectedNode] = useState<any>(null)

  // Posicionamiento simple en círculo
  const centerX = 400
  const centerY = 200
  const radius = 150

  const positionedNodes = nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  return (
    <div className="relative w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 800 400" className="absolute inset-0">
        {/* Edges */}
        {edges.map((edge) => {
          const fromNode = positionedNodes.find((n) => n.id === edge.from)
          const toNode = positionedNodes.find((n) => n.id === edge.to)

          if (!fromNode || !toNode) return null

          return (
            <line
              key={edge.id}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={edge.color}
              strokeWidth={edge.width}
              opacity={0.6}
            />
          )
        })}

        {/* Nodes */}
        {positionedNodes.map((node) => (
          <g key={node.id}>
            {node.shape === "dot" ? (
              <circle
                cx={node.x}
                cy={node.y}
                r={8}
                fill={node.color}
                stroke="#fff"
                strokeWidth={2}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedNode(node)}
              />
            ) : (
              <rect
                x={node.x - 10}
                y={node.y - 6}
                width={20}
                height={12}
                fill={node.color}
                stroke="#fff"
                strokeWidth={2}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedNode(node)}
              />
            )}

            <text
              x={node.x}
              y={node.y + 20}
              textAnchor="middle"
              className="text-xs fill-current text-gray-700 dark:text-gray-300"
              style={{ fontSize: "10px" }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {selectedNode && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border max-w-xs">
          <div className="font-medium text-sm">{selectedNode.label}</div>
          <div className="text-xs text-gray-500 mt-1 break-all">{selectedNode.title}</div>
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export function ResultsViewer({ results, query, executionTime }: ResultsViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const { toast } = useToast()

  const bindings = results.results.bindings
  const variables = results.head.vars

  // Filtrar resultados basado en el término de búsqueda
  const filteredBindings = bindings.filter((binding) =>
    Object.values(binding).some((value) => value.value.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Paginación
  const totalPages = Math.ceil(filteredBindings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBindings = filteredBindings.slice(startIndex, startIndex + itemsPerPage)

  const exportToCSV = () => {
    const headers = variables.join(",")
    const rows = bindings.map((binding) =>
      variables
        .map((variable) => {
          const value = binding[variable]?.value || ""
          return `"${value.replace(/"/g, '""')}"`
        })
        .join(","),
    )

    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "resultados-sparql.csv"
    a.click()

    URL.revokeObjectURL(url)
    toast({
      title: "Exportado",
      description: "Los resultados han sido exportados a CSV.",
    })
  }

  const exportToJSON = () => {
    const json = JSON.stringify(results, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "resultados-sparql.json"
    a.click()

    URL.revokeObjectURL(url)
    toast({
      title: "Exportado",
      description: "Los resultados han sido exportados a JSON.",
    })
  }

  const exportQuery = () => {
    const blob = new Blob([query], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "consulta.sparql"
    a.click()

    URL.revokeObjectURL(url)
    toast({
      title: "Exportado",
      description: "La consulta SPARQL ha sido exportada.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Resultados de la Consulta</CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>{bindings.length} resultados</span>
              </div>
              {executionTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{executionTime}ms</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportQuery}>
              <Download className="w-4 h-4 mr-1" />
              Consulta
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToJSON}>
              <Download className="w-4 h-4 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="table">Tabla</TabsTrigger>
            <TabsTrigger value="graph">Grafo</TabsTrigger>
            <TabsTrigger value="enriched">Vista Enriquecida</TabsTrigger>
            <TabsTrigger value="raw">Datos Crudos</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar en resultados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary">
                {filteredBindings.length} de {bindings.length}
              </Badge>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {variables.map((variable) => (
                      <TableHead key={variable} className="font-medium">
                        {variable}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBindings.map((binding, index) => (
                    <TableRow key={index}>
                      {variables.map((variable) => {
                        const value = binding[variable]
                        return (
                          <TableCell key={variable} className="max-w-xs">
                            {value ? (
                              <div className="space-y-1">
                                <div className="truncate">
                                  {value.type === "uri" ? (
                                    <a
                                      href={value.value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-teal-600 hover:text-teal-800 flex items-center space-x-1"
                                    >
                                      <span className="truncate">{value.value.split("/").pop() || value.value}</span>
                                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    </a>
                                  ) : (
                                    <span>{value.value}</span>
                                  )}
                                </div>
                                {value["xml:lang"] && (
                                  <Badge variant="outline" className="text-xs">
                                    {value["xml:lang"]}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="graph">
            <GraphVisualization bindings={bindings} variables={variables} />
          </TabsContent>

          <TabsContent value="enriched" className="space-y-4">
            <div className="grid gap-4">
              {paginatedBindings.map((binding, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    {variables.map((variable) => {
                      const value = binding[variable]
                      if (!value) return null

                      return (
                        <div key={variable} className="flex flex-col space-y-1">
                          <div className="font-medium text-sm text-gray-700 dark:text-gray-300">{variable}</div>
                          <div>
                            {value.type === "uri" ? (
                              <a
                                href={value.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-800 flex items-center space-x-1"
                              >
                                <span>{value.value.split("/").pop() || value.value}</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <span>{value.value}</span>
                            )}
                            {value["xml:lang"] && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {value["xml:lang"]}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="raw">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm">
                <code>{JSON.stringify(results, null, 2)}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
