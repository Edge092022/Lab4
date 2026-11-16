import { createContext, useContext } from 'react';

// Default null (không phải object rỗng) để phát hiện ngay khi dùng ngoài Provider.
export const FormContext = createContext(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (ctx === null) {
    throw new Error('useFormContext phải được dùng bên trong <SimpleForm>');
  }
  return ctx;
}
