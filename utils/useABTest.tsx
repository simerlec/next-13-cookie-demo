import React, { useContext } from 'react';
import { ABTests } from './ab-tests';

export const ABTestsContext = React.createContext<ABTests>({});

export const useABTests = () => {
  const abTests = useContext(ABTestsContext);
  return abTests;
};
