import React, { createContext, useContext, useState } from 'react';

type FilterContextType = {
    selectedYear: number;
    setSelectedYear: (year: number) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    return (
        <FilterContext.Provider value={{ selectedYear, setSelectedYear }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
}
