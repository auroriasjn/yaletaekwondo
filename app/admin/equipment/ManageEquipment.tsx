'use client'

import NavLink from "@/components/navlinks";
import {useFetchEquipment} from "@/app/api/user/db";

const ManageEquipmentWidget = () => {
    const { equipmentData, equipLoading } = useFetchEquipment();

    if (equipLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <table className="condensed_equipment_table">
                <tr>
                    <th>Equipment Serial</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Borrowed</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Board Member Date</th>
                </tr>
                {equipmentData.map((rowData) => (
                    <tr key={rowData.id}>
                        <td>{rowData.serial}</td>
                        <td>{rowData.type}</td>
                        <td>{rowData.size}</td>
                        <td>{rowData.status}</td>
                        <td>{rowData.start_date}</td>
                        <td>{rowData.end_date}</td>
                        <td>{rowData.board_member}</td>
                        <td><NavLink href={`/admin/equipment/${rowData.id}`}>Edit</NavLink></td>
                    </tr>
                ))}
            </table>
        </div>
    );
};


export default ManageEquipmentWidget;
