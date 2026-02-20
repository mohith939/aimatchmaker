'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brief, briefSchema } from '@/lib/types';
import { submitBrief } from '@/lib/actions';
import {
  industries,
  objectives,
  geographies,
  sports,
  audiences,
  budgetRanges,
  deliverables,
} from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Progress } from '@/components/ui/progress';

const formSteps = [
  { id: 1, title: 'Campaign Basics', fields: ['brand_name', 'industry_category', 'objective'] },
  { id: 2, title: 'Audience & Targeting', fields: ['primary_geography', 'sport_preferences', 'target_audience'] },
  { id: 3, title: 'Logistics & Contact', fields: ['budget_range', 'timeline', 'deliverable_types', 'primary_contact'] },
];

export default function BriefForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Brief>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      brand_name: '',
      primary_geography: [{ state: '', city: '' }],
      sport_preferences: [],
      target_audience: [],
      deliverable_types: [],
      timeline: { from: undefined, to: undefined },
      primary_contact: { name: '', email: '', phone: '' },
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "primary_geography",
  });

  const onSubmit = async (data: Brief) => {
    setIsSubmitting(true);
    await submitBrief(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = formSteps[step - 1].fields;
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <Card className="mt-8 shadow-lg">
        <CardHeader>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline text-2xl">{formSteps[step - 1].title}</CardTitle>
                    <div className="text-sm text-muted-foreground">Step {step} of {formSteps.length}</div>
                </div>
                <Progress value={(step / formSteps.length) * 100} className="h-2" />
            </div>
        </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="brand_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PulseFuel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Objective</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="What is your main goal?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {objectives.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                <FormItem>
                    <FormLabel>Primary Geography</FormLabel>
                    <FormDescription>Select target states and cities.</FormDescription>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end">
                            <FormField
                                control={form.control}
                                name={`primary_geography.${index}.state`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {Object.keys(geographies).map(state => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`primary_geography.${index}.city`}
                                render={({ field: cityField }) => (
                                    <FormItem className="flex-1">
                                    <Select onValueChange={cityField.onChange} defaultValue={cityField.value} disabled={!form.watch(`primary_geography.${index}.state`)}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select City (Optional)" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        {(geographies[form.watch(`primary_geography.${index}.state`) as keyof typeof geographies] || []).map(city => (
                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ state: '', city: '' })}>
                        Add Location
                    </Button>
                     <FormMessage>{form.formState.errors.primary_geography?.root?.message}</FormMessage>
                </FormItem>
                <FormField
                  control={form.control}
                  name="sport_preferences"
                  render={() => (
                    <FormItem>
                      <FormLabel>Sport Preferences</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sports.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="sport_preferences"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="target_audience"
                  render={() => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {audiences.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="target_audience"
                            render={({ field }) => (
                                <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 3 && (
                <>
                    <FormField
                        control={form.control}
                        name="budget_range"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select your approximate budget" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {budgetRanges.map((item) => (
                                        <SelectItem key={item} value={item}>{item}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Campaign Timeline</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !field.value?.from && "text-muted-foreground")}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value?.from ? (
                                        field.value.to ? (
                                        <>
                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                            {format(field.value.to, "LLL dd, y")}
                                        </>
                                        ) : (
                                        format(field.value.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={field.value?.from}
                                    selected={field.value as DateRange | undefined}
                                    onSelect={(range) => field.onChange(range)}
                                    numberOfMonths={2}
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="deliverable_types"
                        render={() => (
                            <FormItem>
                            <FormLabel>Desired Deliverables</FormLabel>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {deliverables.map((item) => (
                                    <FormField
                                        key={item}
                                        control={form.control}
                                        name="deliverable_types"
                                        render={({ field }) => (
                                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...field.value, item])
                                                    : field.onChange(field.value?.filter((value) => value !== item));
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item}</FormLabel>
                                        </FormItem>
                                        )}
                                    />
                                    ))}
                                </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium font-headline">Primary Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="primary_contact.name" render={({ field }) => (
                                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="primary_contact.email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="primary_contact.phone" render={({ field }) => (
                                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            {step < formSteps.length ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Generating Matches...' : 'Get Recommendations'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
