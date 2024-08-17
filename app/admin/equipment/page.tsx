'use client'

import {useFetchEquipment} from "@/app/api/user/db";
import NavLink from "@/components/navlinks";
import ManageEquipmentWidget from "@/app/admin/equipment/ManageEquipment";

const EquipmentPage = () => {
    return (
        <div>
            <h1>Equipment Site</h1>
            <ManageEquipmentWidget />
            <NavLink href="/admin/equipment/add">+</NavLink>
        </div>
    );
};


export default EquipmentPage;
