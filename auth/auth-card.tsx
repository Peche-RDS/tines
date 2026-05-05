import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

// Tarjeta contenedora para formularios de autenticacion con imagen de fondo
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg relative overflow-hidden min-h-[500px] border-primary/20">
      {/* Imagen de fondo */}
      <div 
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/snoopy-bg.jpeg')",
          backgroundSize: "contain",
          backgroundPosition: "bottom left",
          backgroundRepeat: "no-repeat",
          opacity: 0.4,
        }}
      />
      
      <CardHeader className="text-center relative z-10">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base">{description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">{children}</CardContent>
    </Card>
  )
}
