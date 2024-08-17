'use client'

import { useAuth } from "@/app/api/user/auth";
import {useFetchData, useFetchDirectory} from "@/app/api/user/db";
import DirectoryCard from "./dircard";
import Search from "@/components/searchbar";

function loadDirectory(admin: number, tags, directoryData, query) {
    if (query === '') {
        return (
            <div className="directory">
                {directoryData.map((rowData) => (
                    <DirectoryCard key={rowData.netid} admin={admin} userData={rowData} tags={tags}/>
                ))}
            </div>
        )
    }

    const lowerCaseQuery = query.toLowerCase();
    const filteredData = directoryData.filter((rowData) => {
        return Object.values(rowData).some(value =>
            value?.toString().toLowerCase().includes(lowerCaseQuery)
        );
    });

    return (
        <div className="directory">
            {filteredData.length > 0 ? (
                filteredData.map((rowData) => (
                    <DirectoryCard key={rowData.netid} admin={admin} userData={rowData} tags={tags}/>
                ))
            ) : (
                <p>No results found for &quot;{query}&quot;</p>
            )}
        </div>
    );
}

const DirectoryPage = ({ searchParams }: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) => {
    const { user, admin, loading } = useAuth(); // Get the user data here
    const { directoryData, dirLoading } = useFetchDirectory();
    const { tags, dataLoading } = useFetchData();

    // Search Params QUERY
    const query = searchParams?.query || '';

    if (loading || dirLoading || dataLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!user) {
        return <div>Access denied.</div>
    }

    return (
        <div>
            <h1>Directory Page</h1>
            <Search placeholder={"Your search here..."} />
            {loadDirectory(admin, tags, directoryData, query)}
        </div>
    );
};


export default DirectoryPage;
