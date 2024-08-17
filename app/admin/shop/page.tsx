import NavLink from "@/components/navlinks";
import ManageShopWidget from "@/app/admin/shop/ManageShop";

const ShopPage = () => {
    return (
        <div>
            <h1>Shop Site</h1>
            <ManageShopWidget />
            <NavLink href="/admin/shop/add">+</NavLink>
        </div>
    );
};


export default ShopPage;
