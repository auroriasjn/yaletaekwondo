'use client'

import { useAuth } from "@/app/api/user/auth";
import {useFetchEquipment} from "@/app/api/user/db";
import EquipmentCard from "@/app/members/equipment/equipcard";
import NavLink from "@/components/navlinks";
import Search from "@/components/searchbar";
import DirectoryCard from "@/app/members/team/directory/dircard";

function loadEquipment(admin: number, equipmentData, query) {
    if (query === '') {
        return (
            <div className="equipment_carousel">
                {equipmentData.map((rowData) => (
                    <EquipmentCard key={rowData.netid} admin={admin} equipmentData={rowData}/>
                ))}
            </div>
        )
    }

    const lowerCaseQuery = query.toLowerCase();
    const filteredData = equipmentData.filter((rowData) => {
        return Object.values(rowData).some(value =>
            value?.toString().toLowerCase().includes(lowerCaseQuery)
        );
    });

    return (
        <div className="directory">
            {filteredData.length > 0 ? (
                filteredData.map((rowData) => (
                    <EquipmentCard key={rowData.netid} admin={admin} equipmentData={rowData}/>
                ))
            ) : (
                <p>No results found for &quot;{query}&quot;</p>
            )}
        </div>
    );
}

const EquipmentPage = ({ searchParams }: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) => {
    const { user, admin, loading } = useAuth(); // Get the user data here
    const { equipmentData, equipLoading } = useFetchEquipment();

    const query = searchParams?.query || '';

    if (loading || equipLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!user) {
        return <div>Access denied.</div>
    }

    return (
        <div>
            <h1>Equipment Page</h1>
            <Search placeholder={"Your search here..."} />
            {loadEquipment(admin, equipmentData, query)}
            <NavLink href={'/members/equipment/checkout'}>Checkout</NavLink>
        </div>
    );
};


export default EquipmentPage;
