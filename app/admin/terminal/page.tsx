'use client'

import { useAuth } from "@/app/api/user/auth";
import {useFetchAttendance} from "@/app/api/admin/db";
import AttendanceWidget from "./AttendanceTable";

const TerminalPage = () => {
    const { user, admin, loading } = useAuth(); // Get the user data here

    if (!user || !admin) {
        return <div>Access denied.</div>
    }

    return (
        <div>
            <h1>SQL Terminal</h1>
        </div>
    );
};


export default TerminalPage;
