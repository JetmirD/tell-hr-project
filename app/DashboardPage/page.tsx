'use server';

import { createClient } from '@/utils/supabase/server';
import MyAreaChart from './priorityCards';

export default async function DashboardPage() {
    const supabase = await createClient();

    // Query to fetch employee risk data from the 'results' table
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

    // Query to fetch survey answers from the 'survey_answers' table
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

    return <MyAreaChart employees={employees} />;
}
