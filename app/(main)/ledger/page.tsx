"use client"

import { ReactElement, useEffect, useRef, useState } from "react"
import { format, parse, isValid, addDays } from "date-fns"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Field, FieldLabel, FieldSet, FieldGroup, FieldContent, FieldLegend, FieldError } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectGroup, SelectContent } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, Calendar as CalendarIcon, CirclePlus, Pencil, Ellipsis } from "lucide-react"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxEmpty, ComboboxList, ComboboxItem } from "@/components/ui/combobox"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DeleteIcon } from "@/components/ui/delete"

import { Table, TableBody, TableHeader, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { tableFeatures, useTable, columnVisibilityFeature, columnFilteringFeature, globalFilteringFeature, createFilteredRowModel, filterFn_arrHas, columnSizingFeature, rowSortingFeature, createSortedRowModel, metaHelper, sortFn_datetime } from '@tanstack/react-table'
import type { ColumnDef, FilterFn, RowData, TableFeatures } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { compareItems } from '@tanstack/match-sorter-utils'
import { sortFn_alphanumeric } from '@tanstack/react-table'
import type { SortFn } from '@tanstack/react-table'

import { revalidateLogic, useForm } from "@tanstack/react-form-nextjs"
import * as z from "zod"

import "./_css/page.css"
import { formatter } from "@/app/_utils/currency"
import { Badge } from "@/components/ui/badge"

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    removeRow: (rowIndex: number) => void;
    setDialogValue: (dialogValue: { dialogOpen:boolean, rowId:number }) => void;
  }
}

interface FuzzyFilterMeta {
    itemRank?: RankingInfo
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, RowData> = (
    row,
    columnId,
    value,
    addMeta,
) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta?.({ itemRank })
    return itemRank.passed
}

const fuzzySort: SortFn<FuzzyFeatures, Entry> = (rowA, rowB, columnId) => {
    let dir = 0

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId].itemRank!,
            rowB.columnFiltersMeta[columnId].itemRank!,
        )
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortFn_alphanumeric(rowA, rowB, columnId) : dir
}

type Entry = {
  description: string
  envelope: string
  amount: number
  date: Date
}

const data: Array<Entry> = [
    { description: 'Thai takeout', envelope: 'rent', amount: 24, date: new Date().setMonth(3) },
    { description: 'Hardware store', envelope: 'rent', amount: 40, date: new Date().setMonth(2) },
    { description: 'Yellow Honey Wax Handstring', envelope: 'utilities', amount: 45, date: new Date().setMonth(3) },
]

const features = tableFeatures({
    columnVisibilityFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    columnSizingFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: {
        fuzzy: fuzzyFilter,
        arrHas: filterFn_arrHas,
    },
    sortFns: {
        fuzzy: fuzzySort,
        datetime: sortFn_datetime,
    },
    filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const columns: Array<ColumnDef<typeof features, Entry>> = [
  {
    id: 'timestamp',
    header: 'timestamp',
    accessorFn: (row) => row.date,
    sortFn: 'datetime',
  },
  {
    id: 'description',
    accessorFn: (row) => `${row.description} ${format(row.date, "MMM dd")}`,
    header: 'Description',
    cell: ({ row }) => {
        const { description, date } = row.original;
        return (
            <>
                <p className="text-sm font-medium">{description}</p>
                <p className="text-xs" style={{fontFamily: "var(--font-bricolage)"}}>{format(date, "MMM dd")}</p>
            </>
        )
    },
    size: 60,
  },
  {
    accessorKey: 'envelope',
    header: "Envelope",
    filterFn: "arrHas",
    size: 15
  },
  {
    // accessorKey: 'amount',
    id: 'amount',
    accessorFn: (row) => Number(row.amount),
    header: 'Amount',
    cell: (info) => <span className="font-medium" >{formatter(info.getValue<number>(), "SGD")}</span>,
    size: 15,
    sortDescFirst: false
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
        const removeRow = table.options.meta?.removeRow;

        return (
        <>
        <Button variant="secondary" size="icon" className="absolute right-4 group-hover:opacity-0 group-hover:pointer-events-none transition-opacity">
            <Ellipsis />
        </Button>
        <span className="flex justify-end gap-[0.25rem] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
            {/* <Button variant="secondary" size="icon" >
                <Pencil />
            </Button> */}
            <Button variant="destructive" size="icon" onClick={() => table.options.meta?.setDialogValue({ dialogOpen: true, rowId: row.index})}>
                <DeleteIcon />
            </Button>
        </span>
        </>
    )},
    meta: {
        align: 'right'
    },
    size: 10
  }
]

const sortItems = [
    // { label: "Sort by", value: null },
    { label: "Newest first", value: "newest", onSelect: (table) => table.getColumn('timestamp')?.toggleSorting(true, false) },
    { label: "Oldest first", value: "oldest", onSelect: (table) => table.getColumn('timestamp')?.toggleSorting(false, false) },
    { label: "Largest first", value: "largest", onSelect: (table) => table.getColumn('amount')?.toggleSorting(true, false) },
    { label: "Smallest first", value: "smallest", onSelect: (table) => table.getColumn('amount')?.toggleSorting(false, false) }
]

const toggleItems = [
    "all",
    "rent",
    "utilities"
]

const formSchema = z.object({
    date: z
        .preprocess((value) => {
            return isValid(parse(value, 'dd / MM / yyyy', new Date()))
    }, z.literal(true, "Enter a real date!")),
    description: z
        .string()
        .min(1, "You can't spend something on nothing")
        .max(32, "32 characters should be enough..."),
    amount: z
        .preprocess((value) => {
            console.log(value, ' value')
            if (value === "" || value === null || value === undefined) return undefined;
            
            return value;
        }, z.coerce.number("How did you spend that...").min(0, "That's called earning not spending...").multipleOf(0.01, "So you invented a new currency?")),
    category: z.string("Don't make me do everything"),
})

function LedgerPage() {
    const toggleRef = useRef(null)
    const entryBtnRef = useRef(null)
    const [entryState, setEntryState] = useState<boolean>(false)
    const [toggleValue, setToggleValue] = useState<string[]>(["all"])
    const [date, setDate] = useState<Date>()
    const [inputDate, setInputDate] = useState('');
    const [tabValue, setTabValue] = useState('');
    const [tableData, setTableData] = useState(() => [...data])
    const [dialogValue, setDialogValue] = useState({ dialogOpen: false, rowId: -1 })

    const handleValueChange = (e: string[]) => {
        let vals: string[];

        if (e.length == 0) {
            vals = ['all']
        } else if (e.includes("all") && !toggleValue.includes("all")) {
            vals = ['all']
        } else {
            vals = e.filter((item: string) => item != "all")
        }

        setToggleValue(vals);
        table.getColumn('envelope')?.setFilterValue(vals.filter((item: string) => item != "all"));
        const currentCategories = (table.getColumn('envelope')?.getFilterValue() as string[]) ?? []

        console.log(currentCategories)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field) => {
        let value = e.target.value.replace(/[^0-9]/g, "");
        
        if (value.length >= 8) {
            value = value.slice(0, 8)
            const parsed = parse(inputDate, 'dd / MM / yyyy', new Date());
            
            if (isValid(parsed)) {
                setDate(parsed)
            } else {
                setDate(undefined)
            }
        } else if (value.length == 0) {
            return setInputDate('')
        }

        const split = value?.match(/.{1,2}/g)
        let lastVal = ''

        if (split?.length > 3) {
            lastVal = split.pop()
        } else if ((e.target.value.replace(/[^/]/g, "").length > inputDate.replace(/[^/]/g, "").length) && e.target.value.replace(/[^/]/g, "").length < 3) {
            for (let i=0; i<split?.length; i++) {
                split[i] = split[i].padStart(2, "0")
            }
            split?.push("")
        }

        const tempDate = split?.join(' / ') + lastVal
        setInputDate(tempDate)
        field.handleChange(tempDate)
    };

    const handleEntryClick = (e) => {
        // entryBtnRef.current.setAttribute('disabled', "true")
        // setEntryState(true)
        // form.handleSubmit()
    }

    const table = useTable({
        key: 'person-table', // needed for devtools, omit if you don't want to use the devtools
        features,
        columns,
        data: tableData,
        globalFilterFn: 'fuzzy',
        defaultColumn: {
            // size: 15,
        },
        initialState: {
            columnVisibility: {
                timestamp: false
            },
            sorting: [
                { id: 'timestamp', desc: true }
            ],
        },
        meta: {
            updateDate: (rowIndex, columnId, value) => {
                setTableData(old => {
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value
                            }
                        }
                        return row
                    })
                })
            },
            removeRow: (rowIndex: number) => {
                setTableData(old => old.filter((_, index) => index !== rowIndex));
            },
            setDialogValue
        }
    })

    const form = useForm({
        defaultValues: {
            date: '',
            description: '',
            amount: '',
            category: 'uncategorized',
        },
        // validationLogic: revalidateLogic({
        //     mode: 'blur',
        //     modeAfterSubmission: 'blur',
        // }),
        validators: {
            onSubmit: formSchema
        },
        onSubmit: ({ value }) => {
            console.log(value)
            setTableData((prevData) => [{ date: parse(value.date, "dd / MM / yyyy", new Date()), description: value.description, amount: Number(value.amount), envelope: value.category }, ...prevData])
            form.reset()
            setDate(undefined)
        }
    })

    return (
        <div className="">
            <h1 className="font-bold text-4xl mb-3">Ledger</h1>
            <div className="content py-3">
                <Tabs onValueChange={setTabValue}>
                    <TabsList>
                        <TabsTrigger value="january">January</TabsTrigger>
                        <TabsTrigger value="february">February</TabsTrigger>
                    </TabsList>
                    <h3 className="font-medium text-lg">Every entry of your spending in <span className="capitalize font-semibold">{tabValue}</span></h3>
                    <Card className="mt-4 px-5 py-5">
                        <form id="addEntryForm" 
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                            onReset={(e) => {
                                e.preventDefault()
                                form.reset()
                            }}
                        >
                            <FieldLegend>Update Spending</FieldLegend>
                            <div className="flex flex-col md:flex-row sm:flex-col gap-5">
                                <Field className="grid md:grid-cols-[1fr_2fr_1fr_1fr] sm:grid-cols-[1fr_1fr] gap-4">
                                    <form.Field name="date" 
                                    validators={{
                                        onChange: ({ value }) => {
                                            return formSchema.pick({date:true}).safeParse({date: value}).error?.issues
                                        },
                                    }}
                                    children={(field) => {
                                        return (
                                            <FieldContent>
                                                <FieldLabel>Date</FieldLabel>
                                                
                                                <Popover>
                                                    <PopoverTrigger
                                                        nativeButton={false}
                                                        render={
                                                            <InputGroup>
                                                                <InputGroupInput readOnly autoComplete="off" aria-invalid={!field.state.meta.isValid} onChange={(e) => {handleDateChange(e, field);}} value={field.state.value} className="cursor-pointer" placeholder="dd/mm/yyyy"/>
                                                                <InputGroupAddon align="inline-end"><CalendarIcon /></InputGroupAddon>
                                                            </InputGroup>
                                                        }
                                                    >
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Card size="sm" className="w-fit max-w-[300px] pt-2 pb-0 rounded-sm">
                                                            <CardContent>
                                                                <Calendar className="group lockMonth p-0 " mode="single" captionLayout="label" defaultMonth={new Date().setMonth(9)} selected={date} onSelect={(e) => {setDate(e);const selectedDate = format(e ?? new Date(), "dd / MM / yyyy");setInputDate(selectedDate);field.handleChange(selectedDate)}} />
                                                            </CardContent>
                                                            <CardFooter className="bg-blue-50/40 pb-4 rounded-none w-full flex flex-wrap gap-2 border-t">
                                                                {[
                                                                    { label: "Today", value: 0 },
                                                                    { label: "Tomorrow", value: 1 },
                                                                    { label: "Yesterday", value: -1 },
                                                                    // { label: "2 days ago", value: -2 },
                                                                    // { label: "3 Days ago", value: -3 },
                                                                ].map((preset) => {return (
                                                                    <Button key={preset.value} variant="outline" size='xs' className='flex-1' onClick={() => {
                                                                        const newDate = addDays(new Date(), preset.value);
                                                                        setDate(newDate);
                                                                        const formatedDate = format(newDate, "dd / MM / yyyy");
                                                                        setInputDate(formatedDate);
                                                                        field.handleChange(formatedDate);
                                                                    }}>{preset.label}</Button>
                                                                )})}
                                                            </CardFooter>
                                                        </Card>
                                                    </PopoverContent>
                                                </Popover>
                                                {!field.state.meta.isValid && (<FieldError errors={field.state.meta.errors}/>)}
                                            </FieldContent>
                                        )
                                    }} />
                                    <form.Field name="description" 
                                    validators={{
                                        onChange: ({ value }) => formSchema.pick({description:true}).safeParse({description: value}).error?.issues
                                    }}
                                    children={(field) => {
                                        return (
                                            <FieldContent>
                                                <FieldLabel>Description</FieldLabel>
                                                <Input aria-invalid={!field.state.meta.isValid} onChange={(e) => field.handleChange(e.currentTarget.value)} value={field.state.value} placeholder="What did you spend on?"></Input>
                                                {!field.state.meta.isValid && (<FieldError errors={field.state.meta.errors}/>)}
                                            </FieldContent>
                                        )
                                    }}/>
                                    <form.Field name="amount" 
                                    validators={{
                                        onChange: ({ value }) => {
                                            return formSchema.pick({amount:true}).safeParse({amount: value}).error?.issues
                                        }
                                    }}
                                    children={(field) => {
                                        return (
                                            <FieldContent>
                                                <FieldLabel>Amount</FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput autoComplete="off" aria-invalid={!field.state.meta.isValid} onChange={(e) => field.handleChange(e.target.value)} value={field.state.value} placeholder="..."/>
                                                    <InputGroupAddon align="inline-start">$</InputGroupAddon>
                                                    <InputGroupAddon align="inline-end">SGD</InputGroupAddon>
                                                </InputGroup>
                                                {!field.state.meta.isValid && (<FieldError errors={field.state.meta.errors}/>)}
                                            </FieldContent>
                                        )
                                    }}/>
                                    <form.Field name="category" children={(field) => {
                                        return (
                                            <FieldContent>
                                                <FieldLabel>Category</FieldLabel>
                                                <Combobox onValueChange={(e: string | null) => field.handleChange(e?.toLowerCase())} defaultValue="Uncategorized" value={field.state.value.charAt(0).toUpperCase() + field.state.value.slice(1).toLowerCase()} items={["uncategorized", ...toggleItems.slice(1)]}>
                                                    <ComboboxInput aria-invalid={!field.state.meta.isValid} placeholder="Select an envelope" />
                                                    <ComboboxContent>
                                                        <ComboboxEmpty>Envelope not found</ComboboxEmpty>
                                                        <ComboboxList>
                                                            {
                                                                (item) => (
                                                                    <ComboboxItem key={item} value={item == "all" ? '' : item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}>
                                                                        {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
                                                                    </ComboboxItem>
                                                                )
                                                            }
                                                        </ComboboxList>
                                                    </ComboboxContent>
                                                </Combobox>
                                                {!field.state.meta.isValid && (<FieldError errors={field.state.meta.errors}/>)}
                                            </FieldContent>
                                        )
                                    }} />
                                    
                                </Field>
                                <form.Subscribe
                                    selector={(state) => 
                                        [state.isSubmitting]
                                    }
                                >
                                    {([isSubmitting]) => (
                                        <FieldContent className="min-w-[7rem] max-w-[125px] md:mt-0 sm:mt-[-1rem]">
                                            <FieldLabel>&nbsp;</FieldLabel>
                                            <Button ref={entryBtnRef} disabled={isSubmitting} form="addEntryForm" type="submit" onClick={handleEntryClick}>
                                                {isSubmitting ? <Spinner data-icon="inline-end"/> : <CirclePlus data-icon="inline-end" />}Add Entry
                                            </Button>
                                        </FieldContent>
                                    )}
                                </form.Subscribe>
                            </div>
                        </form>
                    </Card>
                    <div className="optionsSection w-full my-3">
                        <FieldSet className="mb-3">
                            <FieldGroup>
                                <div className="gap-4 grid grid-cols-[7fr_3fr]">
                                    <Field>
                                        <FieldLabel className="mb-[-0.5rem]">Search entries</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput value={(table.state.globalFilter ?? '') as string} onChange={(value) => table.setGlobalFilter(String(value.target.value))} placeholder="Enter description or envelope"/>
                                            <InputGroupAddon><Search/></InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field>
                                        <FieldLabel className="mb-[-0.5rem]">Sort</FieldLabel>
                                        <Select items={sortItems} defaultValue={"newest"} onValueChange={(e) => sortItems.find((sort) => sort.value == e)?.onSelect(table)}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent alignItemWithTrigger={false}>
                                                <SelectGroup>
                                                {sortItems.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                    </SelectItem>
                                                ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>
                            </FieldGroup>
                        </FieldSet>
                        <ToggleGroup className="flex flex-wrap" value={toggleValue} ref={toggleRef} onValueChange={handleValueChange} multiple defaultValue={["all"]} variant="outline" size="sm">
                            {
                                toggleItems.map((toggleItem, index) => {
                                    return <ToggleGroupItem className="aria-pressed:bg-marigold-100/60" key={index} value={toggleItem.toLowerCase()}>{toggleItem.charAt(0).toUpperCase() + toggleItem.slice(1).toLowerCase()}</ToggleGroupItem>
                                })
                            }
                        </ToggleGroup>
                    </div>
                    <Card className="h-full rounded-sm py-1 relative after:top-0 after:left-4 after:w-[5px] after:h-full after:border-x-1 after:border-red-200 after:absolute">
                        <Table className="">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} style={{ width: `${header.getSize()}%`, textAlign: (header.column.columnDef.meta as any)?.align ?? 'left'}} className="first:pl-9 last:pr-4 uppercase font-mono text-orange-600">
                                                {header.isPlaceholder ? null : (
                                                    <table.FlexRender header={header} />
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} className="group">
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell className={"first:pl-9  last:pr-4 last:relative" + (cell.id.includes('description') ? 'truncate' : '')}  style={{ width: `${cell.column.getSize()}%`}} key={cell.id}>
                                                    {cell.id.includes("envelope") ? <Badge variant="secondary" className="capitalize rounded-xs border-blue-200"><table.FlexRender cell={cell} /></Badge> :
                                                        <table.FlexRender cell={cell} />
                                                    }
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-15 text-foreground/50 font-medium italic text-center">
                                            No results...
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </Tabs>
                <Dialog open={dialogValue.dialogOpen} onOpenChange={() => setDialogValue({ dialogOpen: false, rowId: -1 })}>
                    <DialogContent className="sm:max-w-sm p-5">
                        <DialogHeader>
                            <DialogTitle className="text-base mb-[-0.25rem]">Delete this entry?</DialogTitle>
                            <DialogDescription className="mb-2">Are you trying to hide your spending trace 🤨</DialogDescription>
                            <DialogDescription className="text-destructive font-medium">This action is not reversible</DialogDescription>
                            <Button variant={"destructive"} onClick={() => {table.options.meta?.removeRow(dialogValue.rowId);setDialogValue({ dialogOpen: false, rowId: -1 });}}>Delete</Button>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default LedgerPage