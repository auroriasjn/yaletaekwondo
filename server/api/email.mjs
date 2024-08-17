import {createRequire} from "module";
import {EMAIL_ADDRESS, EMAIL_PASSWORD, FRONTEND_URL} from "../config.mjs";
import {db} from "./db.mjs";
const require = createRequire(import.meta.url);

const nodemailer = require('nodemailer');

const getCurDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
};
const renderEquipmentItems = (items) => {
    return items.map(item => `
        <li>
            <i>${item.type}, Size ${item.size}</i>
        </li>`
    ).join('');
};

const renderShopItems = (items) => {
    return items.map(item => `
        <tr>
            <td>${item.type}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>${(item.quantity * item.price).toFixed(2)}</td>
        <tr>`
    ).join('');
};

const totalPrice = (items) => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
}


/**
 * Handles sending out equipment reservation emails.
 * Involves sending to admin and user.
 */
export const equipEmailHandler = async (req, res) => {
    const data = req.body;
    console.log('Dispatching emails...');

    try {
        const curUser = req.session.passport.user;
        console.log(curUser);
        if (!curUser || !curUser.netID) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: "No items in cart" });
        }

        // Retrieve emails
        const adminQuery = await db.query(`
            SELECT email, firstname, lastname FROM members WHERE admin != 0
        `);

        // Retrieve user email
        const userQuery = await db.query(`
            SELECT email, firstname, lastname FROM members WHERE id=?
        `, [curUser.user]);

        const adminEmails = adminQuery.map(row => row.email);
        const userEmail = userQuery[0]['email'];

        const adminNames = adminQuery.map(row => (row.firstname + ' ' + row.lastname));

        // EMAIL TO ADMIN
        const adminMessage = {
            from: {
                name: 'Yale Taekwondo',
                address: 'dev@yaletaekwondo.com'
            },
            to: adminEmails,
            subject: `Equipment Request For ${curUser.firstName} on ${getCurDateTime()}`,
            message: `
                ${curUser.firstName} ${userQuery[0]['lastname']} has requested equipment for rental
                on ${getCurDateTime()}. To approve their request, please go to the admin portal at 
                ${FRONTEND_URL}/admin/equipment/approve/${curUser.netID}.
                
                Thanks,
                Yale Taekwondo Development Team
            `,
            html: `
                <p>${curUser.firstName} ${userQuery[0]['lastname']} has requested equipment for rental
                on ${getCurDateTime()}. To approve their request, please go to the admin portal at 
                ${FRONTEND_URL}/admin/equipment/approve/${curUser.netID}.</p>
                
                <p>Thanks,</p>
                <h3>Yale Taekwondo Development Team</h3>
                <p>${adminNames + ''}</p>
            `
        }



        // EMAIL TO REQUESTER
        const userMessage = {
            from: {
                name: 'Yale Taekwondo',
                address: 'dev@yaletaekwondo.com'
            },
            to: userEmail,
            subject: `Equipment Reservation Confirmation ${getCurDateTime()}`,
            message: `
                Dear ${curUser.firstName},
                
                We have received your request for an equipment rental and a board member will let you
                know if your request has been approved. To see the status of your approval, check your
                profile page.
                
                All the best,
                Yale Taekwondo Development Team
            `,
            html: `
                <p>Dear ${curUser.firstName},</p>
                <p>We have received your request for an equipment rental and a board member will let you
                know if your request has been approved. To see the status of your approval, check your
                profile page.</p>
                
                <h4>You requested:</h4>
                <ul>
                    ${renderEquipmentItems(data)}
                </ul>
                
                <h3>Yale Taekwondo Development Team</h3>
                <p>${adminNames + ''}</p>
            `
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_ADDRESS,
                pass: EMAIL_PASSWORD
            },
        });

        if (req.method === 'POST') {
            transporter.verify((error, success) => {
                if (error) {
                    console.error(`Error verifying transporter: ${error.message}`);
                } else {
                    console.log("Transporter verified successfully");
                }
            });

            transporter.sendMail(userMessage, (err, info) => {
                if (err) {
                    return res.status(500).json({
                        error: `Failed to send email: ${err.message}`
                    });
                } else {
                    console.log("User email sent!");
                    return res.status(200).json({ success: true, message: "User email sent!" });
                }
            });

            transporter.sendMail(adminMessage, (err, info) => {
                if (err) {
                    return res.status(500).json({
                        error: `Failed to send email: ${err.message}`
                    });
                } else {
                    console.log("Admin email sent!");
                    return res.status(200).json({ success: true, message: "Admin email sent!" });
                }
            });
        }
    } catch (error) {
        console.log('Error sending board authorization emails: ', error);
        return res.status(500).json({ success: false, message: "Failed to send email dispatch." });
    }
}

/**
 * Handles approval emails.
 */
export const approvalEmailHandler = async (req, res) => {
    const data = req.body;
    const userNetID = req.params.netid;
    console.log('Dispatching approval emails...');

    try {
        const curUser = req.session.passport.user;
        if (!curUser || !curUser.netID) {
            return res.status(400).json({success: false, message: "User not authenticated"});
        }

        // Retrieve approval email
        const approverQuery = await db.query(`
            SELECT email, firstname, lastname
            FROM members
            WHERE id = ?
        `, [curUser.user]);
        const approver = approverQuery[0];

        const approveeQuery = await db.query(`
            SELECT email, firstname, lastname
            FROM members
            WHERE netid = ?
        `, [userNetID]);
        const approvee = approveeQuery[0];

        const dataQuery = await db.query(`
            SELECT * from equipment WHERE id IN (?)
        `, [Object.keys(data)]);

        const renderCabinetItems = (items) => {
            return items.map(item => `
                <li>
                    Serial ${item.serial}: ${item.cabinet}
                </li>`
            ).join('');
        };

        // EMAIL TO REQUESTER
        const userMessage = {
            from: {
                name: 'Yale Taekwondo',
                address: 'dev@yaletaekwondo.com'
            },
            to: approvee["email"],
            subject: `[IMPORTANT] Equipment Approval Notice, ${getCurDateTime()}`,
            message: `
                Dear ${approvee.firstname},
                
                Your requests were approved by ${approver.firstname} ${approver.lastname} at ${getCurDateTime()}. 
                   
                Checkout Instructions:
                All equipment is stored in the 6B storage room. The code for the room is 76257# (do not disclose this). 
                You can find the cabinets of each of your items below:
                
                Please go to ${FRONTEND_URL}/members/equipment/checkin to register your retrieval.
                                
                Please direct any questions to the Yale Taekwondo Board at practice or at
                the board member's email, ${approver.email}. 
                
                All the best,
                Yale Taekwondo Development Team
            `,
            html: `
                <p>Dear ${approvee.firstname},</p>
                <p>Your request for</p>
                <ul>
                    ${renderEquipmentItems(dataQuery)}
                </ul>
                <p>was approved by ${approver.firstname} ${approver.lastname} at ${getCurDateTime()}.</p>
                
                <h3>Checkout Instructions</h3>
                <p>All equipment is stored in the 6B storage room. The code for the room is 76257# (do not disclose this). 
                You can find the cabinets of each of your items below:</p>
                <ul>
                    ${renderCabinetItems(dataQuery)}
                </ul>
                <p>Please go to ${FRONTEND_URL}/members/equipment/checkin to register your retrieval.</p>
                
                <p>Direct any questions to the Yale Taekwondo Board at practice or at
                the board member's email, ${approver.email}. Happy sparring!</p>
               
                <h3>Yale Taekwondo Development Team</h3>
            `
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_ADDRESS,
                pass: EMAIL_PASSWORD
            },
        });

        if (req.method === 'POST') {
            transporter.verify((error, success) => {
                if (error) {
                    console.error(`Error verifying transporter: ${error.message}`);
                } else {
                    console.log("Transporter verified successfully");
                }
            });

            transporter.sendMail(userMessage, (err, info) => {
                if (err) {
                    return res.status(500).json({
                        error: `Failed to send email: ${err.message}`
                    });
                } else {
                    console.log("User email sent!");
                    return res.status(200).json({success: true, message: "User email sent!"});
                }
            });
        }
    } catch (error) {
        console.log('Error sending board authorization emails: ', error);
        return res.status(500).json({success: false, message: "Failed to send email dispatch."});
    }
}

/**
 * Handles sending out equipment checkout emails.
 * Involves sending to admin and user.
 */
export const checkoutEmailHandler = async (req, res) => {
    const data = req.body;
    console.log('Dispatching emails...');

    try {
        const curUser = req.session.passport.user;
        console.log(curUser);
        if (!curUser || !curUser.netID) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: "No items in cart" });
        }

        // Retrieve emails
        const adminQuery = await db.query(`
            SELECT email, firstname, lastname FROM members WHERE admin != 0
        `);

        // Retrieve user email
        const userQuery = await db.query(`
            SELECT email, firstname, lastname FROM members WHERE id=?
        `, [curUser.user]);

        const adminEmails = adminQuery.map(row => row.email);
        const userEmail = userQuery[0]['email'];
        const adminNames = adminQuery.map(row => (row.firstname + ' ' + row.lastname));

        delete data['netid'];

        const dataQuery = await db.query(`
            SELECT * from equipment WHERE id IN (?)
        `, [Object.keys(data)]);

        console.log(dataQuery);

        // EMAIL TO ADMIN
        const adminMessage = {
            from: {
                name: 'Yale Taekwondo',
                address: 'dev@yaletaekwondo.com'
            },
            to: adminEmails,
            subject: `Equipment Checkout Notice: ${curUser.firstName} on ${getCurDateTime()}`,
            message: `
                ${curUser.firstName} ${userQuery[0]['lastname']} has checked out equipment for rental
                on ${getCurDateTime()}.
                
                Thanks,
                Yale Taekwondo Development Team
            `,
            html: `
                <p>${curUser.firstName} ${userQuery[0]['lastname']} has checked out equipment for rental
                on ${getCurDateTime()}:</p>
                
                <ul>
                    ${renderEquipmentItems(dataQuery)}
                </ul>
                
                <p>Thanks,</p>
                <h3>Yale Taekwondo Development Team</h3>
                <p>${adminNames + ''}</p>
            `
        }

        // EMAIL TO REQUESTER
        const userMessage = {
            from: {
                name: 'Yale Taekwondo',
                address: 'dev@yaletaekwondo.com'
            },
            to: userEmail,
            subject: `Equipment Reservation Confirmation ${getCurDateTime()}`,
            message: `
                Dear ${curUser.firstName},
                
                You have successfully checked out your equipment. This email serves
                as your receipt. To return your items, go to ${FRONTEND_URL}/members/equipment/return.
                
                All the best,
                Yale Taekwondo Development Team
            `,
            html: `
                <p>Dear ${curUser.firstName},</p>
                <p>You have successsfully checked out your equipment. This email serves as your
                receipt. To return your items, go to ${FRONTEND_URL}/members/equipment/return.</p>
                
                <h4>You checked out:</h4>
                <ul>
                    ${renderEquipmentItems(dataQuery)}
                </ul>
                
                <h3>Yale Taekwondo Development Team</h3>
                <p>${adminNames + ''}</p>
            `
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_ADDRESS,
                pass: EMAIL_PASSWORD
            },
        });

        if (req.method === 'POST') {
            transporter.verify((error, success) => {
                if (error) {
                    console.error(`Error verifying transporter: ${error.message}`);
                } else {
                    console.log("Transporter verified successfully");
                }
            });

            transporter.sendMail(userMessage, (err, info) => {
                if (err) {
                    return res.status(500).json({
                        error: `Failed to send email: ${err.message}`
                    });
                } else {
                    console.log("User email sent!");
                    return res.status(200).json({ success: true, message: "User email sent!" });
                }
            });

            transporter.sendMail(adminMessage, (err, info) => {
                if (err) {
                    return res.status(500).json({
                        error: `Failed to send email: ${err.message}`
                    });
                } else {
                    console.log("Admin email sent!");
                    return res.status(200).json({ success: true, message: "Admin email sent!" });
                }
            });
        }
    } catch (error) {
        console.log('Error sending board authorization emails: ', error);
        return res.status(500).json({ success: false, message: "Failed to send email dispatch." });
    }
}

/**
 * Purchase email handler.
 */
export const shopEmailHandler = async (req, res) => {
    const data = req.body;
    console.log('Dispatching emails...');

    try {
        const curUser = req.session.passport.user;
        console.log(curUser);
        if (!curUser || !curUser.netID) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: "No items in cart" });
        }

        // Retrieve emails
        const adminQuery = await db.query(`
            SELECT email, firstname, lastname FROM members WHERE admin != 0
        `);

        // Retrieve user email
        const userQuery = await db.query(`
            SELECT email, firstname, lastname FROM members WHERE id=?
        `, [curUser.user]);

        const adminEmails = adminQuery.map(row => row.email);
        const userEmail = userQuery[0]['email'];

        const adminNames = adminQuery.map(row => (row.firstname + ' ' + row.lastname));

        // EMAIL TO ADMIN
        const adminMessage = {
            from: {
                name: 'Yale Taekwondo',
                address: 'dev@yaletaekwondo.com'
            },
            to: adminEmails,
            subject: `Purchase For ${curUser.firstName} on ${getCurDateTime()}`,
            message: `
                ${curUser.firstName} ${userQuery[0]['lastname']} has purchased from the shop
                on ${getCurDateTime()}. 
                
                Thanks,
                Yale Taekwondo Development Team
            `,
            html: `
                <p>${curUser.firstName} ${userQuery[0]['lastname']} has purchased from the shop
                on ${getCurDateTime()}. </p>
                
                <p>Thanks,</p>
                <h3>Yale Taekwondo Development Team</h3>
                <p>${adminNames + ''}</p>
            `
        }



        // EMAIL TO REQUESTER
        const userMessage = {
            from: {
                name: 'Yale Taekwondo',
                address: 'dev@yaletaekwondo.com'
            },
            to: userEmail,
            subject: `Receipt for ${getCurDateTime()}`,
            message: `
                Dear ${curUser.firstName},
                
                Thank you for ordering from the shop! This email serves as a confirmation
                that we have received your request. Attached is your receipt.
                
                All the best,
                Yale Taekwondo Development Team
            `,
            html: `
                <p>Dear ${curUser.firstName},</p>
                <p>Thank you for your order! This email serves as a confirmation that
                we have received your request. Attached is your receipt.</p>
                
                <table>
                    <caption>Order Confirmation</caption>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderShopItems(data)}
                    </tbody>
                    <tfoot>
                        <td>
                           <td colspan="3"><b>Total ($)</b></td>
                           <td>${totalPrice(data)}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <h3>Yale Taekwondo Development Team</h3>
                <p>${adminNames + ''}</p>
            `
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_ADDRESS,
                pass: EMAIL_PASSWORD
            },
        });

        if (req.method === 'POST') {
            transporter.verify((error, success) => {
                if (error) {
                    console.error(`Error verifying transporter: ${error.message}`);
                } else {
                    console.log("Transporter verified successfully");
                }
            });

            transporter.sendMail(userMessage, (err, info) => {
                if (err) {
                    return res.status(500).json({
                        error: `Failed to send email: ${err.message}`
                    });
                } else {
                    console.log("User email sent!");
                    return res.status(200).json({ success: true, message: "User email sent!" });
                }
            });

            transporter.sendMail(adminMessage, (err, info) => {
                if (err) {
                    return res.status(500).json({
                        error: `Failed to send email: ${err.message}`
                    });
                } else {
                    console.log("Admin email sent!");
                    return res.status(200).json({ success: true, message: "Admin email sent!" });
                }
            });
        }
    } catch (error) {
        console.log('Error sending board authorization emails: ', error);
        return res.status(500).json({ success: false, message: "Failed to send email dispatch." });
    }
}


