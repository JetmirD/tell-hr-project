'use server';

import { createClient } from '@/utils/supabase/server';
import MyAreaChart from './priorityCards';
import { LineChartComponent } from "@/components/forms/lineChart";
export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: results, error: resultsError } = await supabase
        .from('results')
        .select(`
            employeeId, 
            riskScore, 
            riskLevel, 
            employee:employeeId(firstName, lastName)
        `);

    if (resultsError) {
        console.error("Error fetching results:", resultsError);
        return <div>Error loading employee data.</div>;
    }

    const { data: surveyAnswers, error: surveyAnswersError } = await supabase
        .from('survey_answers')
        .select(`
            employeeId, 
            salary_response, 
            manager_response, 
            benefits_response, 
            career_response, 
            environment_response
        `);

    if (surveyAnswersError) {
        console.error("Error fetching survey answers:", surveyAnswersError);
        return <div>Error loading survey answers.</div>;
    }

    const { data: survey, error: surveyError } = await supabase
        .from('survey')
        .select(`
            created_at,
            sentiment
        `);

    if (surveyError) {
        console.error("Error fetching survey:", surveyError);
        return <div>Error loading survey.</div>;
    }
    const chartData = survey?.map((item: any) => ({
        month: item.created_at,  
        sentiment: item.sentiment,
      })) || [];
    
    // Merge the results from both queries based on employeeId
    const employees = results?.map((result: any) => {
        // Find the survey answers for this employee
        const survey = surveyAnswers.find(
            (surveyAnswer) => surveyAnswer.employeeId === result.employeeId
        );

        return {
            id: result.employeeId,
            firstName: result.employee.firstName,
            lastName: result.employee.lastName,
            riskScore: result.riskScore,
            riskLevel: result.riskLevel,
            salary_response: survey?.salary_response || 'N/A',
            manager_response: survey?.manager_response || 'N/A',
            benefits_response: survey?.benefits_response || 'N/A',
            career_response: survey?.career_response || 'N/A',
            environment_response: survey?.environment_response || 'N/A',
        };
    }) || [];

    return (
        <>
            <MyAreaChart employees={employees} />
            <LineChartComponent data={chartData} />
        </>
    );
    
}
