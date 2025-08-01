import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function LoadingSpinner() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
          <div className="space-y-2">
            <div className="font-medium">Ejecutando consulta...</div>
            <div className="text-sm text-gray-500">Buscando datos en Wikidata</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
