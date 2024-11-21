    // pages/DashboardPage.tsx
    'use server';

    import { createClient } from '@/utils/supabase/server';
    import { DashboardProvider } from './DashboardContext';
    import MyAreaChart from './priorityCards';

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

    export default async function DashboardPage() {
      const supabase = await createClient();

      // Query to fetch employee risk data from the 'results' table
      const { data: results, error: resultsError } = await supabase
        .from('results')
        .select(`
          employeeId,
          riskScore,
          riskLevel,
          employee:employeeId(firstName, lastName, Department)
        `);

      if (resultsError) {
        console.error("Error fetching results:", resultsError);
        return <div>Error loading employee data.</div>;
      }

      const departmentAverages = results.reduce<Record<string, DepartmentStats>>((acc, curr: any) => {
        const department = curr.employee?.Department;
        if (!department) return acc;

        if (!acc[department]) {
          acc[department] = { totalRisk: 0, count: 0 };
        }

        acc[department].totalRisk += curr.riskScore;
        acc[department].count += 1;

        return acc;
      }, {});

      // Format the output with average risk scores
      const averageRiskScores = Object.entries(departmentAverages).map(
        ([department, { totalRisk, count }]) => ({
          department,
          averageRiskScore: totalRisk / count,
        })
      );

      // Query to fetch survey answers and total count from the 'survey_answers' table
      const { data: surveyAnswers, error: surveyAnswersError, count: totalSurveys } = await supabase
        .from('survey_answers')
        .select(
          `
          employeeId,
          salary_response,
          manager_response,
          benefits_response,
          career_response,
          environment_response
        `,
          { count: 'exact' } 
        );

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
      const employees = results?.map((result: any) => {
        const survey = surveyAnswers?.find(
          (surveyAnswer) => surveyAnswer.employeeId === result.employeeId
        );

        return {
          id: result?.employeeId,
          firstName: result?.employee?.firstName,
          lastName: result?.employee?.lastName,
          riskScore: result?.riskScore,
          riskLevel: result?.riskLevel,
          salary_response: survey?.salary_response || 'N/A',
          manager_response: survey?.manager_response || 'N/A',
          benefits_response: survey?.benefits_response || 'N/A',
          career_response: survey?.career_response || 'N/A',
          environment_response: survey?.environment_response || 'N/A',
        };
      }) || [];

      return (
        <DashboardProvider value={{ averageRiskScores, employees, chartData, results, totalSurveys }}>
          <MyAreaChart />
        </DashboardProvider>
      );
    }
