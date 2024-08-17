'use client'

import NavLink from "@/components/navlinks";
import {useFetchShop} from "@/app/api/user/db";

const ManageShopWidget = () => {
    const { shopData, shopLoading } = useFetchShop();

    if (shopLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <table className="condensed_equipment_table">
                <tr>
                    <th>Equipment ID</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Stock</th>
                </tr>
                {shopData.map((rowData) => (
                    <tr key={rowData.id}>
                        <td>{rowData.id}</td>
                        <td>{rowData.type}</td>
                        <td>{rowData.size}</td>
                        <td>{rowData.price}</td>
                        <td>{rowData.stock}</td>
                        <td><NavLink href={`/admin/shop/${rowData.id}`}>Edit</NavLink></td>
                    </tr>
                ))}
            </table>
        </div>
    );
};


export default ManageShopWidget;
