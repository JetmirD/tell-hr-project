"use client";
import { createClient } from '@/utils/supabase/server';
import React, { useState } from "react";
import styles from './DashboardPage.module.css';
import { Button } from "@/components/ui/button";
import { areaChartComponent } from "@/components/forms/areaChart";
import { lineChart } from "@/components/forms/lineChart";
import { horizontalBarChart } from "@/components/forms/horizontalBarChart";
import { pieChart } from "@/components/forms/pieChart";

const filterBySentiment = (employees, sentiment) => {
    return employees.filter(employee => employee.sentiment === sentiment);
}

function MyAreaChart({ employees }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filterEmployeesByName = (employees) => {
        return employees.filter(employee =>
            employee.EmployeeName.toLowerCase().includes(searchTerm)
        );
    };

    const positiveEmployees = filterEmployeesByName(filterBySentiment(employees, "Positive"));
    const negativeEmployees = filterEmployeesByName(filterBySentiment(employees, "Negative"));
    const neutralEmployees = filterEmployeesByName(filterBySentiment(employees, "Neutral"));

    const showPositive = positiveEmployees.length > 0;
    const showNeutral = neutralEmployees.length > 0;
    const showNegative = negativeEmployees.length > 0;

    const visibleCardsCount = [showPositive, showNeutral, showNegative].filter(Boolean).length;

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
                {showPositive && (
                    <div className={`${styles.card} ${styles.positive}`}>
                        <h1>Positive Sentiment</h1>
                        <ul className={styles.list}>
                            {positiveEmployees.map((employee) => (
                                <li key={employee.id} className={styles.listItem}>
                                    <span>{employee.EmployeeName}</span>
                                    <span>({employee.sentiment_score})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showNeutral && (
                    <div className={`${styles.card} ${styles.neutral}`}>
                        <h1>Neutral Sentiment</h1>
                        <ul className={styles.list}>
                            {neutralEmployees.map((employee) => (
                                <li key={employee.id} className={styles.listItem}>
                                    <span>{employee.EmployeeName}</span>
                                    <span>({employee.sentiment_score})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showNegative && (
                    <div className={`${styles.card} ${styles.negative}`}>
                        <h1>Negative Sentiment</h1>
                        <ul className={styles.list}>
                            {negativeEmployees.map((employee) => (
                                <li key={employee.id} className={styles.listItem}>
                                    <span>{employee.EmployeeName}</span>
                                    <span>({employee.sentiment_score})</span>
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
