'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type NavigationContextType = {
  previousPath: string | null;
  currentPath: string;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Track paths using a ref so we don't trigger unnecessary re-renders during tracking
  const pathsRef = useRef<{ previous: string | null; current: string }>({
    previous: null,
    current: pathname,
  });

  // Expose state to the rest of the application
  const [navigationHistory, setNavigationHistory] = useState<NavigationContextType>({
    previousPath: null,
    currentPath: pathname,
  });

  useEffect(() => {
    // If the path hasn't actually changed, do nothing
    if (pathsRef.current.current === pathname) return;

    // Shift current path to previous, and update current path
    pathsRef.current = {
      previous: pathsRef.current.current,
      current: pathname,
    };

    // Update state to notify components consuming the context
    setNavigationHistory({
      previousPath: pathsRef.current.previous,
      currentPath: pathsRef.current.current,
    });
  }, [pathname]);

  return (
    <NavigationContext.Provider value={navigationHistory}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook for easy consumption in other components
export function useNavigationHistory() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationHistory must be used within a NavigationProvider');
  }
  return context;
}