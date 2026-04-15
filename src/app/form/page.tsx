"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Check, Square, Printer, User, SquareCheckBig, FileText } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { amountToRomanianWords } from "@/hooks/amount-to-word";
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"


const formSchema = z.object({
  numar: z.string().min(1, "Required"),
  dataEmiterii: z.date({
    required_error: "A date of issuance is required.",
  }),
  suma: z.string().min(1, "Required"),
  platitorNume: z.string().min(1, "Required"),
  platitorIban: z.string().min(1, "Required"),
  platitorBic: z.string().min(1, "Required"),
  platitorCodFiscal: z.string().min(1, "Required"),
  platitorCodLEI: z.string(),
  prestatorPlatitor: z.string().min(1, "Required"),
  beneficiarNume: z.string().min(1, "Required"),
  beneficiarIban: z.string().min(1, "Required"),
  beneficiarBic: z.string().min(1, "Required"),
  beneficiarCodFiscal: z.string().min(1, "Required"),
  beneficiarCodLEI: z.string(),
  prestatorBeneficiar: z.string().min(1, "Required"),
  destinatiaPlatii: z.string().min(1, "Required"),
  tipTransfer: z.enum(["NORMAL", "URGENT", "INSTANT"]).default("NORMAL"),
})

type FormValues = z.infer<typeof formSchema>

export default function PaymentOrderForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numar: "",
      dataEmiterii: new Date(),
      suma: "",
      platitorNume: "",
      platitorIban: "",
      platitorCodFiscal: "",
      platitorCodLEI: "",
      platitorBic: "",
      prestatorPlatitor: "",
      beneficiarNume: "F.P.C. STIGMA-96 S.R.L.",
      beneficiarIban: "MD67EC000000225117161194",
      beneficiarBic: "ECBMMD2X",
      beneficiarCodFiscal: "1003600160500",
      beneficiarCodLEI: "",
      prestatorBeneficiar: "BC 'EuroCreditBank' S.A.",
      destinatiaPlatii: "",
      tipTransfer: "NORMAL",
    },
  })

  function onSubmit(values: FormValues) {
    window.print()
    console.log(values)
    toast.success("Ordin de plata generat cu succes!")
    form.reset()
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <SidebarInset className="bg-white">
            <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-sm font-semibold text-zinc-900">Previzualizare Ordin de Plată</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" type="submit">
                  <Printer className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                {/* <Button size="sm" type="submit" className="bg-zinc-900 hover:bg-zinc-800 text-white">
                  Finalizare Plată
                </Button> */}
              </div>
            </header>

            <div className="flex flex-1 justify-center py-2 ">
              <OrderPreview />
            </div>
          </SidebarInset>
        </form>
      </Form>
    </SidebarProvider>
  )
}

function AppSidebar() {
  const { control } = useFormContext<FormValues>()

  const normalize = (val: string): string => {
    val = val.replace(/[^\d.,]/g, "");
    const parts = val.replace(",", ".").split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    return parts.join(".");
  };
  return (
    <Sidebar variant="inset" className="border-r bg-white">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white leading-none">
            <span className="text-xs font-bold font-mono">OP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">ORDIN DE PLATĂ</span>
            <span className="text-[10px] text-muted-foreground uppercase font-medium">Configurator Document</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        {/* Document Info */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-wider text-[10px]">
            <FileText size={14} /> 1. Detalii Document
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <FormField
              control={control}
              name="numar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Număr Document</FormLabel>
                  <FormControl>
                    <Input placeholder="Nr." {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="dataEmiterii"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs">Data Emiterii</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal h-8 text-xs",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd.MM.yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}

                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="suma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Suma (LEI)</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} className="" type="text"
                      inputMode="decimal"
                      value={normalize(field.value || "")}
                      onChange={(e) => field.onChange(normalize(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="" />

        {/* Payer Info */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-zinc-900 font-bold uppercase tracking-wider text-[10px]">
            <User size={14} /> 2. Date Plătitor
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <FormField
              control={control}
              name="platitorNume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Denumire / Nume</FormLabel>
                  <FormControl>
                    <Input placeholder="Nume" {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="platitorCodFiscal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">IDNO</FormLabel>
                  <FormControl>
                    <Input placeholder="100..." {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="platitorIban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">IBAN</FormLabel>
                  <FormControl>
                    <Input placeholder="MD..." {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="platitorCodLEI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Codul LEI</FormLabel>
                  <FormControl>
                    <Input placeholder="MDL..." {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="prestatorPlatitor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Banca</FormLabel>
                  <FormControl>
                    <Input placeholder="Nume Bancă" {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="platitorBic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">BIC</FormLabel>
                  <FormControl>
                    <Input placeholder="BIC" {...field} className="" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="" />

        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-4">
            <FormField
              control={control}
              name="destinatiaPlatii"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Destinatia platii</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Factura nr..."
                      {...field}
                      className="min-h-[80px] text-sm resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="tipTransfer"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs">Tip Transfer</FormLabel>
                  <FormControl>
                    <ButtonGroup>
                      <Button
                        type="button"
                        variant={field.value === "NORMAL" ? "secondary" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => field.onChange("NORMAL")}
                      >
                        Normal
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "URGENT" ? "secondary" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => field.onChange("URGENT")}
                      >
                        Urgent
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "INSTANT" ? "secondary" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => field.onChange("INSTANT")}
                      >
                        Instant
                      </Button>
                    </ButtonGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function OrderPreview() {
  const { watch } = useFormContext<FormValues>()
  const values = watch()

  const beneficiar = {
    company: values.beneficiarNume,
    idno: values.beneficiarCodFiscal,
    bank: values.prestatorBeneficiar,
    bic: values.beneficiarBic,
    codLEI: values.beneficiarCodLEI,
    iban: values.beneficiarIban,
  }
  const platitor = {
    company: values.platitorNume,
    idno: values.platitorCodFiscal,
    bank: values.prestatorPlatitor,
    bic: values.platitorBic,
    codLEI: values.platitorCodLEI,
    iban: values.platitorIban,
  }
  const formatter = new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <Card className="p-0 w-full border-0 max-w-3xl shadow-none bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardContent className="p-2 flex flex-col gap-4">
        {/* Header Info */}
        <div className="flex justify-between pb-2 border-b-2 border-dashed border-zinc-200">
          <div className="flex flex-col gap-1">
            <LabelPreview label="Nr. Document" />
            <p className="text-md font-mono font-bold">{values.numar || "—"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <LabelPreview label="Data Emiterii" />
            <p className="text-md font-bold">
              {values.dataEmiterii ? format(values.dataEmiterii, "dd.MM.yyyy") : "—"}
            </p>
          </div>
        </div>
        <div className="flex gap-4 pb-2 border-b-2 items-end border-dashed border-zinc-200">
          <div className="flex flex-col gap-1">
            <LabelPreview label="Suma spre plata (LEI)" />
            <p className="text-xl font-bold text-zinc-900">{values.suma ? `${formatter.format(Number(values.suma))} LEI` : "0.00 LEI"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-zinc-900">{values.suma ? `${amountToRomanianWords(Number(values.suma))}` : ""}</p>
          </div>
        </div>

        {/* Platitor Section */}
        <div className="flex flex-col gap-2">
          <SectionTitle number="1" title="Plătitor" />
          <PartPreview part={platitor} />
        </div>

        {/* Beneficiar Section */}
        <div className="flex flex-col gap-2">
          <SectionTitle number="2" title="Beneficiar" />
          <PartPreview part={beneficiar} />
        </div>

        {/* Payment Details */}

        <div className="flex gap-2">
          <div className="flex flex-col gap-4 basis-2/3">
            <div className="flex flex-col gap-4 flex-1">
              <SectionTitle number="3" title="Destinatia platii" />
              <div className="bg-zinc-50 p-2 rounded-lg min-h-[100px] border border-zinc-100">
                <p className="leading-relaxed italic">{values.destinatiaPlatii || "Nicio explicație furnizată..."}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1  pt-2 border-t-2 border-zinc-400 inset-0">
              <FieldGroup className="flex flex-row items-center justify-between gap-4">
                <Field className="flex flex-col gap-2">
                  <FieldLabel>Data tranzactiei</FieldLabel>
                  <Input className="disabled:border-zinc-600" disabled />
                </Field>
                <Field>
                  <FieldLabel>Data primirii</FieldLabel>
                  <Input className="disabled:border-zinc-600" disabled />
                </Field>
                <Field>
                  <FieldLabel>Data executarii</FieldLabel>
                  <Input className="disabled:border-zinc-600" disabled />
                </Field>
              </FieldGroup>
              <div className="flex items-center gap-2">
                <div className="border-zinc-400 border rounded-lg flex-1 h-full">
                </div>
                <div className="space-y-4 text-center">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Semnătura Prestatorului</p>
                  <div className="h-20 w-full border-2 border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-[10px] text-zinc-300 uppercase font-black italic p-4">
                  </div>
                </div>
              </div>
              <FieldLabel className="text-xs font-bold">MOTIVELE REFUZULUI</FieldLabel>

            </div>
          </div>
          <div className="flex flex-col gap-4 basis-1/3">
            <SectionTitle number="4" title="Tip Transfer:" />
            <div className="flex items-center gap-2 justify-between">
              <Badge variant={values.tipTransfer === "NORMAL" ? "secondary" : "outline"}
                className={cn("", values.tipTransfer === "NORMAL" ? "bg-zinc-600 text-white font-bold" : "")}>
                NORMAL
                {values.tipTransfer === "NORMAL" ? <SquareCheckBig data-icon="inline-end" strokeWidth={2} /> : <Square data-icon="inline-end" strokeWidth={2} />}
              </Badge>
              <Badge variant={values.tipTransfer === "URGENT" ? "secondary" : "outline"}
                className={cn("", values.tipTransfer === "URGENT" ? "bg-zinc-600 text-white font-bold" : "")}>
                URGENT
                {values.tipTransfer === "URGENT" ? <SquareCheckBig data-icon="inline-end" strokeWidth={2} /> : <Square data-icon="inline-end" strokeWidth={2} />}
              </Badge>
              <Badge variant={values.tipTransfer === "INSTANT" ? "secondary" : "outline"}
                className={cn("", values.tipTransfer === "INSTANT" ? "bg-zinc-600 text-white font-bold" : "")}>
                INSTANT
                {values.tipTransfer === "INSTANT" ? <SquareCheckBig data-icon="inline-end" strokeWidth={2} /> : <Square data-icon="inline-end" strokeWidth={2} />}
              </Badge>
            </div>
            <div className="flex flex-col items-center justify-between gap-4">
              <div className="space-y-4 text-center">
                <div className="relative h-24 w-24 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-double border-zinc-100 flex items-center justify-center">
                    <div className="text-[10px] text-zinc-600 uppercase font-black text-center rotate-12">
                      L.S.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-center">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Semnătura Plătitorului</p>
                <div className="h-20 w-full border-2 border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-[10px] text-zinc-300 uppercase font-black italic p-4">
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer / Signatures */}
      </CardContent>
    </Card>
  )
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-2 border-b-2 border-zinc-400 inset-0">
      <Badge variant="secondary" className="uppercase font-bold text-white bg-zinc-500">{number}</Badge>
      <h3 className="font-bold uppercase text-sm">{title}</h3>
    </div>
  )
}

function LabelPreview({ label }: { label: string }) {
  return <p className="text-xs uppercase font-bold text-muted-foreground ">{label}</p>
}
function PartPreview({ part }: { part: { company: string; idno: string; bank: string; bic: string; codLEI: string; iban: string } }) {
  return <div className="flex gap-4">
    <div className="flex flex-col gap-4 basis-2/3">
      <div>
        <LabelPreview label="Denumire Plătitor" />
        <p className="font-bold border-b border-zinc-100 py-1">{part.company || "—"}</p>
      </div>
      <div>
        <LabelPreview label="Banca Plătitorului" />
        <p className="font-medium py-1 border-b border-zinc-100">{part.bank || "—"} / {part.bic || "—"}</p>
      </div>
    </div>
    <div className="flex flex-col gap-4 basis-1/3">
      <div>
        <LabelPreview label="Cod IDNO" />
        <p className="font-mono text-sm border-b border-zinc-100">{part.idno || "—"}</p>
      </div>
      <div>
        <LabelPreview label="Cod IBAN" />
        <p className="font-mono text-sm border-b border-zinc-100">{part.iban || "—"}</p>
      </div>
      <div>
        <LabelPreview label="Cod LEI" />
        <p className="font-mono text-sm border-b border-zinc-100">{part.codLEI || "—"}</p>
      </div>
    </div>


  </div>
}
