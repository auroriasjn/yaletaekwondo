
// This function fetches *all* of the user data.
import {useEffect, useState} from "react";
import axios from "axios";
import { useAuth } from "./auth";
import {YALIES_API_KEY} from "@/server/config.mjs";

const yalies = require('yalies')

export const yaliesAPI = new yalies.API(`${YALIES_API_KEY}`);


export const useFetchUser = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userAttendance, setUserAttendance] = useState(null);
    const [userEquipment, setUserEquipment] = useState(null);
    const [userDues, setUserDues] = useState(null);

    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            // Generalized User Data
            try {
                const res = await axios.get(`http://localhost:3002/api/user/`,  { withCredentials: true });
                setUserData(res.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setUserLoading(false);
            }

            // Fetching attendance data for the user.
            try {
                const res = await axios.get(`http://localhost:3002/api/user/attendance`,  { withCredentials: true });
                setUserAttendance(res.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setUserLoading(false);
            }

            // Fetching the user's purchases.
            try {
                const res = await axios.get(`http://localhost:3002/api/user/equipment`,  { withCredentials: true });
                setUserEquipment(res.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setUserLoading(false);
            }

            // Fetching the user's dues.
            try {
                const res = await axios.get(`http://localhost:3002/api/user/dues`,  { withCredentials: true });
                setUserDues(res.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setUserLoading(false);
            }
        };

        fetch();
    }, [user]);

    return { userData, userAttendance, userEquipment, userDues, userLoading };
};

export const useFetchData = () => {
    const { user } = useAuth();
    const [belts, setBelts] = useState(null);
    const [tags, setTags] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            // Getting all belt data.
            try {
                const res = await axios.get(`http://localhost:3002/api/user/belts`,  { withCredentials: true });
                console.log(res);
                setBelts(res.data);
            } catch (err) {
                console.error('Error fetching belts:', err);
                setDataLoading(false);
            }

            // Getting all tag data
            try {
                const res = await axios.get(`http://localhost:3002/api/user/tags`,  { withCredentials: true });
                setTags(res.data);
            } catch (err) {
                console.error('Error fetching belts:', err);
            } finally {
                setDataLoading(false);
            }
        };

        fetch();
    }, [user]);

    return { belts, tags, dataLoading }
}

export const useFetchDirectory = () => {
    const { user } = useAuth();
    const [directoryData, setDirectoryData] = useState(null);
    const [dirLoading, setDirLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            // Getting directory.
            try {
                const res = await axios.get(`http://localhost:3002/api/user/directory`,  { withCredentials: true });

                // Sort the data by firstname and board status.
                const sortedData = res.data.sort((a, b) => {
                    if (a.board !== b.board) {
                        return b.board - a.board; // Sort by board status (true first)
                    }
                    return a.lastname.localeCompare(b.lastname); // Sort by firstname
                });

                setDirectoryData(sortedData);
            } catch (err) {
                console.error('Error fetching directory:', err);
            } finally {
                setDirLoading(false);
            }
        };

        fetch();
    }, [user]);

    return { directoryData, dirLoading }
}


export const useFetchEquipment = (id = null) => {
    const { user } = useAuth();
    const [equipmentData, setEquipmentData] = useState(null);
    const [equipLoading, setEquipLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            let fetchURL = `http://localhost:3002/api/equipment`;
            if (id) {
                fetchURL = `http://localhost:3002/api/equipment/${id}`
            }

            // Getting directory.
            try {
                const res = await axios.get(fetchURL,  { withCredentials: true });
                setEquipmentData(res.data);
            } catch (err) {
                console.error('Error fetching equipment', err);
            } finally {
                setEquipLoading(false);
            }
        };

        fetch();
    }, [user]);

    return { equipmentData, equipLoading }
}

export const useFetchShop = (id = null) => {
    const { user } = useAuth();
    const [shopData, setShopData] = useState(null);
    const [shopLoading, setShopLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            // Fetching all shop items.
            let fetchURL = `http://localhost:3002/api/shop`;
            if (id) {
                fetchURL = `http://localhost:3002/api/shop/inventory/${id}`
            }

            try {
                const res = await axios.get(fetchURL,  { withCredentials: true });
                setShopData(res.data);
            } catch (err) {
                console.error('Error fetching shop.', err);
            } finally {
                setShopLoading(false);
            }
        };

        fetch();
    }, [user]);

    return { shopData, shopLoading }
}

export const useFetchEvents = () => {
    const {user} = useAuth();
    const [events, setEvents] = useState(null);
    const [eventLoading, setEventLoading] = useState(true);

    const handleRecurring = (item) => {
        const start = new Date(Date.parse(item.start_date));
        const final = new Date(Date.parse(item.end_date)) // Stores end date and time of ending

        let current = new Date(start);
        const eventEntries = [];

        while (current <= final) {
            const begin = new Date(current);
            const end = new Date(current);

            end.setHours(final.getHours(), final.getMinutes(), final.getSeconds());

            // Check if the event is all-day
            const allDay = (
                begin.getHours() === 0 && begin.getMinutes() === 0 && begin.getSeconds() === 0 &&
                end.getHours() === 23 && end.getMinutes() === 59 && end.getSeconds() === 59 && end.getMilliseconds() === 999
            );

            eventEntries.push({
                id: item.id,
                title: item.title,
                allDay: allDay,
                start: begin,
                end: end,
                type: item.category,
                period: item.period,
                final: final
            });

            // Increment date counter by one week!
            const space = (interval) => {
                switch (interval) {
                    case "DAY":
                        return { days: 1 };
                    case "WEEK":
                        return { days: 7 };
                    case "MONTH":
                        return { months: 1 };
                    case "YEAR":
                        return { years: 1 };
                    default:
                        return { days: 1 };
                }
            };

            const addInterval = (currentDate, increment) => {
                if (increment.days) {
                    currentDate.setDate(currentDate.getDate() + increment.days);
                }
                if (increment.months) {
                    currentDate.setMonth(currentDate.getMonth() + increment.months);
                }
                if (increment.years) {
                    currentDate.setFullYear(currentDate.getFullYear() + increment.years);
                }
            };

            addInterval(current, space(item.period));
        }

        return eventEntries;
    }

    useEffect(() => {
        const fetch = async () => {
            if (!user) return;

            try {
                const res = await axios.get(`http://localhost:3002/api/user/events`, { withCredentials: true });
                const events = res.data;
                const mappedData = events.map((item) => {
                    // Recurring events
                    if (item.period !== -1) {
                        return handleRecurring(item);
                    }

                    // Nonrecurring events
                    return {
                        id: item.id,
                        title: item.title,
                        allDay: (item.start_date === item.end_date),
                        start: new Date(Date.parse(item.start_date)),
                        end: new Date(Date.parse(item.end_date)),
                        type: item.category,
                    };
                });
                setEvents(mappedData.flat());
            } catch (err) {
                console.error('Error fetching events.', err);
            } finally {
                setEventLoading(false);
            }
        };

        fetch();
    }, [user]);

    return {events, eventLoading};
}
