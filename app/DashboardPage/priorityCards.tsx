"use client";
import React, { useState } from "react";
import styles from './DashboardPage.module.css';
import { areaChartComponent } from "@/components/forms/areaChart";
import { lineChart } from "@/components/forms/lineChart";
import { horizontalBarChart } from "@/components/forms/horizontalBarChart";
import { pieChart } from "@/components/forms/pieChart";

interface Employee {
    id?: string; 
    firstName: string;
    lastName: string;
    riskScore: number;
    riskLevel: string;
}

const filterByRiskLevel = (employees: Employee[], riskLevel: string) => {
    return employees.filter(employee => employee.riskLevel === riskLevel);
};

function MyAreaChart({ employees }: { employees: Employee[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filterEmployeesByName = (employees: Employee[]) => {
        return employees.filter(employee =>
            `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm)
        );
    };

    const lowRiskEmployees = filterEmployeesByName(filterByRiskLevel(employees, "low"));
    const mediumRiskEmployees = filterEmployeesByName(filterByRiskLevel(employees, "medium"));
    const highRiskEmployees = filterEmployeesByName(filterByRiskLevel(employees, "high"));

    const showLowRisk = lowRiskEmployees.length > 0;
    const showMediumRisk = mediumRiskEmployees.length > 0;
    const showHighRisk = highRiskEmployees.length > 0;

    const visibleCardsCount = [showLowRisk, showMediumRisk, showHighRisk].filter(Boolean).length;

    return (
        <main style={{ gap: '1rem' }}>
            {/* Search input */}
            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="Search employee name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
            </div>
            
            {/* Cards Section */}
            <div className={`${styles.priorityCards} ${visibleCardsCount === 1 ? styles.centeredCard : ''}`}>
                {showLowRisk && (
                    <div className={`${styles.card} ${styles.lowRisk}`}>
                        <h1>Low Risk</h1>
                        <ul className={styles.list}>
                            {lowRiskEmployees.map((employee, index) => (
                                <li 
                                    key={employee.id || `${employee.firstName}-${employee.lastName}-low-${index}`} 
                                    className={styles.listItem}
                                >
                                    <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                    <span>({employee.riskScore})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showMediumRisk && (
                    <div className={`${styles.card} ${styles.mediumRisk}`}>
                        <h1>Medium Risk</h1>
                        <ul className={styles.list}>
                            {mediumRiskEmployees.map((employee, index) => (
                                <li 
                                    key={employee.id || `${employee.firstName}-${employee.lastName}-medium-${index}`} 
                                    className={styles.listItem}
                                >
                                    <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                    <span>({employee.riskScore})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showHighRisk && (
                    <div className={`${styles.card} ${styles.highRisk}`}>
                        <h1>High Risk</h1>
                        <ul className={styles.list}>
                            {highRiskEmployees.map((employee, index) => (
                                <li 
                                    key={employee.id || `${employee.firstName}-${employee.lastName}-high-${index}`} 
                                    className={styles.listItem}
                                >
                                    <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                    <span>({employee.riskScore})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className={styles.chartsContainer}>
                <div className={styles.AreaChart}>
                    {lineChart()}
                </div>
                <div className={styles.AreaChart}>
                    {pieChart()}
                </div>
            </div>

            <div className={styles.chartsContainer}>
                <div className={styles.AreaChart}>
                    {horizontalBarChart()}
                </div>
                <div className={styles.AreaChart}>
                    {areaChartComponent()}
                </div>
            </div>
        </main>
    );
}

export default MyAreaChart;
