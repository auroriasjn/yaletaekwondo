import { useRouter } from 'next/navigation';

export default function ApprovalForm({ data=null, netID }) {
    const filteredData = (data, netID) => {
        return data.filter(row => (row.netid === netID && row.status == 'PENDING'));
    }

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const approveEmail = await fetch(`http://localhost:3002/api/admin/equipment/approve/email/${netID}`, {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!approveEmail.ok) {
                throw new Error('Network response was not ok');
            }

            const approveResponse = await fetch(`http://localhost:3002/api/admin/equipment/approve`, {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!approveResponse.ok) {
                throw new Error('Network response was not ok');
            }

            console.log("Redirecting!");
            router.push('/admin/equipment');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    return (
        <form method="POST" id="approval_form" onSubmit={handleSubmit}>
            {filteredData(data, netID).map((row) => (
                <>
                    <h3 key={row.id}>{row.type}, Size {row.size}</h3>
                    <label htmlFor={row.id + "_approved"}>APPROVED</label>
                    <input type="radio" name={row.id} id={row.id + "_approved"} value="APPROVED" />

                    <label htmlFor={row.id + "_denied"}>DENIED</label>
                    <input type="radio" name={row.id} id={row.id + "_denied"} value="DENIED" />
                </>
            ))}

            <button type="reset" id="reset_button">Reset</button>
            <button type="submit" id="submit_button">Save</button>
        </form>
    );
}