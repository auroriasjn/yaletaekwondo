import { useRouter } from 'next/navigation';

export default function ReturnForm({data, netID, equipID }) {
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch(`http://localhost:3002/api/equipment/return`, {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            router.push('/members/equipment');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    const equipmentDialog = (equipID) => {
        if (equipID == -1) {
            return (
                <>
                    <p>Which equipment do you want to return?</p>
                    {data.map((row) => (
                        <>
                            <label htmlFor={row.id}>{row.type}, Serial {row.serial}: Cabinet {row.cabinet}</label>
                            <input type="checkbox" key={row.serial} id={row.id} name={row.id}/><br/>
                        </>
                    ))}
                </>
            );
        }

        const dataRow = data.filter((row) => row.id === Number(equipID))[0];

        return (
            <>
                <label htmlFor={equipID}>Check this to confirm you are returning ID#{dataRow.serial}: </label>
                <input type="checkbox" id={equipID} name={equipID} /><br />
            </>
        )
    }

    return (
        <div>
            <form id="checkin" method="POST" onSubmit={handleSubmit}>
                {equipmentDialog(equipID)}
                <label htmlFor="netid">Please type your NetID: </label>
                <input type="text" name="netid" id="netid" required />

                <p>TODO: Please upload pictures of your equipment here.</p>

                <button type="reset" id="reset_button">Reset</button>
                <button type="submit" id="submit_button">Save</button>
            </form>
        </div>
    );
}