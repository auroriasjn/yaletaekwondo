'use client'

import { useFetchEquipment } from "@/app/api/user/db";
import ApprovalForm from "./ApprovalForm.jsx";

const ApprovalPage = ({ params }) => {
    const netID = params.netID;
    const { equipmentData, equipLoading } = useFetchEquipment();

    if (equipLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Approval Site</h1>
            <ApprovalForm data={equipmentData} netID={netID} />
        </div>
    );
};


export default ApprovalPage;
