export default function EventCard({ event }) {
    const getTime = (date) => {
        const timeString = date.toLocaleString('en-US', {
            hour12: false, // 24-hour format
            timeZone: 'America/New_York',
        });

        return timeString.substring(11, 16);
    }

    const getDate = (date) => {
        return (date.getUTCMonth() + 1) + '/' + (date.getUTCDate()) + '/' + (date.getUTCFullYear())
    }

    return (
        <div className="event_card">
            <h3>{event.title}</h3>
            <p>{getDate(event.start)} - {getDate(event.end)}</p>
            <p>{getTime(event.start)} - {getTime(event.end)}</p>

            <h4>Description</h4>
            <p>{event.comments}</p>
        </div>
    );
}