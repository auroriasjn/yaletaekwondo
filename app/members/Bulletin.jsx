export default function Bulletin({ events }) {
    const eventLoad = () => {
        const bulletin = events.filter((item) => (
            item.type !== 'PRACTICE' &&
            item.start >= new Date() &&
            item.start.getUTCFullYear() === new Date().getUTCFullYear()
        )).sort(
            (a, b) => a.start.getTime() - b.start.getTime()
        );

        return (
            bulletin.map((item) => (
                <tr key={item.id}>
                    <td>{
                        (item.start.getUTCMonth() + 1) + '/' + (item.start.getUTCDate()) + '/' + (item.start.getUTCFullYear())
                    }</td>
                    <td>{item.title}</td>
                </tr>

            ))
        );
    }

    return (
        <div className="bulletin">
            <h2 id="bulletin">Upcoming Events</h2>
            <table id="eventList">
                <tr>
                    <th>Date</th>
                    <th>Event</th>
                </tr>
                {eventLoad()}
            </table>
        </div>
    );
}
