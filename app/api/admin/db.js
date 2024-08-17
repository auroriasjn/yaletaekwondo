
// This function fetches *all* of the user data.
import {useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from "../user/auth";

export const useFetchAttendance = () => {
    const { user } = useAuth();
    const [attendanceData, setAttendanceData] = useState(null);
    const [attLoading, setAttLoading]  = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            try {
                const res = await axios.get(`http://localhost:3002/api/admin/attendance`, { withCredentials: true });
                setAttendanceData(res.data);
                setAttLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setAttLoading(false);
            }
        }
        fetch();
    }, [user]);

    return { attendanceData, attLoading }
}

export const useFetchUserFromNetID = (netid) => {
    const { admin } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [tags, setTags] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            if (!admin) return;

            // Fetching all shop items.
            try {
                const res = await axios.get(`http://localhost:3002/api/admin/user/${netid}`,  { withCredentials: true });
                console.log(res);

                setUserData(res.data);
            } catch (err) {
                console.error(`Error fetching user from netID ${netid}`, err);
                setUserLoading(false);
            }

            // Getting all tag data
            try {
                const res = await axios.get(`http://localhost:3002/api/user/tags`,  { withCredentials: true });
                setTags(res.data);
                setUserLoading(false);
            } catch (err) {
                console.error('Error fetching tags.', err);
                setUserLoading(false);
            }
        };

        fetch();
    }, [admin]);

    return { userData, userLoading, tags }
}