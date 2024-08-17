import { useRouter } from "next/navigation";

export default function CheckinForm({data, netID}) {
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        for (const item of formData) {
            console.log(item);
        }

        try {
            const checkinEmail = await fetch('http://localhost:3002/api/equipment/checkin/email', {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!checkinEmail.ok) {
                throw new Error('Network response was not ok');
            }

            const checkinResponse = await fetch('http://localhost:3002/api/equipment/checkin', {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!checkinResponse.ok) {
                throw new Error('Network response was not ok');
            }

            router.push('/members/equipment');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    return (
        <div>
            <form id="checkin" method="POST" onSubmit={handleSubmit}>
                <p>Which equipment do you want to check-out?</p>
                {data.map((row) => (
                    <>
                        <label htmlFor={row.id}>{row.type}, Serial {row.serial}: Cabinet {row.cabinet}</label>
                        <input type="checkbox" key={row.serial} id={row.id} name={row.id} /><br />
                    </>
                ))}
                <br />
                <label htmlFor="netid">Please type your NetID: </label>
                <input type="text" name="netid" id="netid" required />

                <button type="reset" id="reset_button">Reset</button>
                <button type="submit" id="submit_button">Checkout</button>
            </form>
        </div>
    );
}