'use client'

import { useAuth } from "@/app/api/user/auth";
import {useFetchAttendance} from "@/app/api/admin/db";
import AttendanceWidget from "./AttendanceTable";

const TeamPage = () => {
    const { user, admin, loading } = useAuth(); // Get the user data here
    const { attendanceData, attLoading } = useFetchAttendance();

    if (loading || attLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!user || !admin) {
        return <div>Access denied.</div>
    }

    return (
        <div>
            <h1>{admin ? "Team Page" : "Member"}</h1>
            <AttendanceWidget attendanceData={attendanceData} />
        </div>
    );
};


export default TeamPage;
