'use client'
// context/DashboardContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';

interface DepartmentStats {
  totalRisk: number;
  count: number;
}

interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  riskScore: number;
  riskLevel: string;
  salary_response?: string;
  manager_response?: string;
  benefits_response?: string;
  career_response?: string;
  environment_response?: string;
}

interface DashboardContextType {
  averageRiskScores: { department: string; averageRiskScore: number }[];
  employees: Employee[];
  chartData: { month: string; sentiment: number }[];
  results: any[];
  totalSurveys: any; 
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  value: DashboardContextType;
}

export const DashboardProvider = ({ children, value }: DashboardProviderProps) => {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
