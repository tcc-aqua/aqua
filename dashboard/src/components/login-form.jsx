import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Organize suas
leituras com o Skoob!
</h1>
          <p className="text-muted-foreground text-sm text-balance">
          Escolha uma das opções abaixo para continuar.
          </p>
        </div>
       
       
        <Field>
          <Button type="submit">Login</Button>
        </Field>
       
      </FieldGroup>
    </form>
  );
}
