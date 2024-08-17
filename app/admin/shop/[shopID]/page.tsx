'use client'

import AddInventoryForm from "./AddInventoryForm";
import {useFetchShop} from "@/app/api/user/db";

export default function ShopEditItem({ params }) {
    const id = params.shopID;
    const { shopData, shopLoading } = useFetchShop(id);

    if (shopLoading) {
        return <div>Loading...</div>
    }

    if (id === 'add') {
        return (
            <div className="shop_edit_wrapper">
                <h1>Add Shop Item</h1>
                <AddInventoryForm shopID={id} />
            </div>
        )
    }

    return (
        <div className="shop_edit_wrapper">
            <h1>Edit Shop Item</h1>
            <AddInventoryForm shopData={shopData?.[0]} shopID={id} />
        </div>
    )
};
