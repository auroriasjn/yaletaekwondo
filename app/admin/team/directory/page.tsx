'use client'

import { useAuth } from "@/app/api/user/auth";
import {useFetchDirectory} from "@/app/api/user/db";
import NameImporter from "./NameImporter";
import NavLink from '@/components/navlinks';

function DirectoryTable({ directoryData }) {
    return (
        <div className="directory">
            <table id="dir_table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Belt</th>
                        <th>Board</th>
                    </tr>
                </thead>
                <tbody>
                    {directoryData.map((rowData) => (
                        <tr key={rowData.id}>
                            <td>{rowData.firstname + ' ' + rowData.lastname}</td>
                            <td>{rowData.belt}</td>
                            <td>{rowData.board ? "Board" : "Member"}</td>
                            <td><NavLink href={'/admin/team/' + rowData.netid}>Edit</NavLink></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const DirectoryPage = () => {
    const { directoryData, dirLoading } = useFetchDirectory();

    if (dirLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Admin Directory Page</h1>
            <NameImporter />
            <DirectoryTable directoryData={directoryData} />
        </div>
    );
};


export default DirectoryPage;
