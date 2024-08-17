'use client'

import { useAuth } from "@/app/api/user/auth";
import {useFetchShop} from "@/app/api/user/db";
import ShopCard from "@/app/members/shop/shopcard";
import NavLink from "@/components/navlinks";
import Search from "@/components/searchbar";

function loadShop(admin: number, shopData, query) {
    return (
        <div className="equipment_carousel">
            {Array.from(new Map(shopData.map(item => [item.type, item])).values())
                .map((rowData) => (
                    <ShopCard
                        key={rowData.id}
                        admin={admin}
                        rowData={rowData}
                        shopData={shopData}
                    />
                ))}
        </div>
    )
}

const ShopPage = ({ searchParams }: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) => {
    const { user, admin, loading } = useAuth(); // Get the user data here
    const { shopData, shopLoading } = useFetchShop();

    const query = searchParams?.query || '';

    if (loading || shopLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!user) {
        return <div>Access denied.</div>
    }

    return (
        <div>
            <h1>Shop Page</h1>
            <Search placeholder={"Your search here..."} />
            <div id="shop_page_description">
                <h3>How to Order</h3>
                <ol id="checkout_list">
                    <li>Select items and add to cart</li>
                    <li>In Checkout, enter any state/address (ex: 123 Yale Street, New York, NY, etc.)</li>
                    <li>Venmo @ yaletaekwondo (or just use the same method you paid dues with)  - Please include your name & item in the description!</li>
                    <li>Pick up at practice!</li>
                </ol>
            </div>
            {loadShop(admin, shopData, query)}
            <NavLink href={'/members/shop/checkout'}>Checkout</NavLink>
        </div>
    );
};


export default ShopPage;
