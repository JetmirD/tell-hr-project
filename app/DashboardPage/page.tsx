'use server'

import { createClient } from '@/utils/supabase/server';
import MyAreaChart from './priorityCards';

export default async function DashboardPage() {
    const supabase = await createClient();
    //TODO We should change the datasource here to fetch sentiments
    const { data: employees, error } = await supabase.from('testing').select();
    if (error) {
        console.error("Error fetching sentiment data:", error);
        return <div>Error loading employees.</div>;
    }
    return <MyAreaChart employees={employees || []} />;
}   