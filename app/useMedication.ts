import { useMatchesData } from './useMatchesData';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

function isMedicineList(medicineList: unknown): medicineList is Medicine[] {
  return !!medicineList && Array.isArray(medicineList);
}

/**
 * Build a custom hook for each data object
 * of your loader data.
 * Use useMatchesData to access loader data
 * across your application.
 * Use tiny-invariant and Typescript "is"
 * to require data on runtime.
 * Or return undefined if data is optional and not found.
 */
export function useMedicineList(): Medicine[] | undefined {
  const data = useMatchesData('routes/medication');
  if (!data || !isMedicineList(data.list)) {
    return undefined;
  }
  return data.list;
}

export function useMedication(id: string): Medicine | undefined {
  const maybeList = useMedicineList();

  if (!maybeList) {
    throw new Error(
      'No medicineList list found in medication loader, but is required.'
    );
  }

  return maybeList.find((entry) => entry.id === id);
}

export type { Medicine };
