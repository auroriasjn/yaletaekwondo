'use client'

import {useFetchEquipment} from "@/app/api/user/db";
import { useAuth } from "@/app/api/user/auth";
import CheckinForm from "./CheckinForm";

const CheckinPage = () => {
    const { user } = useAuth();
    const {equipmentData, equipLoading} = useFetchEquipment();

    if (equipLoading) {
        return <div>Loading...</div>
    }

    const filteredData = () => {
        return equipmentData.filter(row => (row.netid === user.netID && row.status == 'APPROVED'));
    }

    return (
        <div>
            <h1>Check-In Form</h1>
            <p>Thank you for using the Check-in Form!</p>
            <h3>Terms and Conditions</h3>
            <small>
                <ul>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                    <li>Ut enim ad minim veniam, quis nostrud exercitation</li>
                    <li>ullamco laboris nisi ut aliquip ex ea commodo consequat</li>
                </ul>
            </small>

            <CheckinForm data={filteredData()} netID={user.netID}/>
        </div>
    );
}

export default CheckinPage;