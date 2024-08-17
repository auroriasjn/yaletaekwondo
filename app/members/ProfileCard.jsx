import Image from "next/image";
import Tag from "@/components/tagbox.jsx";
import TagList from "@/components/taglist";

function DuesWidget({ userDues }) {
    // Default semester setter.
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    const curSeason = (curDate.getMonth() >= 7) ? 'fall' : 'spring';

    const sem = curSeason.toUpperCase() + " '" + curYear % 1000 % 100;

    // Find if the dues were paid this season.
    const elem = userDues.find(item => item.season === curSeason && item.year === curYear);
    if (elem === undefined) {
        return (
            <div className="dues_widget">
                <Tag color="crimson">{sem} NOT PAID</Tag>
            </div>
        );
    }

    return (
        <div className="dues_widget">
            <Tag color="green">{sem} PAID: ${elem.amount}</Tag>
        </div>
    );
}

export default function ProfileCard({ userData, userDues, tags }) {
    // TODO: make more robust.
    return (
        <div className="profile_card">
            <div className="profile_info">
                <h1>{userData.firstname} {userData.lastname}</h1>
                <p>{userData.affiliation} Class of {userData.grad}</p>
                { userData.admin ? <h2>Board Member</h2> : <h2>Member</h2>}
                <p>Email: {userData.email}</p>
                <DuesWidget userDues={userDues} />
                <TagList tagsString={userData.tags} tags={tags} />
            </div>
            <div className="profile_pfp">
                <Image src={userData.pfp != null ? userData.pfp : userData.default_pfp} alt={userData.firstname} width={100} height={125} id="profile_pfp"/>
            </div>
        </div>
    );
}
