import { useCallback } from 'react';

import { useAppSelector } from '../app/store';
import { selectCurrency } from '../features/settings/settingsSelectors';
import { formatCurrency } from '../utils/currency';

export const useFormatCurrency = () => {
  const currency = useAppSelector(selectCurrency);

  return useCallback(
    (value: number) => formatCurrency(value, currency),
    [currency],
  );
};
