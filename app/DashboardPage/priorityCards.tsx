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



    const positiveEmployees = filterBySentiment(employees, "Positive");
    console.log("positive", positiveEmployees);
    const negativeEmployees = filterBySentiment(employees, "Negative");
    const neutralEmployees = filterBySentiment(employees, "Neutral");
    return (
        <main style={{ gap: '1rem' }}>
            <div className={styles.priorityCards}>
                <div className={`${styles.card}`} style={{ backgroundColor: '#ff7675' }}>
                    <b><h1 style={{ color: 'black' }}>Positive Sentiment</h1></b>
                    <ul className={styles.list}>
                        {positiveEmployees.map((employee: any) => (
                            <li key={employee.id} className={styles.listItem}>
                                <span style={{ fontWeight: 'bold', color: 'black' }}>{employee.EmployeeName}</span>
                                <span style={{ marginLeft: '0.5rem', color: 'black' }}>
                                    ({employee.sentiment_score})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.card}`} style={{ backgroundColor: '#ffeaa7' }}>
                    <b><h1 style={{ color: 'black' }}>Neutral Sentiment</h1></b>
                    <ul className={styles.list}>
                        {neutralEmployees.map((employee: any) => (
                            <li key={employee.id} className={styles.listItem}>
                                <span style={{ color: 'black', fontWeight: 'bold' }}>{employee.EmployeeName}</span>
                                <span style={{ marginLeft: '0.5rem', color: 'black' }}>
                                    ({employee.sentiment_score})
                                </span>

                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.card}`} style={{ backgroundColor: '#55efc4' }}>
                    <b> <h1 style={{ color: 'black' }}>Negative Sentiment</h1></b>
                    <ul className={styles.list}>
                        {negativeEmployees.map((employee: any) => (
                            <li key={employee.id} className={styles.listItem}>
                                <span style={{ fontWeight: 'bold', color: 'black' }}>{employee.EmployeeName}</span>
                                <span style={{ marginLeft: '0.5rem', color: 'black' }}>
                                    ({employee.sentiment_score})
                                </span>
                            </li>))}
                    </ul>
                </div>
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
