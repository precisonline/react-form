'use client'

import { z } from 'zod'
import React from 'react'
import {
  Control,
  FieldValues, // Base type for any form's data structure from react-hook-form
  SubmitHandler,
  UseFormHandleSubmit,
  DeepPartial, // For strongly typing defaultValues
} from 'react-hook-form'

/**
 * TypedLayoutComponentProps defines the core set of props that ALL
 * reusable layout components (e.g., ContactFormLayout, ProductOrderFormLayout)
 * are expected to receive from the dynamic page component.
 *
 * It's generic over TFieldValues to ensure type safety with react-hook-form.
 */
export interface TypedLayoutComponentProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  handleSubmit: UseFormHandleSubmit<TFieldValues>
  onFormSubmit: SubmitHandler<TFieldValues>
  // Using `unknown` is safer than `any`.
  [key: string]: unknown
}

/**
 * FormConfig defines the structure for each form's configuration in our registry.
 * This interface is used by the tenant-specific definition files
 * (e.g., app/forms/definitions/tenant1.ts).
 * It's generic over TFieldValues, representing the specific data shape of the form.
 */
export interface FormConfig<TFieldValues extends FieldValues = FieldValues> {
  /**
   * The Zod schema used for validating this form's data.
   * Typed to the specific TFieldValues for this form.
   */
  schema: z.ZodSchema<TFieldValues>

  /**
   * The React Functional Component responsible for rendering the layout.
   * It receives the core react-hook-form props typed with TFieldValues,
   * plus any other specific props it might need (caught by the index signature
   * in TypedLayoutComponentProps).
   */
  LayoutComponent: React.ComponentType<any>

  /**
   * An object defining the default values for the form fields.
   * Strongly typed as a deep partial of TFieldValues.
   */
  defaultValues: DeepPartial<TFieldValues>

  /**
   * Optional title for the form, which can be displayed by the dynamic page or layout.
   */
  formTitle?: string

  /**
   * Static props to be passed directly to the LayoutComponent.
   * Ideal for field key mappings, button texts, static titles for the layout, etc.
   * Dynamic data (like product lists) will still be fetched/passed by the page component.
   */
  layoutStaticProps?: Record<string, unknown>
  // as these props vary greatly per layout.
  // The specific layout will know its prop types.
}

/**
 * Type for the structure of tenant-specific form registries.
 */
type TenantFormsRegistry = Record<string, FormConfig<FieldValues>>

/**
 * Asynchronously loads the configuration for a specific form based on the
 * tenant slug and form slug.
 * @param tenantSlug - The slug identifying the tenant (e.g., "tenant1")
 * @param formSlug - The slug identifying the form (e.g., "contact", "product-order")
 * @returns A Promise that resolves to the FormConfig (typed with a base FieldValues) or null if not found.
 */
export async function getFormConfig(
  tenantSlug: string,
  formSlug: string
): Promise<FormConfig<FieldValues> | null> {
  try {
    // Dynamically import the module for the specific tenant
    const tenantModule = await import(`./definitions/${tenantSlug}.ts`)

    // The registry of forms for that tenant is expected to be the default export
    const tenantFormsRegistry = tenantModule.default as TenantFormsRegistry

    // Look up the specific form config using the formSlug
    // The retrieved config is FormConfig<FieldValues> from the registry.
    const formConfiguration: FormConfig<FieldValues> | undefined =
      tenantFormsRegistry[formSlug]

    if (formConfiguration) {
      // We return it as FormConfig<FieldValues>. The dynamic page component,
      // if it knows the more specific TFieldValues for the current route,
      // may need to assert this type when using the schema or defaultValues.
      return formConfiguration as FormConfig<FieldValues>
    }
    // Form config not found for the given formSlug
    console.warn(
      `Form configuration for formSlug "${formSlug}" not found in tenant "${tenantSlug}".`
    )
    return null
  } catch (error) {
    // This catch block will also handle errors if the tenantSlug.ts file itself doesn't exist.
    console.error(
      `Failed to load or find form configuration for tenant: "${tenantSlug}", form: "${formSlug}"`,
      error
    )
    return null
  }
}
