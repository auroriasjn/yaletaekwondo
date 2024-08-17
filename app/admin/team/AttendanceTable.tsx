const formatDate = (dateString: string) => {
    let dateObj: Date = new Date(dateString);
    return (dateObj.getUTCMonth() + 1) + '/' + dateObj.getUTCDate();
};

function AttendanceTable({ attendanceData }) {
    // Create a date set for the headings
    let dateSet: Set<string> = new Set();
    let netIDMap: Map<string, any> = new Map();
    let nameMap: Map<string, string> = new Map();

    for (const row of attendanceData) {
        const date = formatDate(row.date);
        // Add to date set if not yet in it.
        if (!dateSet.has(date)) {
            dateSet.add(date)
        }

        // Add to NetID map if not yet in.
        if (!netIDMap.has(row.netid)) {
            netIDMap.set(row.netid, []);
            nameMap.set(row.netid, row.firstname + ' ' + row.lastname);
        }

        // Add value of present.
        let presentRowVals = netIDMap.get(row.netid);
        presentRowVals.push({
            'date': date,
            'present': row.present
        });
        netIDMap.set(row.netid, presentRowVals);

        console.log(netIDMap);
    }

    const generateTableHeading = () => {
        return (
            <tr id="att_table_heading">
                <th>Name</th>
                {Array.from(dateSet).map((date) => (
                    <th key={date}>{date}</th>
                ))}
            </tr>
        )
    }

    const generateTableRows = () => {
        // Array of dates to ensure the order is consistent
        const datesArray: string[] = Array.from(dateSet);

        return (
            <>
                {Array.from(netIDMap.entries()).map(([netid, attendance]) => {
                    // Create a map for quick lookup of attendance by date
                    const attendanceMap = new Map(attendance.map(({ date, present }) => [date, present]));

                    return (
                        <tr key={netid}>
                            <td>{nameMap.get(netid)}</td>
                            {datesArray.map(date => (
                                <td key={date}>{attendanceMap.get(date) || 0}</td>
                            ))}
                        </tr>
                    );
                })}
            </>
        );
    }

    return (
        <table>
            {generateTableHeading()}
            {generateTableRows()}
        </table>
    )
}

export default function AttendanceWidget({ attendanceData }) {
    return (
        <div className="attendance_widget">
            <AttendanceTable attendanceData={attendanceData} />
        </div>
    );
}