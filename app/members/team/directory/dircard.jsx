import TagList from "../../../../components/taglist";
import Image from "next/image";
import NavLink from "@/components/navlinks";

export default function DirectoryCard({ userData, tags, admin }) {
    return (
        <div className="directory_card" id={userData.netid}>
            <div className="profile_info">
                <h3>{userData.firstname} {userData.lastname}</h3>
                <p>{userData.affiliation} Class of {userData.grad}</p>
                { userData.board ? <h4>{userData.offices}</h4> : <h4>Member</h4>}
                <p>Email: {userData.email}</p>
                <p>Belt: {userData.belt}</p>
                <TagList tagsString={userData.tags} tags={tags} />
            </div>
            <div className="profile_pfp">
                <Image src={userData.pfp != null ? userData.pfp : userData.default_pfp} alt={userData.firstname} width={100} height={125} id="profile_pfp"/>
            </div>
            {admin ?
                <div className="admin_dircard_buttons">
                    <NavLink href={'/admin/team/' + userData.netid}>Edit</NavLink>
                </div> : null
            }
        </div>
    )
}