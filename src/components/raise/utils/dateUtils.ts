export const formatDateForSupabase = (date: Date): string => {
  return date.toISOString().split('T')[0];
};