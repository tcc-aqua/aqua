import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import Link from "next/link"



export function LoginForm({
  className,
  ...props
}) {

  return (
    <form className={cn("flex flex-col gap-6 w-full max-w-lg mx-auto", className)} {...props}>
      <FieldGroup className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-white">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold">
           Bem-vindo ao Sistema Aqua!
          </h1>
          <p className="text-lg md:text-xl text-white">
            Monitore o consumo de água, atribua alertas e inative usuários.
          </p>
        </div>

        <div className="space-y-4 w-full">
          <Field>
            <Link href='./auth/email-login'>
            <Button 
              type="submit"
              className="w-full h-20 rounded-full text-lg font-semibold cursor-pointer bg-[#1d9bf0]"
              >
              Acessar minha conta
            </Button>
              </Link>
          </Field>
        </div>

      </FieldGroup>
    </form>
  );
}
