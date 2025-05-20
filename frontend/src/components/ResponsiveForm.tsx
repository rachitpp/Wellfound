'use client';

import { useForm } from 'react-hook-form';
import Button from './Button';

interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  validation?: Record<string, unknown>;
}

interface ResponsiveFormProps {
  defaultValues: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void> | void;
  fields: FormField[];
  submitLabel?: string;
}

export default function ResponsiveForm({
  defaultValues,
  onSubmit,
  fields,
  submitLabel = 'Submit',
}: ResponsiveFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.fullWidth ? 'col-span-1 sm:col-span-2' : 'col-span-1'}
          >
            <label
              htmlFor={field.name}
              className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                {...register(field.name, field.validation)}
                className={`w-full px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base rounded-lg border ${
                  errors[field.name]
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors`}
                rows={field.rows || 4}
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                {...register(field.name, field.validation)}
                className={`w-full px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base rounded-lg border ${
                  errors[field.name]
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors`}
              >
                <option value="">{field.placeholder || 'Select...'}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type || 'text'}
                {...register(field.name, field.validation)}
                className={`w-full px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base rounded-lg border ${
                  errors[field.name]
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors`}
                placeholder={field.placeholder}
              />
            )}

            {errors[field.name] && (
              <p className="mt-1 text-xs sm:text-xs md:text-sm text-red-500">
                {errors[field.name]?.message?.toString()}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center sm:justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
