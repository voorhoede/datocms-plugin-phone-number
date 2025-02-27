export default function<T>(formValues: Record<string, any>, fieldPath: string) {
  return fieldPath.split('.').reduce((acc, key) => acc?.[key], formValues) as T;
};
