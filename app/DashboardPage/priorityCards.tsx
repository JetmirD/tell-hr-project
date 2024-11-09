"use client";
import { Card } from "@tremor/react";
import { createClient } from '@/utils/supabase/server';
import React, { use, useEffect, useState } from "react";


    const filterBySentiment = (employees: any, sentiment: any) => {
        return employees.filter((employee: any) => employee.sentiment === sentiment);
    }
    function MyAreaChart({ employees }: any) {



    const positiveEmployees = filterBySentiment(employees, "Positive");
    console.log("positive", positiveEmployees);
    const negativeEmployees = filterBySentiment(employees, "Negative");
    const neutralEmployees = filterBySentiment(employees, "Neutral");
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ ...cardStyle, backgroundColor: '#ff7675' }}>
                <b><h1>Positive Sentiment</h1></b>
                <ul style={listStyle}>
                    {positiveEmployees.map((employee: any) => (
                        <li key={employee.id} style={listItemStyle}>
                            <span style={{ fontWeight: 'bold' }}>{employee.EmployeeName}</span>
                            <span style={{ marginLeft: '0.5rem', color: '#ff7675' }}>
                                ({employee.sentiment_score})
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ ...cardStyle, backgroundColor: '#ffeaa7' }}>
                <b><h1>Neutral Sentiment</h1></b>
                <ul style={listStyle}>
                    {neutralEmployees.map((employee: any) => (
                        <li key={employee.id} style={listItemStyle}>
                            <span style={{ fontWeight: 'bold' }}>{employee.EmployeeName}</span>
                            <span style={{ marginLeft: '0.5rem', color: '#00b894' }}>
                                ({employee.sentiment_score})
                            </span>

                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ ...cardStyle, backgroundColor: '#55efc4' }}>
                <b> <h1>Negative Sentiment</h1></b>
                <ul style={listStyle}>
                    {negativeEmployees.map((employee: any) => (
                        <li key={employee.id} style={listItemStyle}>
                            <span style={{ fontWeight: 'bold' }}>{employee.EmployeeName}</span>
                            <span style={{ marginLeft: '0.5rem', color: '#00b894' }}>
                                ({employee.sentiment_score})
                            </span>
                        </li>))}
                </ul>
            </div>


        </div>
    );
}
const cardStyle = {
    border: 'NONE',
    borderRadius: '8px',
    padding: '2rem',
    width: '268px',
    // textAlign: 'center',
};
const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: '1rem 0 0',
};

const listItemStyle = {
    padding: '0.5rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

export default MyAreaChart;
