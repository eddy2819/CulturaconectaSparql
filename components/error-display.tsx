import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorDisplayProps {
  error: string
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error en la consulta</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
        </Alert>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <strong>Sugerencias:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Verifica la sintaxis SPARQL</li>
            <li>Asegúrate de que los prefijos estén definidos correctamente</li>
            <li>Revisa que las URIs sean válidas</li>
            <li>Intenta simplificar la consulta</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
