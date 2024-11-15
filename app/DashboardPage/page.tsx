'use server';

import { createClient } from '@/utils/supabase/server';
import MyAreaChart from './priorityCards';

export default async function DashboardPage() {
    const supabase = await createClient();

    // Query the employee and results tables, joining them by employeeID
    const { data: results, error } = await supabase
        .from('results')
        .select('employeeId, riskScore, riskLevel, employee:employeeId(firstName, lastName)');

    if (error) {
        console.error("Error fetching data:", error);
        return <div>Error loading employees.</div>;
    }

    const employees = results?.map((result: any) => ({
        id: result.employeeID,
        firstName: result.employee.firstName,
        lastName: result.employee.lastName,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
    })) || [];

    return <MyAreaChart employees={employees} />;
}
