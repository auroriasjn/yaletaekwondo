'use client'
import { useAuth } from "@/app/api/user/auth";
import NavLink from "@/components/navlinks";
import {useRouter} from "next/navigation";


export default function AddInventoryForm({ shopData = null, shopID }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <div>No access.</div>
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const fetchURL =
                (shopID != "add") ?
                    `http://localhost:3002/api/admin/shop/update/${shopID}`
                    : `http://localhost:3002/api/admin/shop/add`;

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

            router.push('/admin/shop');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    return (
        <div className="form_wrapper">
            <form id="add_equipment_form" method="POST" onSubmit={onSubmit}>
                <label htmlFor="type">Type</label>
                <input type="text" name="type" defaultValue={shopData?.type} required /><br />

                <label htmlFor="size">Size</label>
                <input type="text" name="size" defaultValue={shopData?.size} required /><br /><br />

                <label htmlFor="price">Price</label>
                <input type="number" name="price" step=".01" defaultValue={shopData?.price} required /><br />

                <label htmlFor="stock">Stock</label>
                <input type="number" name="stock" defaultValue={shopData?.stock} required /><br /><br />

                <label htmlFor="description">Description</label><br />
                <textarea id="description" name="description" defaultValue={shopData?.description} rows="4" required /><br /><br />

                <label htmlFor="image">Upload Image</label>
                <input type="file" id="image" name="image" accept="image/png, image/jpeg" /><br /><br />

                <button type="reset" id="reset_button">Reset</button>
                <button type="submit" id="submit_button">Submit</button>
            </form>
            <NavLink href={"http://localhost:3002/api/admin/shop/remove/" + shopID}>Remove</NavLink>
        </div>
    );
}