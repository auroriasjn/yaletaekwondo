'use client'

import Image from "next/image";

import {useFetchUser, useFetchData, useFetchEvents} from "@/app/api/user/db";
import ProfileCard from "@/app/members/ProfileCard";
import AttendanceComp from "@/app/members/AttendanceWidget";
import EquipmentComp from "@/app/members/EquipmentWidget";
import Bulletin from "@/app/members/Bulletin";

const MemberPage = () => {
    // API Calls.
    const { userData, userAttendance, userEquipment, userDues, userLoading } = useFetchUser();
    const { belts, tags, dataLoading } = useFetchData();
    const { events, eventLoading } = useFetchEvents();

    if (userLoading || dataLoading || eventLoading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    // TODO: These are all placeholders. Make these all interactive components.
    return (
        <div id="member_page">
            <h1 id="member_title">At a Glance</h1>
            <div id="left_side">
                <ProfileCard userData={userData} userDues={userDues} tags={tags}/>
            </div>
            <div id="right_side">
                <AttendanceComp belt={userData.belt} counts={belts} attendance={userAttendance} />
                <EquipmentComp equipment={userEquipment} />
                <Bulletin events={events} />
            </div>
        </div>
    );
};


export default MemberPage;
