'use client'

import { useState } from 'react';

import Image from "next/image";
import NavLink from "@/components/navlinks";
import ShopItem from "@/app/members/shop/shopitem";

export default function ShopCard({ rowData, shopData, admin }) {
    const [options, setOptions] = useState(false);

    const addToBag = async () => {
        setOptions(!options);
    }

    return (
        <div className="shop_card" id={rowData.id}>
            <h2>{rowData.type}</h2>
            {rowData.image != null && <Image src={rowData.image} width={100} height={250} alt={rowData.type}/>}
            { admin && <NavLink href={`/admin/shop/${rowData.id}`}>Edit</NavLink>}
            <button className="add_to_bag" onClick={() => addToBag()}>Add to Bag</button>
            {options && <ShopItem rowData={rowData} shopData={shopData} admin={admin} />}
        </div>
    )
}