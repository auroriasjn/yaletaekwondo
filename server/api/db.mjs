import { createRequire } from 'module';
import {FRONTEND_URL, YALIES_API_KEY} from "../config.mjs";
const require = createRequire(import.meta.url);
const serverlessMysql = require('serverless-mysql');

const yalies = require('yalies')
export const yaliesAPI = new yalies.API(`${YALIES_API_KEY}`);

/** INITIAL CONFIG **/
export const db = serverlessMysql({
    config: {
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'yaletaekwondo'
    }
});

/** GETTERS **/
const getCurDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const getAuthenticatedUser = (req, res) => {
    const curUser = req.session.passport.user;
    if (!curUser || !curUser.netID) {
        res.status(400).json({ success: false, message: "User not authenticated" });
        return null;
    }
    return curUser;
};

export const getUserFromNetID = async (req, res) => {
    const userId = req.params.netid; // Extract id parameter from URL
    try {
        const user = await db.query('SELECT * FROM members WHERE netID=?', [userId]);
        res.status(200).json(user[0]); // Send JSON response with user data (assuming id is unique)
    } catch (error) {
        console.error('Error in getting member from NetID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Retrieves all data about the current user.
export const getCurUser = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const userData = await db.query('SELECT * FROM members WHERE id=?', [curUser.user]);
        res.status(200).json(userData[0]);
    } catch (error) {
        console.error("Error fetching session user data:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve session user data" });
    }
}

// Retrieves attendance data for a user
export const getCurAttendance = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const userData = await db.query('SELECT * FROM attendance WHERE netid=? LIMIT 10', [curUser.netID]);
        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching session attendance:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve session attendance" });
    }
}

// Retrieves equipment data for a user
export const getCurUserEquipment = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const equipData = await db.query('SELECT * FROM equipment WHERE netid=?', [curUser.netID]);
        const shopData = await db.query('SELECT * FROM shop_purchases WHERE netid=?', [curUser.netID]);

        const responseData = {
            equipment: equipData,
            shop: shopData
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching session equipment data:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve session equipment data" });
    }
}



// Universals.
export const getPurchaseByID = async (req, res) => {
    const ID = req.params.id;
    try {
        const equipData = await db.query('SELECT * FROM shop_purchases WHERE `id`=?', [ID]);
        res.status(200).json(equipData);
        return;
    } catch (error) {
        console.error("Error fetching session attendance:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve session attendance" });
    }
}

export const getShopInventoryByID = async (req, res) => {
    const ID = req.params.id;
    try {
        const equipData = await db.query('SELECT * FROM shop_inventory WHERE `id`=?', [ID]);
        res.status(200).json(equipData);
    } catch (error) {
        console.error("Error fetching shop inventory id:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve shop inventory id." });
    }
}

export const getEquipmentByID = async (req, res) => {
    const ID = req.params.id;
    try {
        const equipData = await db.query('SELECT * FROM equipment WHERE `id`=?', [ID]);
        res.status(200).json(equipData);
    } catch (error) {
        console.error("Error fetching session attendance:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve session attendance" });
    }
}

export const getCurDues = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const duesData = await db.query('SELECT * FROM dues WHERE `netid`=?', [curUser.netID]);
        res.status(200).json(duesData);
    } catch (error) {
        console.error("Error fetching dues:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve dues." });
    }
}

export const getMemberDirectory = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const query =
            `SELECT firstname, 
                lastname, 
                preferred_name, 
                pronouns, 
                netid, 
                email, 
                college, 
                affiliation, 
                offices,
                grad, 
                belt, 
                board,
                admin,
                tags,
                default_pfp,
                pfp 
             FROM members`;

        const dirData = await db.query(query);
        res.status(200).json(dirData);
    } catch (error) {
        console.error("Error fetching directory:", error);
        res.status(500).json({ success: false, message: "User tags" });
    }
}

export const getAllTags = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const tagData = await db.query('SELECT * FROM tags');
        res.status(200).json(tagData);
        return;
    } catch (error) {
        console.error("Error fetching user tags:", error);
        res.status(500).json({ success: false, message: "User tags" });
    }
}

export const getAllEquipment = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res); 
        if (!curUser) return;

        const tagData = await db.query('SELECT * FROM equipment');
        res.status(200).json(tagData);
        return;
    } catch (error) {
        console.error("Error fetching equipment:", error);
        res.status(500).json({ success: false, message: "Equipment." });
    }
}

export const getAllBelts = async (req, res) => {
    try {
        const beltData = await db.query('SELECT * FROM belts');
        res.status(200).json(beltData);
    } catch (error) {
        console.error("Error fetching belts:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve belts." });
    }
}

export const getAllAttendance = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const userData = await db.query(`
            SELECT attendance.*, members.firstname, members.lastname 
            FROM attendance 
            JOIN members ON attendance.netID = members.netID 
            LIMIT 20
        `);

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching session attendance:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve session attendance" });
    }
}

export const getAllDues = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const duesData = await db.query('SELECT * FROM dues');
        res.status(200).json(duesData);
        return;
    } catch (error) {
        console.error("Error fetching dues:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve dues." });
    }
}

export const getAllShop = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const duesData = await db.query('SELECT * FROM shop_inventory');
        res.status(200).json(duesData);
    } catch (error) {
        console.error("Error fetching dues:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve shop items." });
    }
}

export const getAllEvents = async (req, res) => {
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        const eventData = await db.query('SELECT * FROM calendar');
        res.status(200).json(eventData);
    } catch (error) {
        console.error("Error fetching dues:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve shop items." });
    }
}


/** UPDATERS **/
export const updateCurUser = async (req, res) => {
    const data = req.body;
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { email, phone, affiliation, grad, pronouns } = data;

        const query = `
            UPDATE members 
                SET email=?, 
                    phone=?, 
                    affiliation=?, 
                    grad=?, 
                    pronouns=?
            WHERE netid=?
        `

        const params = [email, phone, affiliation, grad, pronouns, curUser.netID];

        const response = await db.query(query, params);
        res.status(200).json({ success: true, message: "Successfully updated members!" });
    } catch (error) {
        console.error("Error updating.", error);
        res.status(500).json({ success: false, message: "Failed to update members." });
    }
}

export const updateUserAtNetID = async (req, res) => {
    const data = req.body;
    const netID = req.params.netid;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { email, phone, affiliation, grad, belt, pronouns, offices, board, admin, active, tags } = data;

        // Convert 'on'/'off' to '1'/'0'
        const boardValue = board === 'on' ? '1' : '0';
        const adminValue = admin === 'on' ? '1' : '0';
        const activeValue = active === 'on' ? '1' : '0';

        const officeVal = offices ? offices : '';

        const query = `
            UPDATE members 
                SET email=?, 
                    phone=?, 
                    affiliation=?, 
                    grad=?, 
                    belt=?, 
                    pronouns=?, 
                    offices=?,
                    board=?,
                    admin=?,
                    active=?,
                    tags=?
            WHERE netid=?
        `

        const params = [email, phone, affiliation, grad, belt, pronouns, officeVal, boardValue, adminValue, activeValue, tags, netID];

        const response = await db.query(query, params);
        res.status(200).json({ success: true, message: "Members updated!" });
    } catch (error) {
        console.error("Error updating.", error);
        res.status(500).json({ success: false, message: "Failed to update members." });
        res.redirect(`${FRONTEND_URL}/admin/team/directory`);
    }
}

export const updateShopID = async (req, res) => {
    const data = req.body;
    const id = req.params.shopid;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { type, size, price, stock, description } = data;

        const query = `
            UPDATE shop_inventory
                SET type=?,
                    size=?,
                    price=?,
                    stock=?,
                    description=?
            WHERE id=?    
        `;

        const params = [type, size, price, stock, description, id];

        const response = await db.query(query, params);
        res.status(200).redirect(`${FRONTEND_URL}/admin/shop`);
    } catch (error) {
        console.error("Error updating.", error);
        res.status(500).json({ success: false, message: "Failed to update shop." });
        res.redirect(`${FRONTEND_URL}/admin/shop`);
    }
}

export const updateEquipID = async (req, res) => {
    const data = req.body;
    const id = req.params.equipid;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { serial, type, size, status, netID, start_date, end_date, board_member, comments } = data;

        // Logging mechanism. Only log when a piece of equipment changed from borrowed to free.
        const statusQuery = await db.query('SELECT * FROM equipment WHERE id=?', [id]);
        if (statusQuery != null
            && statusQuery.length > 0
            && status != 'BORROWED'
            && statusQuery[0]['status'] == 'BORROWED'
        ) {
            // Begin logging
            const logQuery = `
                INSERT INTO equipment_log (
                    serial,
                    netid,
                    start_date,
                    end_date,
                    board_member
                ) VALUES (?, ?, ?, ?, ?)
            `;

            const params = [
                statusQuery[0]['serial'],
                statusQuery[0]['netid'],
                statusQuery[0]['start_date'],
                statusQuery[0]['end_date'],
                statusQuery[0]['board_member']
            ];

            const logResponse = await db.query(logQuery, params);
        }

        const query = `
            UPDATE equipment
                SET serial=?,
                    type=?,
                    size=?,
                    status=?,
                    netid=?,
                    start_date=?,
                    end_date=?,
                    board_member=?,
                    comments=?
            WHERE id=?    
        `;

        const params = [
            serial,
            type,
            size,
            status,
            netID,
            start_date,
            end_date,
            board_member,
            comments,
            id
        ];

        const response = await db.query(query, params);
        res.status(200).redirect(`${FRONTEND_URL}/admin/shop`);
    } catch (error) {
        console.error("Error updating.", error);
        res.status(500).json({ success: false, message: "Failed to update shop." });
        res.redirect(`${FRONTEND_URL}/admin/shop`);
    }
}

export const reserveEquipment = async (req, res) => {
    const data = req.body;

    try {
        const curUser = req.session.passport.user;
        if (!curUser || !curUser.netID) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: "No items in cart" });
        }

        // Handle reservations with concurrency control
        for (const item of data) {
            const { id } = item;

            // Check current status and update if available
            const [currentItem] = await db.query(`
                SELECT status FROM equipment WHERE id = ?
            `, [id]);

            if (currentItem.status !== 'FREE') {
                // Skip or handle case where item is not available
                console.warn(`Item ${id} is not available for reservation.`);
                continue;
            }

            await db.query(`
                UPDATE equipment 
                SET status = 'PENDING', request_date = ?, netid = ? 
                WHERE id = ? AND status = 'FREE'
            `, [getCurDateTime(), curUser.netID, id]);

            console.log(`Reserved item ${id}`);
        }

        return res.status(200).redirect(`${FRONTEND_URL}/members/equipment`);
    } catch (error) {
        console.error("Error reserving equipment:", error);
        return res.status(500).json({ success: false, message: "Failed to reserve equipment" });
    }
};

export const approveEquipment = async (req, res) => {
    const data = req.body;

    console.log("Approving equipment...");
    try {
        const curUser = req.session.passport.user;
        if (!curUser || !curUser.netID) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        // Approving
        for (const [id, status] of Object.entries(data)) {
            if (status === 'DENIED') {
                await db.query(`
                    UPDATE equipment 
                    SET status = 'FREE'
                    WHERE id = ?
                `, [id]);

                console.log(`Denied reservation for item ${id}`);
            } else {
                await db.query(`
                    UPDATE equipment 
                    SET status = 'APPROVED', 
                        start_date = ?, 
                        board_member = ?
                    WHERE id = ?
                `, [getCurDateTime(), curUser.netID, id]);

                console.log(`Approved reservation for ${id}`);
            }
        }

        return res.status(200).redirect(`${FRONTEND_URL}/admin/equipment`);
    } catch (error) {
        console.error("Error reserving equipment:", error);
        return res.status(500).json({ success: false, message: "Failed to reserve equipment" });
    }
};

export const checkinEquipment = async (req, res) => {
    const data = req.body;

    console.log("Checking out equipment...");
    try {
        const curUser = req.session.passport.user;
        if (!curUser) {
            res.status(400).json({ success: false, message: "User not authenticated" });
            return;
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: "No items checked out." });
        }

        console.log(data);
        for (const [ id, status ] of Object.entries(data)) {
            if (id === 'netid') continue;

            await db.query(`
                UPDATE equipment 
                SET status = 'BORROWED'
                WHERE id = ?
            `, [id]);

            console.log(`Item ${id} has been borrowed.`);
        }

        res.status(200).json({ success: true, message: "Successfully checked out!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete shop item." });
        res.redirect(`${FRONTEND_URL}/members/equipment`);
    }
}

export const returnEquipment = async (req, res) => {
    const data = req.body;

    console.log("Returning equipment...");
    try {
        const curUser = req.session.passport.user;
        if (!curUser) {
            res.status(400).json({ success: false, message: "User not authenticated" });
            return;
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: "No items checked out." });
        }

        console.log(data);
        for (const [ id, status ] of Object.entries(data)) {
            if (id === 'netid') continue;

            await db.query(`
                UPDATE equipment 
                SET status = 'FREE'
                WHERE id = ?
            `, [id]);

            // Logging mechanism.
            const statusQuery = await db.query('SELECT * FROM equipment WHERE id=?', [id]);

            // Begin logging
            const logQuery = `
                INSERT INTO equipment_log (
                    serial,
                    netid,
                    start_date,
                    end_date,
                    board_member
                ) VALUES (?, ?, ?, ?, ?)
            `;

            const params = [
                statusQuery[0]['serial'],
                statusQuery[0]['netid'],
                statusQuery[0]['start_date'],
                statusQuery[0]['end_date'],
                statusQuery[0]['board_member']
            ];

            await db.query(logQuery, params);
            console.log(`Item ${id} has been returned.`);
        }

        res.status(200).json({ success: true, message: "Successfully checked out!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete shop item." });
        res.redirect(`${FRONTEND_URL}/members/equipment`);
    }
}

export const purchaseEquipment = async (req, res) => {
    const data = req.body;

    try {
        const curUser = req.session.passport.user;
        if (!curUser || !curUser.netID) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: "No items in cart" });
        }

        // TODO LATER TODAY
        for (const item of data) {
            const { id, type, quantity, size, price } = item;

            // Updating the shop inventory
            await db.query(`
                UPDATE shop_inventory
                SET stock=stock - ?
                WHERE id=?
            `, [quantity, id]);

            // TODO: VENMO QUERIES
            let status = 'PENDING'

            const params = [
                id,
                type,
                size,
                curUser.netID,
                price,
                status,
                getCurDateTime()
            ];

            // Updating shop purchases
            await db.query(`
                INSERT INTO shop_purchases (
                    equip_id, 
                    type, 
                    size, 
                    netid, 
                    price, 
                    status, 
                    date
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, params);
        }

        return res.status(200).redirect(`${FRONTEND_URL}/members/shop`);
    } catch (error) {
        console.error("Error reserving equipment:", error);
        return res.status(500).json({ success: false, message: "Failed to checkout shop" });
    }
};

export const updateEvent = async (req, res) => {
    const data = req.body;
    const id = req.params.eventid;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { title, category, startDate, endDate, startTime, endTime, interval, allDay } = data;

        const query = `
            UPDATE calendar 
            SET title=?,
                category=?,
                start_date=?,
                end_date=?,
                period=?
            WHERE id=?
        `;

        const start = new Date(`${startDate}T${!allDay ? startTime : '00:00:00:000'}`);
        const end = new Date(`${endDate}T${!allDay ? endTime : '23:59:59:999'}`);
        const intervalClass = interval !== "never" ? interval.toUpperCase() : -1;

        const params = [title, category.toUpperCase(), start, end, intervalClass, id];

        const response = await db.query(query, params);
        res.status(200).json({ success: true, message: "Successfully updated event." });
    } catch (error) {
        console.error("Error updating events.", error);
        res.status(500).json({ success: false, message: "Failed to update events." });
    }
}


// ADDS AND REMOVES
export const addUser = async (req, res) => {
    const data = req.body;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { netID } = data;
        console.log(netID);

        console.log("Probing database...");
        const initProbe = await db.query('SELECT * FROM members WHERE netid=?', [netID]);
        if (initProbe.length != 0) {
            console.error(`${netID} found already. Halting...`);
            res.status(500).json({ success: false, message: `${netID} is already in the database.` });
            return;
        }

        console.log("Querying Yalies...");
        const yaliesData = await yaliesAPI.people({
            filters: {
                netid: netID
            }
        });

        // If no user found
        if (yaliesData === null || yaliesData.length === 0) {
            res.status(500).json({ success: false, message: `Yalies API did not find ${netID}.` });
            return;
        }

        // Getting our user data.
        const user = yaliesData[0];

        // For birthdays, assume that the birthdate is 2024
        const birthday = new Date(2024, user["birth_month"] - 1, user["birth_day"]);
        const params = [
            user["first_name"],
            user["last_name"],
            user["email"],
            user["upi"],
            user["school"],
            user["year"],
            user["college"],
            user["image"],
            birthday,
            netID
        ];

        const response = await db.query(`
            INSERT INTO members (
                firstName,
                lastName,
                email,
                upi,
                affiliation,
                grad,
                college,
                default_pfp,
                birthday,
                netid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, params);

        // Inserting into Birthday!
        const birthdayParams = [
            user["first_name"] + " " + user["last_name"] + "'s Birthday",
            "BIRTHDAY",
            birthday,
            new Date(user["year"] + 1, user["birth_month"] - 1, user["birth_day"], 23, 59, 59, 999),
            'YEAR'
        ]

        const birthdayEvent = await db.query(`
            INSERT INTO calendar (
                title,
                category,
                start_date,
                end_date,
                period
            ) VALUES (?, ?, ?, ?, ?)
        `, birthdayParams);

        console.log("Successfully updated database.");
        res.status(200).json({ success: false, message: `Successfully added ${user["first_name"]}!` });
    } catch (error) {
        console.error("Error updating.", error);
        res.status(500).json({ success: false, message: "Failed to update members." });
    }
}

export const removeUserByNetID = async (req, res) => {
    const netID = req.params.netid;
    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        if (curUser.netID === netID) {
            res.status(400).json({ success: false, message: "Cannot self-remove from the database." });
            return;
        }

        const response = await db.query('DELETE FROM members WHERE `netid`=?', [netID]);
        res.status(200).redirect(`${FRONTEND_URL}/admin/team/directory/`);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user." });
        res.redirect(`${FRONTEND_URL}/admin/team/directory`);
    }
}

export const addShopItem = async (req, res) => {
    const data = req.body;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { type, size, price, stock, description } = data;

        const query = `
            INSERT INTO shop_inventory (
                type,
                size,
                price,
                stock,
                description
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const params = [type, size, price, stock, description];

        const response = await db.query(query, params);
        res.status(200).redirect(`${FRONTEND_URL}/admin/shop`);
    } catch (error) {
        console.error("Error updating shop with new item.", error);
        res.status(500).json({ success: false, message: "Failed to update shop." });
        res.redirect(`${FRONTEND_URL}/admin/shop`);
    }
}

export const removeShopID = async (req, res) => {
    const shopID = req.params.shopid;
    try {
        const curUser = req.session.passport.user;
        if (!curUser) {
            res.status(400).json({ success: false, message: "User not authenticated" });
            return;
        }

        const response = await db.query('DELETE FROM shop_inventory WHERE `id`=?', [shopID]);
        res.status(200).redirect(`${FRONTEND_URL}/admin/shop/`);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete shop item." });
        res.redirect(`${FRONTEND_URL}/admin/shop`);
    }
}

export const addEquipment = async (req, res) => {
    const data = req.body;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { serial, type, size, status, netid, start_date, end_date, board_member, comments } = data;

        // Obtaining equipment ID class
        const idQuery = await db.query('SELECT equip_id FROM equipment WHERE type=? AND size=?', [type, size]);

        // Each type and size gets a unique class identifier.
        let equipID = 1;
        if (idQuery === null || idQuery.length == 0) {
            const [rows] = await db.query('SELECT MAX(equip_id) AS max_id FROM equipment');
            if (rows.length > 0 && rows[0].max_id !== null) {
                equipID = rows[0].max_id + 1; // Increment by 1
            }
        } else {
            equipID = idQuery[0];
        }

        const query = `
            INSERT INTO equipment (
                equip_id,
                serial,
                type,
                size,
                status,
                netid,
                start_date,
                end_date,
                board_member,
                comments
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            equipID,
            serial,
            type,
            size,
            status,
            netid,
            (start_date != '' ? start_date : null),
            (end_date != '' ? end_date : null),
            board_member,
            comments
        ];

        const response = await db.query(query, params);
        res.status(200).redirect(`${FRONTEND_URL}/admin/equipment`);
    } catch (error) {
        console.error("Error updating equipment with new item.", error);
        res.status(500).json({ success: false, message: "Failed to update equipment store." });
        res.redirect(`${FRONTEND_URL}/admin/equipment`);
    }
}

export const removeEquipID = async (req, res) => {
    const equipID = req.params.equipid;
    try {
        const curUser = req.session.passport.user;
        if (!curUser) {
            res.status(400).json({ success: false, message: "User not authenticated" });
            return;
        }

        const response = await db.query('DELETE FROM equipment WHERE `id`=?', [equipID]);
        res.status(200).redirect(`${FRONTEND_URL}/admin/equipment/`);
    } catch (error) {
        console.error("Error deleting equipment:", error);
        res.status(500).json({ success: false, message: "Failed to delete equipment item." });
        res.redirect(`${FRONTEND_URL}/admin/equipment`);
    }
}

export const addTag = async (req, res) => {
    const data = req.body;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { name, color } = data;

        const response = await db.query(`INSERT INTO tags (tag, color) VALUES (?, ?)`, [name, color]);
        const insertId = response.insertId;

        res.status(200).json({ success: true, id: insertId });
    } catch (error) {
        console.error("Error updating equipment with new item.", error);
        res.status(500).json({ success: false, message: "Failed to update equipment store." });
        res.redirect(`${FRONTEND_URL}/admin/equipment`);
    }
}

export const addEvent = async (req, res) => {
    const data = req.body;

    try {
        const curUser = getAuthenticatedUser(req, res);
        if (!curUser) return;

        // Extract data from the request body
        const { title, category, startDate, endDate, startTime, endTime, interval, allDay } = data;

        const query = `
            INSERT INTO calendar (
                title,
                category,
                start_date,
                end_date,
                period
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const start = new Date(`${startDate}T${!allDay ? startTime : '00:00:00:000'}`);
        const end = new Date(`${endDate}T${!allDay ? endTime : '23:59:59:999'}`);
        const intervalClass = interval !== "never" ? interval.toUpperCase() : -1;

        const params = [title, category.toUpperCase(), start, end, intervalClass];

        const response = await db.query(query, params);
        res.status(200).json({ success: true, message: "Successfully added event." });
    } catch (error) {
        console.error("Error updating events.", error);
        res.status(500).json({ success: false, message: "Failed to update events." });
    }
}

