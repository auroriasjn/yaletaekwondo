'use client'

import Image from "next/image";
import {useFetchUser} from "../../api/user/db";

const formatDate = (dateString) => {
    let dateObj = new Date(dateString);
    return (dateObj.getUTCMonth() + 1) + '/' + dateObj.getUTCDate();
};

// User Profile Edit Form is substantially more toned down than the administrative.
export default function ProfileForm() {
    const { userData, userLoading } = useFetchUser();

    if (userLoading) {
        return <div>Loading...</div>
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch(`http://localhost:3002/api/user/update/`, {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    return (
        <div className="profile_form_wrapper">
            <div className="profile_pfp">
                <Image src={userData.pfp ? userData.pfp : userData.defaultpfp} alt={userData.firstname} width={100} height={125} id="profile_pfp"/>
            </div>
            <h1>{userData.firstname} {userData.middlename} {userData.lastname}</h1>
            <h3 id="belt">Rank: {userData.belt}</h3>
            <p id="netid">NetID: {userData.netid}</p>
            <p id="upi">UPI: {userData.upi}</p>
            <p id="birthday">Birthday: {formatDate(userData.birthday)}</p>
            {userData.college &&
                <p id="college">College: {userData.college}</p>
            }

            <form id="profile_form" method="POST" onSubmit={onSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" defaultValue={userData.email}/><br />
                <label htmlFor="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" defaultValue={userData.phone} /><br />
                <label htmlFor="affiliation">Affiliation:</label>
                <input type="text" name="affiliation" defaultValue={userData.affiliation} /><br />
                <label htmlFor="grad">Graduation Year:</label>
                <input type="text" name="grad" defaultValue={userData.grad} /><br/>

                <label htmlFor="pronouns">Pronouns:</label>
                <select name="pronouns" id="pronouns" defaultValue={userData.pronouns}>
                    <option>he/him</option>
                    <option>she/her</option>
                    <option>they/them</option>
                    <option>Other</option>
                </select><br />

                <button type="reset" id="reset_button">Reset</button>
                <button type="submit" id="submit_button">Save</button>
            </form>
        </div>
    )
}