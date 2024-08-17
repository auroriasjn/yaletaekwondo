import { FRONTEND_URL } from "../config.mjs";
import { db, yaliesAPI } from "./db.mjs";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const express = require('express');
const CasStrategy = require('passport-cas').Strategy;
const passport = require('passport');

export const passportConfig = function(passport) {
    passport.use(
        new CasStrategy(
            {
                version: 'CAS3.0',
                ssoBaseURL: 'https://secure.its.yale.edu/cas',
                serverBaseURL: 'http://localhost:3002',
            },
            async (profile, done) => {
                try {
                    await db.connect();
                } catch (e) {
                    console.error('Database connection error:', e);
                    done(null, false);
                    return;
                }

                const netID = profile.user;

                // Query to see if user in the database.
                console.log("Querying database...");
                const results = await db.query(
                    'SELECT * FROM members WHERE `netid`=?', [netID]
                );

                // If the user is not in the database.
                if (results === null || results.length === 0) {
                    console.log("User not in database...");
                    done(null, false);
                    return;
                }

                // Thank you course table!
                try {
                    console.log("Querying Yalies...")
                    const data = await yaliesAPI.people({
                        filters: {
                            netid: netID
                        }
                    });

                    // If no user found
                    if (data === null || data.length === 0) {
                        done(null, false);
                        return;
                    }

                    // Getting our user data.
                    const user = data[0];

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
                            UPDATE members 
                            SET firstName=?, 
                                lastName=?, 
                                email=?, 
                                upi=?, 
                                affiliation=?, 
                                grad=?, 
                                college=?,
                                default_pfp=?,
                                birthday=?
                            WHERE netid=?
                        `, params);

                    await db.end();
                    const authUser = {
                        id: results[0]["id"],
                        netID: netID,
                        email: user["email"],
                        firstName: user["first_name"],
                        lastName: user["last_name"],
                        admin: results[0]["admin"],
                    };

                    done(null, authUser);
                } catch (err) {
                    console.log("Yalies connection error!");
                    done(null, false);
                }
            },
        ),
    );

    passport.serializeUser((user, done) => {
        console.log(`Serializing ${user.netId}...`);
        if (user && user.id) {
            if (user.admin) {
                console.log("Admin privileges added.");
            }
            done(null, {
                user: user.id,
                netID: user.netID,
                firstName: user.firstName,
                admin: user.admin
            });
        } else {
            done(new Error('Invalid user object during serialization.'));
        }
    });

    passport.deserializeUser(async (key, done) => {
        if (!key) {
            done(null, null);
            return;
        }

        console.log(`Deserializing user ${key.user}`);
        const results = await db.query(
            'SELECT * FROM members WHERE `id`=?', [key.user]
        );

        const data = results[0];
        const user = {
            id: 0,
            netID: data["netid"],
            email: data["email"],
            firstName: data["firstname"],
            lastName: data["lastname"]
        };

        console.log(`Deserialization complete for ${user["netID"]}`);
        done(null, user);
    });
};

// CAS login based on CourseTable API.
export const casLogin = (req, res, next) => {
    passport.authenticate(
        'cas', (err, user) => {
            // Default error message.
            if (err) {
                next(err);
                return;
            }

            // CAS authentication but without a user.
            if (!user) {
                next(new Error('CAS authenticated but no user found.'));
                return res.redirect(`${FRONTEND_URL}/noaccess`);
            }

            // Successful authentication and login.
            console.log(`Logging in ${user.netId}...`);
            req.logIn(user, (loginError) => {
                // Login error!
                if (loginError) {
                    next(loginError);
                    return res.redirect(`${FRONTEND_URL}/noaccess`);
                }

                // Redirect if authentication successful
                postAuth(req, res);
            });
        }
    )(req, res, next);
};

const postAuth = (req, res) => {
    // TODO: This will be more robust in the future.
    console.log("Redirecting!\n");
    const redirect = req.query;
    console.log(redirect);
    res.redirect(`${FRONTEND_URL}/members`);
}


export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() || req.user) {
        return next();
    }
    res.redirect(`${FRONTEND_URL}/login`);
};

export const authHandler = (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        throw new Error('User not authenticated');
    }

    try {
        const userId = req.session.passport.user;
        res.status(200).json({ user: userId });
        return;
    } catch (error) {
        console.error("Error fetching session user data:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve session user data" });
    }
}

export const casLogout = (req, res, next) => {
    if (!req.user) return res.status(400).json({ error: 'USER_NOT_FOUND' });

    req.logOut((err) => {
        if (err) next(err);
    });
    return res.sendStatus(200);
};

// localhost:3002/login
