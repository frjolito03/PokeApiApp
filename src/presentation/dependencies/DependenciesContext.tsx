import React, { createContext, PropsWithChildren, useContext } from 'react';

import { AppContainer, container as defaultContainer } from '../../core/di/container';

const DependenciesContext = createContext<AppContainer>(defaultContainer);

interface DependenciesProviderProps {
  container?: AppContainer;
}

export function DependenciesProvider({
  container = defaultContainer,
  children,
}: PropsWithChildren<DependenciesProviderProps>) {
  return (
    <DependenciesContext.Provider value={container}>{children}</DependenciesContext.Provider>
  );
}

export function useDependencies(): AppContainer {
  return useContext(DependenciesContext);
}
