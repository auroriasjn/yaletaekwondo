import NavLink from "@/components/navlinks";
import AddToCartButton from "./CartButton.jsx";

export const equipDate = (dateString) => {
    let dateObj = new Date(dateString);

    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();

    // Convert 24-hour format to 12-hour format
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return month + '/' + day + ' at ' + hours + ':' + minutes + period;
};

export const equipName = (type, size) => {
    if (!type) return ""
    if (!size) return type

    return type + ", Size " + size;
}

export default function EquipCard({ equipmentData, admin }) {
    const equipStatus = () => {
        switch (equipmentData.status) {
            case 'BORROWED':
                return (
                    <>
                        <h4>BORROWED</h4>
                        <h5>START: {equipDate(equipmentData.start_date)}</h5>
                        <h5>END: {equipDate(equipmentData.end_date)}</h5>
                    </>
                );
            case 'PENDING':
            case 'APPROVED':
                return (
                    <>
                        <h4>{equipmentData.status}</h4>
                        <h5>REQUESTED: {equipDate(equipmentData.request_date)}</h5>
                    </>
                );
        }

        return (
            <>
                <h4>{equipmentData.status}</h4>
            </>
        )
    }

    return (
        <div className="equipment_card" id={equipmentData.id}>
            <h2>{equipName(equipmentData.type, equipmentData.size)}</h2>
            <p className="equipment_id">Equipment Serial #{equipmentData.serial}</p>
            <p className="equipment_description">{equipmentData.comments}</p>
            {equipStatus()}
            { admin && <NavLink href={`/admin/equipment/${equipmentData.id}`}>Edit</NavLink>}
            { (equipmentData.status === 'APPROVED' || equipmentData.status === 'PENDING') &&
                <NavLink href="#">Cancel</NavLink>
            }
            { equipmentData.status === 'BORROWED' &&
                <NavLink href={`/members/equipment/return/${equipmentData.id}`}>Return</NavLink>
            }
            { equipmentData.status === 'FREE' && <AddToCartButton product={equipmentData} />}
        </div>
    )
}