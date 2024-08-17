'use client'

import { useFetchUserFromNetID } from "@/app/api/admin/db";
import { useState } from 'react';
import { useAuth } from "@/app/api/user/auth";

import { FormEvent } from 'react'
import axios from "axios";
import TagSelect from "@/components/taginput";
import Image from "next/image";
import NavLink from "@/components/navlinks";

const formatDate = (dateString) => {
    let dateObj = new Date(dateString);
    return (dateObj.getUTCMonth() + 1) + '/' + dateObj.getUTCDate();
};


export default function ProfileForm({ netID }) {
    const { user } = useAuth();
    const { userData, userLoading, tags } = useFetchUserFromNetID(netID);
    const [isBoardMember, setIsBoardMember] = useState(false);

    if (userLoading) {
        return <div>Loading...</div>
    }

    const handleBoardMemberChange = (event) => {
        setIsBoardMember(event.target.checked);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        try {
            const response = await fetch(`http://localhost:3002/api/admin/update/${netID}`, {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    return (
        <div className="profile_form_wrapper">
            <div className="profile_pfp">
                <Image src={userData.pfp ? userData.pfp : userData.default_pfp} alt={userData.firstname} width={100} height={125} id="profile_pfp"/>
            </div>
            <h1>{userData.firstname} {userData.middlename} {userData.lastname}</h1>
            <p id="netid">NetID: {userData.netid}</p>
            <p id="upi">UPI: {userData.upi}</p>
            <p id="birthday">Birthday: {formatDate(userData.birthday)}</p>
            {userData.college &&
                <p id="college">College: {userData.college}</p>
            }

            <form
                id="profile_form"
                method="POST"
                onSubmit={onSubmit}
                onKeyDown={(e) =>
                    { e.key === 'Enter' && e.preventDefault() }
                }
            >
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" defaultValue={userData.email}/><br />
                <label htmlFor="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" defaultValue={userData.phone} /><br />
                <label htmlFor="affiliation">Affiliation:</label>
                <input type="text" name="affiliation" defaultValue={userData.affiliation} /><br />
                <label htmlFor="grad">Graduation Year:</label>
                <input type="text" name="grad" defaultValue={userData.grad} /><br/>

                <label htmlFor="belt">Belt:</label>
                <select name="belt" id="belt" defaultValue={userData.belt}>
                    <option>White</option>
                    <option>Yellow</option>
                    <option>Orange</option>
                    <option>Green</option>
                    <option>Blue</option>
                    <option>Purple</option>
                    <option>Brown</option>
                    <option>Red</option>
                    <option>Poom</option>
                    <option>1st Dan</option>
                    <option>2nd Dan</option>
                    <option>3rd Dan</option>
                    <option>4th Dan</option>
                    <option>5th Dan</option>
                    <option>6th Dan</option>
                    <option>7th Dan</option>
                    <option>8th Dan</option>
                    <option>9th Dan</option>
                </select><br />

                <label htmlFor="pronouns">Pronouns:</label>
                <select name="pronouns" id="pronouns" defaultValue={userData.pronouns}>
                    <option>he/him</option>
                    <option>she/her</option>
                    <option>they/them</option>
                    <option>Other</option>
                </select><br />
                {(userData.board || isBoardMember) &&
                    <>
                        <label htmlFor="offices">Offices:</label>
                        <input type="text" name="offices" defaultValue={userData.offices} />
                    </>
                }<br /><br />

                <label htmlFor="tags">Tags</label>
                <TagSelect tagsString={userData.tags} tags={tags} /><br />

                <label htmlFor="board">Board Member?</label>
                <input type="checkbox" name="board" defaultChecked={userData.board} onChange={handleBoardMemberChange} /><br/>

                <label htmlFor="admin">Website Admin?</label>
                {(user.netID === netID) ?
                    <input type="checkbox" name="admin" checked />
                    : <input type="checkbox" name="admin" defaultChecked={userData.admin} />
                }<br />
                <label htmlFor="active">Active?</label>
                <input type="checkbox" name="active" defaultChecked={userData.active}/><br/>

                <button type="reset" id="reset_button">Reset</button>
                <button type="submit" id="submit_button">Save</button>
            </form>
            <NavLink href={"http://localhost:3002/api/admin/remove/" + netID}>Remove</NavLink>
        </div>
    )

}