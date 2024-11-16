"use client";
import React, { useState } from "react";
import styles from './DashboardPage.module.css';
import { areaChartComponent } from "@/components/forms/areaChart";
import { lineChart } from "@/components/forms/lineChart";
import { horizontalBarChart } from "@/components/forms/horizontalBarChart";
import PieChartComponent from "../../components/forms/pieChart";

const filterBySentiment = (employees: any[], sentiment: string) => {
    return employees.filter(employee => employee.sentiment === sentiment);
}

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
                    <div className={`${styles.card} ${styles.positive}`} style={{ position: 'relative', padding: '20px' }}>
                        <h1 style={{ fontSize: '14px', fontWeight: 500, marginTop: '-3px' }}>Low Risk</h1>

                        <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '19px',
                            backgroundColor: '#F7F8FB',
                            top: '50px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: '#B7BCCA',
                            marginTop: '3px',
                        }}>
                            <p style={{ margin: 0 }}>Name</p>
                            <p style={{ margin: 0 }}>Score</p>
                        </div>

                        <div
                            style={{ marginTop: '40px', maxHeight: '110px', overflowY: 'auto', zIndex: 1 }}
                            className={`${styles.scrollContainer}`}
                        >
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                {lowRiskEmployees.map((employee, index) => (
                                    <li key={employee.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '13px',
                                        padding: '5px ',
                                        borderBottom: '1px solid #F1F2F6',
                                        ...(index === lowRiskEmployees.length - 1 && { borderBottom: 'none' })
                                    }}>
                                        <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                        <span>{(employee.riskScore).toFixed(0)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                )}
                {showMediumRisk && (
                    <div className={`${styles.card} ${styles.neutral}`} style={{ position: 'relative', padding: '20px' }}>
                        <h1 style={{ fontSize: '14px', fontWeight: 500, marginTop: '-3px' }}>Medium Risk</h1>

                        <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '19px',
                            backgroundColor: '#F7F8FB',
                            top: '50px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: '#B7BCCA',
                            marginTop: '3px'
                        }}>
                            <p style={{ margin: 0 }}>Name</p>
                            <p style={{ margin: 0 }}>Score</p>
                        </div>

                        <div style={{ paddingTop: '40px' }}>
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                {mediumRiskEmployees.map((employee, index) => (
                                    <li key={employee.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '13px',
                                        padding: '5px ',
                                        borderBottom: '1px solid #F1F2F6',
                                        ...(index === mediumRiskEmployees.length - 1 && { borderBottom: 'none' })
                                    }}>
                                        <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                        <span>{(employee.riskScore).toFixed(0)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                )}
                {showHighRisk && (
                    <div className={`${styles.card} ${styles.negative}`} style={{ position: 'relative', padding: '20px' }}>
                        <h1 style={{ fontSize: '14px', fontWeight: 500, marginTop: '-3px' }}>High Risk</h1>

                        <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            height: '19px',
                            backgroundColor: '#F7F8FB',
                            top: '50px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: '#B7BCCA',
                            marginTop: '3px'
                        }}>
                            <p style={{ margin: 0 }}>Name</p>
                            <p style={{ margin: 0 }}>Score</p>
                        </div>

                        <div style={{ paddingTop: '40px' }}>
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                {highRiskEmployees.map((employee, index) => (
                                    <li key={employee.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '13px',
                                        padding: '5px ',
                                        borderBottom: '1px solid #F1F2F6',
                                        ...(index === highRiskEmployees.length - 1 && { borderBottom: 'none' })
                                    }}>
                                        <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                        <span>{(employee.riskScore).toFixed(0)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className={styles.chartsContainer}>
                <div className={styles.AreaChart}>
                    {lineChart()}
                </div>
                <div className={styles.AreaChart}>
                    <PieChartComponent data={employees} />
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
