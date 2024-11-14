"use client";
import { createClient } from '@/utils/supabase/server';
import React, { use, useEffect, useState } from "react";
import styles from './DashboardPage.module.css';
import { Button } from "@/components/ui/button";
import { areaChartComponent } from "@/components/forms/areaChart";
import { lineChart } from "@/components/forms/lineChart";
import { horizontalBarChart } from "@/components/forms/horizontalBarChart";
import { pieChart } from "@/components/forms/pieChart";
const filterBySentiment = (employees: any, sentiment: any) => {
    return employees.filter((employee: any) => employee.sentiment === sentiment);
}
function MyAreaChart({ employees }: any) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: any) => {
        setSearchTerm(e.target.value.toLowerCase());
    };
    const filterEmployeesByName = (employees: any) => {
        return employees.filter((employee: { EmployeeName: string; }) =>
            employee.EmployeeName.toLowerCase().includes(searchTerm)
        );
    };
    const positiveEmployees = filterEmployeesByName(filterBySentiment(employees, "Positive"));
    console.log("positive", positiveEmployees);
    const negativeEmployees = filterEmployeesByName(filterBySentiment(employees, "Negative"));
    const neutralEmployees = filterEmployeesByName(filterBySentiment(employees, "Neutral"));

    const showPositive = positiveEmployees.length > 0;
    const showNeutral = neutralEmployees.length > 0;
    const showNegative = negativeEmployees.length > 0;
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
            <div className={styles.priorityCards}>
                {showPositive && (
                    <div className={`${styles.card} ${styles.positive}`}>
                        <b><h1 style={{ color: 'white', fontSize: '21px', fontWeight: '500', borderBottom: '0.1px dashed white', textShadow: 'rgb(0 0 0 / 90%) 2px 2px 4px' }}>Positive Sentiment</h1></b>
                        <ul className={styles.list}>
                            {positiveEmployees.map((employee: any) => (
                                <li key={employee.id} className={styles.listItem}>
                                    <span style={{ fontWeight: '500', color: 'black' }}>{employee.EmployeeName}</span>
                                    <span style={{ marginLeft: '0.5rem', color: 'black' }}>
                                        ({employee.sentiment_score})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showNeutral && (
                    <div className={`${styles.card} ${styles.neutral}`}>
                        <b><h1 style={{ color: 'white', fontSize: '21px', fontWeight: '500', borderBottom: '0.1px dashed white', textShadow: 'rgb(0 0 0 / 90%) 2px 2px 4px' }}>Neutral Sentiment</h1></b>
                        <ul className={styles.list}>
                            {neutralEmployees.map((employee: any) => (
                                <li key={employee.id} className={styles.listItem}>
                                    <span style={{ color: 'black', fontWeight: '500' }}>{employee.EmployeeName}</span>
                                    <span style={{ marginLeft: '0.5rem', color: 'black' }}>
                                        ({employee.sentiment_score})
                                    </span>

                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showNegative && (
                    <div className={`${styles.card} ${styles.negative}`}>
                        <h1 style={{ color: 'white', fontSize: '21px', fontWeight: '500', borderBottom: '0.1px dashed white', textShadow: 'rgb(0 0 0 / 90%) 2px 2px 4px' }}>Negative Sentiment</h1>
                        <ul className={styles.list}>
                            {negativeEmployees.map((employee: any) => (
                                <li key={employee.id} className={styles.listItem}>
                                    <span style={{ fontWeight: '500', color: 'black' }}>{employee.EmployeeName}</span>
                                    <span style={{ marginLeft: '0.5rem', color: 'black' }}>
                                        ({employee.sentiment_score})
                                    </span>
                                </li>))}
                        </ul>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className={styles.AreaChart}>
                    {lineChart()}
                </div>
                <div className={styles.AreaChart}>
                    {pieChart()}
                </div>
            </div>


            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
