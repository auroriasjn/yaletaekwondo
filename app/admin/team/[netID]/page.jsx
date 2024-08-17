import ProfileForm from "./ProfileForm";

export default function EditProfilePage({ params }) {
    const netID = params.netID;

    return (
        <div>
            <h1>Edit Profile</h1>
            <ProfileForm netID={netID} />
        </div>
    );
}