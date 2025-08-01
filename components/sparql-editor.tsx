"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Play, Code, Copy, Share } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SPARQLEditorProps {
  query: string
  onQueryChange: (query: string) => void
  onExecute: (query: string) => void
  loading: boolean
}

export function SPARQLEditor({ query, onQueryChange, onExecute, loading }: SPARQLEditorProps) {
  const { toast } = useToast()

  const formatQuery = () => {
    // Simple SPARQL formatting
    const formatted = query
      .replace(/\s+/g, " ")
      .replace(/\s*{\s*/g, " {\n  ")
      .replace(/\s*}\s*/g, "\n}\n")
      .replace(/\s*\.\s*/g, " .\n  ")
      .replace(/SELECT/gi, "SELECT")
      .replace(/WHERE/gi, "WHERE")
      .replace(/PREFIX/gi, "PREFIX")
      .trim()

    onQueryChange(formatted)
    toast({
      title: "Consulta formateada",
      description: "La consulta SPARQL ha sido formateada correctamente.",
    })
  }

  const copyQuery = async () => {
    try {
      await navigator.clipboard.writeText(query)
      toast({
        title: "Copiado",
        description: "La consulta ha sido copiada al portapapeles.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar la consulta.",
        variant: "destructive",
      })
    }
  }

  const shareQuery = async () => {
    const encodedQuery = btoa(encodeURIComponent(query))
    const shareUrl = `${window.location.origin}?q=${encodedQuery}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Enlace copiado",
        description: "El enlace para compartir ha sido copiado al portapapeles.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Editor SPARQL</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={formatQuery}>
              <Code className="w-4 h-4 mr-1" />
              Formatear
            </Button>
            <Button variant="outline" size="sm" onClick={copyQuery}>
              <Copy className="w-4 h-4 mr-1" />
              Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={shareQuery}>
              <Share className="w-4 h-4 mr-1" />
              Compartir
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Escribe tu consulta SPARQL aquí..."
          className="min-h-[200px] font-mono text-sm"
          style={{
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          }}
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">{query.length} caracteres</div>

          <Button
            onClick={() => onExecute(query)}
            disabled={loading || !query.trim()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Ejecutar Consulta
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
