'use client'

import {useFetchEquipment, useFetchShop} from "@/app/api/user/db";
import AddItemForm from "./AddItemForm";
import AddInventoryForm from "@/app/admin/shop/[shopID]/AddInventoryForm";

export default function EquipmentEditItem({ params }) {
    const id = params.equipID
    const { equipmentData, equipLoading } = useFetchEquipment(id);

    if (equipLoading) {
        return <div>Loading...</div>
    }

    if (id === 'add') {
        return (
            <div className="shop_edit_wrapper">
                <h1>Add Equipment</h1>
                <AddItemForm equipID={id} />
            </div>
        )
    }

    return (
        <div className="shop_edit_wrapper">
            <h1>Equipment Editor</h1>
            <AddItemForm equipData={equipmentData?.[0]} equipID={id} />
        </div>
    )
};
