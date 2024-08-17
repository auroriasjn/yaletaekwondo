'use client'

import { useAuth } from "@/app/api/user/auth";

// The Admin Pages are directly linked up to the server.
// No extraneous API calls necessary.
const AdminPage = () => {
    return (
        <div>
            <h1>Administrative Site</h1>
            <p>PLACEHOLDER: If you are on this site, you have administrative access and can edit the SQL database.</p>
        </div>
    );
};


export default AdminPage;
