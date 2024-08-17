import NavLink from "@/components/navlinks";

const formatDate = (dateString) => {
    let dateObj = new Date(dateString);
    return (dateObj.getUTCMonth() + 1) + '/' + dateObj.getUTCDate();
};

function PracticeWidget({ belt, counts, attendance }) {
    // If already a black belt, there is no set curriculum.
    if (belt.toLowerCase().indexOf("dan") != 0) {
        return <h4>Check with Master Kim for next dan testing.</h4>
    }

    const beltElem = counts.find(item => item.belt === belt);
    let pracCount = 0;
    for (const row in attendance) {
        if (row.present) pracCount++;
    }

    // Number of practices remaining for them.
    const remainder = beltElem.req_practices - pracCount % beltElem.req_practices;
    return (
        <div id="attendance_practice_widget">
            <h4>{remainder} practices to go!</h4>
            <NavLink href="/members/team/requirements">Requirements here.</NavLink>
        </div>
    )
}

export default function AttendanceComp({ belt, counts, attendance }) {
    return (
        <div className="attendance_id">
            <h2 id="attendance_title">My Attendance</h2>
            <h3>Your Rank is: {belt}</h3>
            <PracticeWidget belt={belt} counts={counts} attendance={attendance}/>
            <table id="attendance_table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Present</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((rowData) => (
                        <tr key={rowData.id}>
                            <td className="attendance_date">{formatDate(rowData.date)}</td>
                            <td className={rowData.present ? "attendance_p" : "attendance_a"}>
                                {rowData.present ? "P" : "A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}