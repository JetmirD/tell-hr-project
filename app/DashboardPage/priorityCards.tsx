"use client";
import React, { useState } from "react";
import styles from './DashboardPage.module.css';
import { areaChartComponent } from "@/components/forms/areaChart";
import { LineChartComponent } from "@/components/forms/lineChart";
import { horizontalBarChart } from "@/components/forms/horizontalBarChart";
import PieChartComponent from "../../components/forms/pieChart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faBriefcase, faGift, faGraduationCap, faLeaf, faBuilding, faClose, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Include the CSS styles

const filterBySentiment = (employees: any[], sentiment: string) => {
    return employees.filter(employee => employee.sentiment === sentiment);
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

const filterByRiskLevel = (employees: Employee[], riskLevel: string) => {
    return employees.filter(employee => employee.riskLevel === riskLevel);
};

function MyAreaChart({ employees }: { employees: Employee[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [answerIndex, setAnswerIndex] = useState<number>(0);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleEmployeeClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setAnswerIndex(0);
    };

    const closePopup = () => {
        setSelectedEmployee(null);
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

    const responses = [
        { label: "Salary Response", value: selectedEmployee?.salary_response },
        { label: "Manager Response", value: selectedEmployee?.manager_response },
        { label: "Benefits Response", value: selectedEmployee?.benefits_response },
        { label: "Career Response", value: selectedEmployee?.career_response },
        { label: "Environment Response", value: selectedEmployee?.environment_response }
    ];

    const nextAnswer = () => {
        setAnswerIndex((prevIndex) => (prevIndex + 1) % responses.length);
    };

    const prevAnswer = () => {
        setAnswerIndex((prevIndex) => (prevIndex - 1 + responses.length) % responses.length);
    };

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
                {showHighRisk && (
                    <div
                        className={`${styles.card} ${styles.negative}`}
                        style={{ position: 'relative', padding: '20px' }}
                        data-tooltip-id="high-risk-tooltip"
                        data-tooltip-content="These employees are actively seeking new opportunities. Immediate attention is required to address their concerns and retain them."
                    >
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
                        <div
                            style={{ marginTop: '40px', maxHeight: '130px', overflowY: 'auto', zIndex: 1 }}
                            className={`${styles.scrollContainer}`}
                        >           
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                {highRiskEmployees.map((employee, index) => (
                                    <li
                                        key={employee.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '13px',
                                            padding: '5px ',
                                            borderBottom: '1px solid #F1F2F6',
                                            cursor: 'pointer',
                                            ...(index === highRiskEmployees.length - 1 && { borderBottom: 'none' })
                                        }}
                                        onClick={() => handleEmployeeClick(employee)}
                                    >
                                        <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                        <span>{(employee.riskScore).toFixed(0)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {showMediumRisk && (
                    <div
                        className={`${styles.card} ${styles.neutral}`}
                        style={{ position: 'relative', padding: '20px' }}
                        data-tooltip-id="medium-risk-tooltip"
                        data-tooltip-content="These employees are relatively satisfied but will likely leave if they receive a good offer elsewhere. Proactive engagement could help strengthen their commitment."
                    >
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

                        <div
                            style={{ marginTop: '40px', maxHeight: '130px', overflowY: 'auto', zIndex: 1 }}
                            className={`${styles.scrollContainer}`}
                        >                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                {mediumRiskEmployees.map((employee, index) => (
                                    <li
                                        key={employee.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '13px',
                                            padding: '5px ',
                                            borderBottom: '1px solid #F1F2F6',
                                            cursor: 'pointer',
                                            ...(index === mediumRiskEmployees.length - 1 && { borderBottom: 'none' })
                                        }}
                                        onClick={() => handleEmployeeClick(employee)}
                                    >
                                        <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                        <span>{(employee.riskScore).toFixed(0)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                )}

                {showLowRisk && (
                    <div className={`${styles.card} ${styles.positive}`} style={{ position: 'relative', padding: '20px' }}
                        data-tooltip-id="low-risk-tooltip"
                        data-tooltip-content="These employees are highly satisfied and committed to their current role. Minimal attention is required, but maintaining their satisfaction is key."
                    >
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
                            style={{ marginTop: '40px', maxHeight: '130px', overflowY: 'auto', zIndex: 1 }}
                            className={`${styles.scrollContainer}`}
                        >
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                {lowRiskEmployees.map((employee, index) => (
                                    <li
                                        key={employee.id}
                                        onClick={() => handleEmployeeClick(employee)}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '13px',
                                            padding: '5px ',
                                            borderBottom: '1px solid #F1F2F6',
                                            cursor: 'pointer',
                                            ...(index === lowRiskEmployees.length - 1 && { borderBottom: 'none' })
                                        }}
                                    >
                                        <span>{`${employee.firstName} ${employee.lastName}`}</span>
                                        <span>{(employee.riskScore).toFixed(0)}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                <Tooltip
                    id="high-risk-tooltip"
                    style={{
                        maxWidth: '250px',
                        textAlign: 'center',
                        padding: '10px',
                        backgroundColor: '#bd0f0f',
                        color: '#fff',
                        borderRadius: '5px'
                    }}
                />

                <Tooltip
                    id="medium-risk-tooltip"
                    style={{
                        maxWidth: '250px',
                        textAlign: 'center',
                        padding: '10px',
                        backgroundColor: '#958900'
                    }}
                />
                <Tooltip
                    id="low-risk-tooltip"
                    style={{
                        maxWidth: '250px',
                        textAlign: 'center',
                        padding: '10px',
                        backgroundColor: '#008535'
                    }}
                />

            </div>

            {/* Popup Section */}
            {selectedEmployee && (
                <div className={styles.overlay} onClick={closePopup}>
                    <div
                        className={styles.popupContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closePopup} className={styles.closeButton}>
                            <FontAwesomeIcon icon={faClose} color="#939292" fontSize="19px" />
                        </button>
                        <h2 className={styles.popupHeader}>
                            {`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                        </h2>
                        <div className={styles.scrollContainer} style={{ height: '400px', maxHeight: '400px' }}>
                            {responses.map((response, index) => (
                                <div key={index} className={styles.questionAnswerItem}>
                                    <div
                                        className={styles.question}
                                        onClick={() => setAnswerIndex(answerIndex === index ? -1 : index)}
                                        style={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: '18px', fontWeight: '500' }}>
                                            {response.label === "Salary Response" && <FontAwesomeIcon icon={faMoneyBill} color="#3BB54A" />}
                                            {response.label === "Manager Response" && <FontAwesomeIcon icon={faBriefcase} color="#9f6f6d" />}
                                            {response.label === "Benefits Response" && <FontAwesomeIcon icon={faGift} color="#D0004F" />}
                                            {response.label === "Career Response" && <FontAwesomeIcon icon={faGraduationCap} color="#444444" />}
                                            {response.label === "Environment Response" && <FontAwesomeIcon icon={faBuilding} color="#FF901D" />}
                                            <h1>{response.label}</h1>
                                        </div>
                                        <span
                                            className={styles.icon}
                                            style={{
                                                transition: "transform 1s ease",
                                            }}
                                        >
                                            <FontAwesomeIcon icon={answerIndex === index ? faMinus : faPlus} />
                                        </span>

                                    </div>
                                    {answerIndex === index && (
                                        <div className={styles.answer}>
                                            {response.value || "N/A"}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className={styles.chartsContainer}>
                <div className={styles.AreaChart}>
                    {/* {LineChartComponent("Sentiment", "January - June 2024")} */}
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
