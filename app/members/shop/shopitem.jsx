import { useState, useEffect } from "react";
import Image from "next/image";
import NavLink from "@/components/navlinks";
import AddToCartButton from "./CartButton";

export default function ShopItem({ rowData, shopData, admin }) {
    // Initialize formData with default values derived from rowData
    const [formData, setFormData] = useState({ quantity: 1, size: rowData.size });
    let id = rowData.id;
    let price = rowData.price;

    const shopStatus = () => {
        const row = shopData.find((row) => row.type === rowData.type && row.size === formData.size);

        if (!row) {
            return <h4>Item not found</h4>; // Handle case where no item matches
        }

        if (row.stock <= 0) {
            return <h4>None In Stock</h4>;
        }

        // Changing ID
        id = row.id;
        price = row.price;

        return (
            <>
                <h4>Stock: {row.stock}</h4>
                <h3>Price: {row.price.toFixed(2)}</h3>
            </>
        );
    }

    useEffect(() => {
        // If rowData has a default size, initialize the size in formData
        const defaultSize = shopData.find(item => item.equipID === rowData.equipID)?.size || '';
        setFormData({ quantity: 1, size: defaultSize });
    }, [rowData, shopData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const getOptions = () => {
        return shopData
            .filter(row => row.equipID === rowData.equipID)
            .sort((a, b) => {
                if (typeof a.size === 'number' && typeof b.size === 'number') {
                    return a.size - b.size;
                }
                return 0;
            })
            .map((row, index) => (
                <option key={index} value={row.size} disabled={!row.stock}>{row.size}</option>
            ));
    };

    return (
        <div className="shop_item" id={rowData.type}>
            <div>
                {rowData.image && <Image src={rowData.image} width={100} height={250} alt={rowData.type} />}
            </div>
            <div>
                {shopStatus()}
                <form method="POST" id="descriptor">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        min={0}
                        max={rowData.stock}
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="size">Size</label>
                    <select
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        required
                    >
                        {getOptions()}
                    </select>
                </form>
                <AddToCartButton product={{ id: id, type: rowData.type, price: price, ...formData }} />
                {admin && <NavLink href={`/admin/shop/${id}`}>Edit</NavLink>}
            </div>
        </div>
    );
}
