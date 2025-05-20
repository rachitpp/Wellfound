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
  submitAction: (data: Record<string, unknown>) => Promise<void> | void;
  fields: FormField[];
  submitLabel?: string;
}

export default function ResponsiveForm({
  defaultValues,
  submitAction,
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
    <form onSubmit={handleSubmit(submitAction)} className="space-y-5 sm:space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.fullWidth ? 'col-span-1 sm:col-span-2' : 'col-span-1'}
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-display tracking-wide"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1 font-medium">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                {...register(field.name, field.validation)}
                className={`w-full px-4 py-3 text-sm rounded-xl border-2 shadow-sm hover:shadow-md ${
                  errors[field.name]
                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-400/30 focus:border-primary-500 dark:focus:border-primary-400'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none transition-all duration-300 ease-in-out`}
                rows={field.rows || 4}
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                {...register(field.name, field.validation)}
                className={`w-full px-4 py-3 text-sm rounded-xl border-2 shadow-sm hover:shadow-md ${
                  errors[field.name]
                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-400/30 focus:border-primary-500 dark:focus:border-primary-400'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 ease-in-out`}
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
                className={`w-full px-4 py-3 text-sm rounded-xl border-2 shadow-sm hover:shadow-md ${
                  errors[field.name]
                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-400/30 focus:border-primary-500 dark:focus:border-primary-400'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 ease-in-out`}
                placeholder={field.placeholder}
              />
            )}

            {errors[field.name] && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg inline-block font-medium">
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
