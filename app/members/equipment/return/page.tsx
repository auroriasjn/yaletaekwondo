'use client'

import {useFetchEquipment} from "@/app/api/user/db";
import { useAuth } from "@/app/api/user/auth";
import ReturnForm from "./ReturnForm";

const ReturnPage = () => {
    const { user } = useAuth();
    const {equipmentData, equipLoading} = useFetchEquipment();

    if (equipLoading) {
        return <div>Loading...</div>
    }

    const filteredData = () => {
        return equipmentData.filter(row => (row.netid === user.netID && row.status == 'BORROWED'));
    }

    return (
        <div>
            <h1>Return Form</h1>
            <p>Please take a photo of your equipment and where you stored it! Checkout location
            should be the same as for Check-In.</p>
            <ReturnForm data={filteredData()} netID={user.netID}/>
        </div>
    );
}

export default ReturnPage;