"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Tool } from "@/types/tool";

import {
  createToolSchema,
  updateToolSchema,
  type CreateToolInput,
  type CreateToolValues,
  type UpdateToolInput,
  type UpdateToolValues,
} from "@/schemas/tool.schema";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCategories } from "@/hooks/use-categories";
import { useDepartments } from "@/hooks/use-departments";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type CreateProps = {
  mode: "create";
  initialData?: never;
  onSubmit: (values: CreateToolValues) => void | Promise<void>;
};

type EditProps = {
  mode: "edit";
  initialData: Tool;
  onSubmit: (values: UpdateToolValues) => void | Promise<void>;
};

type Props = (CreateProps | EditProps) & {
  isSubmitting?: boolean;
};

/* -------------------------------------------------------------------------- */
/*                               STATUS OPTIONS                               */
/* -------------------------------------------------------------------------- */

const statusOptions = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
  {
    value: "EXPIRING",
    label: "Expiring",
  },
  {
    value: "UNUSED",
    label: "Unused",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                                    FORM                                    */
/* -------------------------------------------------------------------------- */

export function ToolForm(props: Props) {
  const isEditMode = props.mode === "edit";

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const { data: departments = [], isLoading: isLoadingDepartments } =
    useDepartments();

  const form = useForm<
    CreateToolInput | UpdateToolInput,
    unknown,
    CreateToolValues | UpdateToolValues
  >({
    resolver: zodResolver(isEditMode ? updateToolSchema : createToolSchema),

    defaultValues: isEditMode
      ? {
          id: props.initialData.id,

          name: props.initialData.name,

          description: props.initialData.description ?? "",

          vendor: props.initialData.vendor ?? "",

          category: props.initialData.category,

          owner_department: props.initialData.owner_department,

          status: props.initialData.status,

          website_url: props.initialData.website_url ?? "",

          icon_url: props.initialData.icon_url ?? "",

          monthly_cost: props.initialData.monthly_cost,

          previous_month_cost: props.initialData.previous_month_cost,

          active_users_count: props.initialData.active_users_count,
        }
      : {
          name: "",

          description: "",

          vendor: "",

          category: "",

          owner_department: "",

          status: "ACTIVE",

          website_url: "",

          icon_url: "",

          monthly_cost: 0,

          previous_month_cost: null,

          active_users_count: 0,
        },
  });

  /* ------------------------------------------------------------------------ */
  /*                                  SUBMIT                                  */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(values: CreateToolValues | UpdateToolValues) {
    if (isEditMode) {
      await props.onSubmit(values as UpdateToolValues);

      return;
    }

    await props.onSubmit(values as CreateToolValues);
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6"
      noValidate
    >
      <FieldGroup className="grid gap-4 md:grid-cols-2">
        {/* ------------------------------------------------------------------ */}
        {/* NAME                                                               */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Tool name</FieldLabel>

              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                placeholder="Slack"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* VENDOR                                                             */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="vendor"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Vendor</FieldLabel>

              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                placeholder="Slack Technologies"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* CATEGORY                                                           */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Category</FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={isLoadingCategories}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingCategories
                        ? "Loading categories..."
                        : "Select category"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* OWNER DEPARTMENT                                                   */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="owner_department"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Owner department</FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                disabled={isLoadingDepartments}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingDepartments
                        ? "Loading departments..."
                        : "Select department"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* MONTHLY COST                                                       */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="monthly_cost"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Monthly cost</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="number"
                min={0}
                step="0.01"
                value={field.value == null ? "" : String(field.value)}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* ACTIVE USERS                                                       */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="active_users_count"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Active users</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="number"
                min={0}
                step={1}
                value={field.value == null ? "" : String(field.value)}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* STATUS - EDIT ONLY                                                 */}
        {/* ------------------------------------------------------------------ */}

        {isEditMode && (
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status</FieldLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </FieldGroup>

      <FieldGroup>
        {/* ------------------------------------------------------------------ */}
        {/* WEBSITE URL                                                        */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="website_url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Website URL</FieldLabel>

              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                placeholder="https://slack.com"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* ICON URL                                                           */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="icon_url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Icon URL</FieldLabel>

              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                placeholder="https://example.com/icon.png"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* ------------------------------------------------------------------ */}
        {/* DESCRIPTION                                                        */}
        {/* ------------------------------------------------------------------ */}

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>

              <Textarea
                {...field}
                id={field.name}
                value={field.value ?? ""}
                placeholder="Describe the tool..."
                className="min-h-28 resize-none"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* -------------------------------------------------------------------- */}
      {/* SUBMIT                                                               */}
      {/* -------------------------------------------------------------------- */}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={props.isSubmitting}
          className={
            isEditMode
              ? "gradient-orange text-white hover:cursor-pointer"
              : "gradient-green text-white hover:cursor-pointer"
          }
        >
          {props.isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update tool"
              : "Create tool"}
        </Button>
      </div>
    </form>
  );
}
