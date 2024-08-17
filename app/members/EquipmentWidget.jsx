import NavLink from "@/components/navlinks";
import { equipDate, equipName } from "@/app/members/equipment/equipcard";

export default function EquipmentComp({ equipment }) {
    let borrowed = equipment.equipment
    let purchased = equipment.shop;

    return (
        <div className="equipment">
            <h2 id="equipment_title">My Stuff</h2>
            <NavLink href="/members/equipment">Manage</NavLink>
            <table id="equipment_table">
                <tbody>
                    {borrowed.map((rowData) => (
                        <tr key={rowData.id}>
                            <td>{equipName(rowData.type, rowData.size)}</td>
                            <td id="equipment_status">{rowData.status}</td>
                            <td>Ends: {equipDate(rowData.end_date)}</td>
                        </tr>
                    ))}
                    {purchased.map((rowData) => (
                        <tr key={rowData.id}>
                            <td>{equipName(rowData.type, rowData.size)}</td>
                            <td id="equipment_status">
                                {(rowData.status.toLowerCase() === "approved") ?
                                    "PURCHASED" : rowData.status.toUpperCase()}</td>
                            <td>Purchased: {equipDate(rowData.date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}