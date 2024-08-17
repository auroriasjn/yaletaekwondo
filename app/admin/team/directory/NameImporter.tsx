export default function NameImporter() {
    // TODO: Make a neat little drop down.
    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch(`http://localhost:3002/api/admin/add/`, {
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

            location.reload();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    return (
        <div className="name_importer">
            <form method="POST" name="name_importer" onSubmit={onSubmit}>
                <input type="text" placeholder="NetID" name="netID"/>
                <button type="submit" id="name_submit">+</button>
            </form>
        </div>
    )
}