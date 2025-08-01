import React, { useId, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, type Control, type UseFormRegisterReturn } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useLocales } from "@/providers/LocaleProvider";
import { fetchNui } from "@/utils/fetchNui";
import type {
  ICheckbox,
  IColorInput,
  IDateInput,
  IInput,
  InputProps,
  INumber,
  ISelect,
  ISlider,
  ITextarea,
  ITimeInput,
} from "@/types";
import type { OptionValue } from "@/types";
import { CalendarIcon, Clock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerInput } from "@/components/timepicker/TimePickerInput";
import { TimePeriodSelect } from "@/components/timepicker/TimePeriodSelect";
import type { Period } from "@/components/timepicker/time-picker-utils";
import { NumberInput } from "@/components/ui/number-input";
import { MultiSelect } from "@/components/ui/mutli-select";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import InputField from "./components/input"
// import CheckboxField from "./components/checkbox"
// import SelectField from "./components/select"
// import NumberField from "./components/number"
// import SliderField from "./components/slider"
// import ColorField from "./components/color"
// import DateField from "./components/date"
// import TextareaField from "./components/textarea"
// import TimeField from "./components/time"

export type FormValues = {
  test: {
    value: any;
  }[];
};

// Utility function to format dates without dayjs
const formatDate = (date: Date | number, format?: string): string => {
  const dateObj = typeof date === "number" ? new Date(date) : date;

  if (format === "DD/MM/YYYY") {
    return dateObj.toLocaleDateString("en-GB");
  }

  // Default format
  return dateObj.toLocaleDateString();
};

export const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: "",
    rows: [
      { type: "input", label: "" },
      // { type: "date", label: "", clearable: true },
      // { type: "date-range", label: "", clearable: true },
    ],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: "test",
  });

  useNuiEvent<InputProps>("openDialog", (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(index, {
        value:
          row.type !== "checkbox"
            ? row.type === "date" || row.type === "date-range" || row.type === "time"
              ? row.default === true
                ? new Date().getTime()
                : Array.isArray(row.default)
                ? row.default
                    .map((date) => (date ? new Date(date).getTime() : null))
                    .filter((v) => v && !isNaN(v))
                : row.default && !isNaN(new Date(row.default).getTime())
                ? new Date(row.default).getTime()
                : null
              : row.default
            : row.checked,
      });
      // Backwards compat with new Select data type
      if (row.type === "select" || row.type === "multi-select") {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent("closeInputDialog", async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui("inputData");
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === "date" || row.type === "date-range") && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = formatDate(data.test[i].value, row.format);
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    console.log("InputDialog submitted:", values);
    fetchNui("inputData", values);
  });

  if (!visible) return null;

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open && fields.options?.allowCancel !== false) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="lg:max-w-sm"
        onEscapeKeyDown={(e) => {
          if (fields.options?.allowCancel === false) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg">{fields.heading}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-5">
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === "input" && (
                    <InputField
                      register={form.register(`test.${index}.value`, {
                        required: row.required,
                      })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === "checkbox" && (
                    <CheckboxField control={form.control} row={row} index={index} />
                  )}
                  {(row.type === "select" || row.type === "multi-select") && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === "number" && (
                    <NumberField control={form.control} row={row} index={index} />
                  )}
                  {row.type === "slider" && (
                    <SliderField control={form.control} row={row} index={index} />
                  )}
                  {row.type === "color" && (
                    <ColorField control={form.control} row={row} index={index} />
                  )}
                  {row.type === "time" && (
                    <TimeField control={form.control} row={row} index={index} />
                  )}
                  {row.type === "date" || row.type === "date-range" ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === "textarea" && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, {
                        required: row.required,
                      })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose()}
              disabled={fields.options?.allowCancel === false}
            >
              {locale.ui.cancel || "Cancel"}
            </Button>
            <Button type="submit">{locale.ui.confirm || "Confirm"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface FormRowRegisterProps<T> {
  register: UseFormRegisterReturn;
  row: T;
  index: number;
}

interface FormRowControlProps<T> {
  control: Control<FormValues>;
  row: T;
  index: number;
}

const InputField = ({ register, row, index }: FormRowRegisterProps<IInput>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <div>
        {row.label && (
          <Label htmlFor={`input-${index}`} className="text-xs">
            {row.label}
            {row.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        {row.description && <p className="text-xs text-muted-foreground">{row.description}</p>}
      </div>

      <div className="relative">
        {row.icon && (
          <div className="absolute grid place-items-center left-3 top-1/2 -translate-y-1/2">
            <span className={`${row.icon} w-4 h-4`} />
          </div>
        )}

        <Input
          {...register}
          id={`input-${index}`}
          type={row.password && !showPassword ? "password" : "text"}
          defaultValue={row.default}
          placeholder={row.placeholder}
          minLength={row.min}
          maxLength={row.max}
          disabled={row.disabled}
          className={`${row.icon ? "pl-8" : ""} ${row.password ? "pr-10" : ""}`}
        />

        {row.password && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={row.disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

const CheckboxField = ({ row, control, index }: FormRowControlProps<ICheckbox>) => {
  const id = useId();
  return (
    <FormField
      control={control}
      name={`test.${index}.value`}
      render={({ field }) => (
        <FormItem className="flex items-center gap-3">
          <Checkbox
            id={id}
            required={row.required}
            defaultChecked={row.checked}
            disabled={row.disabled}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <Label htmlFor={id}>{row.label}</Label>
        </FormItem>
      )}
    />
  );
};

const SliderField = ({ row, index, control }: FormRowControlProps<ISlider>) => {
  return (
    <FormField
      control={control}
      name={`test.${index}.value`}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-3">
          <Label className="text-xs">{row.label}</Label>
          <Slider
            min={row.min}
            max={row.max}
            step={row.step}
            value={
              Array.isArray(field.value)
                ? field.value
                : [field.value ?? row.default ?? row.min ?? 0]
            }
            onBlur={() => field.onBlur()}
            // onChange={(value) => field.onChange(value[0])}
            defaultValue={row.default ? [row.default] : row.min ? [row.min] : [0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={row.disabled}
          />
        </FormItem>
      )}
    />
  );
};

const TextareaField = ({ register, row, index }: FormRowRegisterProps<ITextarea>) => {
  const getRows = () => {
    if (row.description) {
      if (row.max) {
        return row.max;
      } else {
        return 4;
      }
    } else {
      if (row.min) {
        return row.min;
      } else {
        return 3;
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={`textarea-${index}`} className="text-xs" />
      <Textarea
        {...register}
        defaultValue={row.default}
        id={`textarea-${index}`}
        placeholder={row.placeholder}
        rows={getRows()}
        required={row.required}
        disabled={row.disabled}
        className="resize-none"
      />
    </div>
  );
};

const DateField = ({ row, control, index }: FormRowControlProps<IDateInput>) => {
  const [open, setOpen] = useState(false);
  const dateFormat = row.format || "dd/MM/yyyy";
  const clearable = row.clearable ?? true;

  const parseDate = (dateStr: string): Date | undefined => {
    try {
      return parse(dateStr, dateFormat, new Date());
    } catch {
      return undefined;
    }
  };

  const isDisabled = (min: string | undefined, max: string | undefined, dateFormat: string) => {
    return (date: Date): boolean => {
      if (min && date < parse(min, dateFormat, new Date())) return true;
      if (max && date > parse(max, dateFormat, new Date())) return true;
      return false;
    };
  };

  return (
    <FormField
      control={control}
      name={`test.${index}.value`}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <Label className="text-xs">{row.label}</Label>
          {row.type === "date" ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={row.disabled}
                >
                  {row.icon ? (
                    <span className={`${row.icon}`} />
                  ) : (
                    <CalendarIcon className="h-4 w-4" />
                  )}
                  {field.value ? (
                    row.returnString ? (
                      format(
                        typeof field.value === "string"
                          ? parseDate(field.value) || new Date()
                          : field.value,
                        dateFormat
                      )
                    ) : (
                      format(
                        typeof field.value === "string"
                          ? parseDate(field.value) || new Date()
                          : field.value,
                        "PPP"
                      )
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={typeof field.value === "string" ? parseDate(field.value) : field.value}
                  onSelect={(date) => {
                    const currentDate =
                      typeof field.value === "string" ? parseDate(field.value) : field.value;
                    if (
                      clearable &&
                      currentDate &&
                      date &&
                      currentDate.getTime() === date.getTime()
                    ) {
                      field.onChange(null);
                    } else {
                      field.onChange(
                        row.returnString && date ? format(date, dateFormat) : date || null
                      );
                    }
                    setOpen(false);
                  }}
                  disabled={isDisabled(row.min, row.max, dateFormat)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={row.disabled}
                >
                  {row.icon ? (
                    <span className={`${row.icon}`} />
                  ) : (
                    <CalendarIcon className="h-4 w-4" />
                  )}
                  {field.value ? (
                    Array.isArray(field.value) ? (
                      row.returnString ? (
                        <>
                          {format(
                            typeof field.value[0] === "string"
                              ? parseDate(field.value[0]) || new Date()
                              : field.value[0],
                            dateFormat
                          )}{" "}
                          -{" "}
                          {field.value[1] &&
                            format(
                              typeof field.value[1] === "string"
                                ? parseDate(field.value[1]) || new Date()
                                : field.value[1],
                              dateFormat
                            )}
                        </>
                      ) : (
                        <>
                          {format(
                            typeof field.value[0] === "string"
                              ? parseDate(field.value[0]) || new Date()
                              : field.value[0],
                            "PPP"
                          )}{" "}
                          -{" "}
                          {field.value[1] &&
                            format(
                              typeof field.value[1] === "string"
                                ? parseDate(field.value[1]) || new Date()
                                : field.value[1],
                              "PPP"
                            )}
                        </>
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={
                    Array.isArray(field.value)
                      ? {
                          from:
                            typeof field.value[0] === "string"
                              ? parseDate(field.value[0])
                              : field.value[0],
                          to: field.value[1]
                            ? typeof field.value[1] === "string"
                              ? parseDate(field.value[1])
                              : field.value[1]
                            : undefined,
                        }
                      : undefined
                  }
                  onSelect={(range) => {
                    field.onChange(
                      row.returnString && range
                        ? [
                            range.from ? format(range.from, dateFormat) : null,
                            range.to ? format(range.to, dateFormat) : null,
                          ]
                        : [range?.from || null, range?.to || null]
                    );
                    if (range?.to) setOpen(false);
                  }}
                  disabled={isDisabled(row.min, row.max, dateFormat)}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </FormItem>
      )}
    />
  );
};

const ColorField = ({ row, control, index }: FormRowControlProps<IColorInput>) => {
  const getBackgroundColor = (color: string | undefined) => {
    if (!color) return "#ff0000";
    return color.startsWith("#") ? color : `#${color}`;
  };

  return (
    <FormField
      control={control}
      name={`test.${index}.value`}
      render={({ field }) => {
        const parsedValue = useMemo(() => {
          return field.value || "ff0000";
        }, [field.value]);

        return (
          <FormItem className="flex flex-col gap-2">
            <Label className="text-xs">{row.label}</Label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    aria-label="Select color"
                    variant="ghost"
                    // onClick={() => setOpen(true)}
                    size="icon"
                    style={{
                      backgroundColor: getBackgroundColor(parsedValue),
                    }}
                    className={`h-6 w-max absolute left-2 top-1/2 -translate-y-1/2 rounded-sm aspect-square`}
                  />
                </PopoverTrigger>
                <PopoverContent side="top" className="w-full">
                  <HexColorPicker
                    color={parsedValue ?? row.default ?? "#ff0000"}
                    onChange={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="text"
                value={parsedValue || row.default || ""}
                onChange={(e) => field.onChange(e.target.value)}
                defaultValue={row.default || undefined}
                placeholder={row.placeholder || "Enter color code"}
                disabled={row.disabled}
                className="flex-1 pl-10"
              />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

const TimeField = ({ row, control, index }: FormRowControlProps<ITimeInput>) => {
  const [period, setPeriod] = React.useState<Period>("PM");
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  return (
    <FormField
      control={control}
      name={`test.${index}.value`}
      render={({ field }) => {
        const date = field.value ? new Date(field.value) : undefined;

        const setDate = (newDate: Date | undefined) => {
          field.onChange(newDate ? newDate.getTime() : null);
        };

        return (
          <FormItem className="flex flex-col gap-1">
            <Label className="text-xs">{row.label}</Label>
            <div className="flex items-end gap-2">
              <div className="grid gap-1 text-center">
                <Label htmlFor="hours" className="text-xs text-muted-foreground">
                  Hours
                </Label>
                <TimePickerInput
                  picker={row.format === "12" ? "12hours" : "hours"}
                  date={date}
                  setDate={setDate}
                  ref={hourRef}
                  onRightFocus={() => (minuteRef.current ? minuteRef.current.focus() : undefined)}
                  disabled={row.disabled}
                  period={
                    row.format === "12" && date ? (date.getHours() >= 12 ? "PM" : "AM") : undefined
                  }
                />
              </div>
              <div className="grid gap-1 text-center">
                <Label htmlFor="minutes" className="text-xs text-muted-foreground">
                  Minutes
                </Label>
                <TimePickerInput
                  picker="minutes"
                  id={row.format === "12" ? "minutes12" : undefined}
                  date={date}
                  setDate={setDate}
                  ref={minuteRef}
                  onLeftFocus={() => (hourRef.current ? hourRef.current.focus() : undefined)}
                  onRightFocus={() => (secondRef.current ? secondRef.current.focus() : undefined)}
                  disabled={row.disabled}
                  period={
                    row.format === "12" && date ? (date.getHours() >= 12 ? "PM" : "AM") : undefined
                  }
                />
              </div>
              <div className="grid gap-1 text-center">
                <Label htmlFor="seconds" className="text-xs text-muted-foreground">
                  Seconds
                </Label>
                <TimePickerInput
                  picker="seconds"
                  id={row.format === "12" ? "seconds12" : undefined}
                  date={date}
                  setDate={setDate}
                  ref={secondRef}
                  onLeftFocus={() => (minuteRef.current ? minuteRef.current.focus() : undefined)}
                  onRightFocus={
                    row.format === "12"
                      ? () => (periodRef.current ? periodRef.current.focus() : undefined)
                      : undefined
                  }
                  disabled={row.disabled}
                />
              </div>
              {row.format === "12" ? (
                <div className="grid gap-1 text-center">
                  <Label htmlFor="period" className="text-xs text-muted-foreground">
                    Period
                  </Label>
                  <TimePeriodSelect
                    period={period}
                    setPeriod={setPeriod}
                    date={date}
                    setDate={setDate}
                    ref={periodRef}
                    onLeftFocus={() => (secondRef.current ? secondRef.current.focus() : undefined)}
                  />
                </div>
              ) : (
                <div className="flex h-10 items-center">
                  {row.icon ? (
                    <span className={`${row.icon} ml-2 h-4 w-4`} />
                  ) : (
                    <Clock className="ml-2 h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
};

const NumberField = ({ row, control, index }: FormRowControlProps<INumber>) => {
  return (
    <FormField
      control={control}
      name={`test.${index}.value`}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <Label className="text-xs">{row.label}</Label>
          <NumberInput
            defaultValue={row.default}
            min={row.min}
            max={row.max}
            step={row.step}
            disabled={row.disabled}
            onValueChange={field.onChange}
            required={row.required}
            className="w-full"
            {...field}
          />
        </FormItem>
      )}
    />
  );
};

const SelectField = ({ row, control, index }: FormRowControlProps<ISelect>) => {
  return (
    <FormField
      control={control}
      name={`test.${index}.value`}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <Label className="text-xs">{row.label}</Label>
          {row.type === "multi-select" ? (
            <MultiSelect
              options={row.options || []}
              value={field.value}
              onValueChange={field.onChange}
              placeholder={row.placeholder}
              disabled={row.disabled}
              // className="w-full"
            />
          ) : (
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={row.default || row.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {row.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    // disabled={option.disabled}
                  >
                    {option.label || option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormItem>
      )}
    />
  );
};
