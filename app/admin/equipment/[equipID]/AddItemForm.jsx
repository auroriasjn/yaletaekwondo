import NavLink from "@/components/navlinks";
import {useRouter} from "next/navigation";

export default function AddItemForm({ equipData = null, equipID }) {
    const router = useRouter();

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const fetchURL =
            (equipID != "add") ?
                `http://localhost:3002/api/admin/equipment/update/${equipID}`
                : `http://localhost:3002/api/admin/equipment/add`;

        try {
            const response = await fetch(fetchURL, {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            router.push('/admin/equipment');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    let startDate = null, endDate = null;
    if (equipData) {
        startDate = new Date(equipData.start_date).toISOString().slice(0, 16);
        endDate = new Date(equipData.end_date).toISOString().slice(0, 16);
    }

    return (
        <div>
            <form id="add_equipment_form" method="POST" onSubmit={onSubmit}>
                <label htmlFor="serial">Serial</label>
                <input type="text" name="serial" defaultValue={equipData?.serial} required /><br />

                <label htmlFor="type">Type</label>
                <input type="text" name="type" defaultValue={equipData?.type} required /><br />

                <label htmlFor="size">Size</label>
                <input type="text" name="size" defaultValue={equipData?.size} required /><br /><br />

                <label htmlFor="comments">Comments</label><br />
                <textarea id="comments" name="comments" rows="4" defaultValue={equipData?.comments} /><br /><br />

                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={equipData?.status}>
                    <option>FREE</option>
                    <option>PENDING</option>
                    <option>APPROVED</option>
                    <option>BORROWED</option>
                </select><br />

                <label htmlFor="cabinet">Cabinet</label>
                <input type="text" name="cabinet" defaultValue={equipData?.cabinet} /><br />

                <label htmlFor="netID">NetID</label>
                <input type="text" name="netID" defaultValue={equipData?.netid} /><br />

                <label htmlFor="start_date">Start Date</label>
                <input type="datetime-local" name="start_date" defaultValue={startDate} /><br />

                <label htmlFor="start_date">End Date</label>
                <input type="datetime-local" name="end_date" defaultValue={endDate} /><br />

                <label htmlFor="board_member">Board Member NetID</label>
                <input type="text" name="board_member" defaultValue={equipData?.board_member} /><br />

                <button type="reset" id="reset_button">Reset</button>
                <button type="submit" id="submit_button">Save</button>
            </form>
            <NavLink href={"http://localhost:3002/api/admin/equipment/remove/" + equipID}>Remove</NavLink>
        </div>
    )
}