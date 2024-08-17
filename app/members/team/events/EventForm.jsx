'use client'
import { useState } from 'react';

export default function EventForm({ dates=null, onSubmit, event=null }) {
    const [allDay, setAllDay] = useState(false);

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const getTime = (date) => {
        const timeString = date.toLocaleString('en-US', {
            hour12: false, // 24-hour format
            timeZone: 'America/New_York',
        });

        return timeString.substring(11, 16);
    }


    const handleChecked = (event) => {
        setAllDay(event.target.checked);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const fetchURL = (
            event ? `http://localhost:3002/api/admin/event/update/${event.id}` :
                `http://localhost:3002/api/admin/event`
        );

        try {
            const response = await fetch(fetchURL, {
                method: "POST",
                mode: 'cors',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            onSubmit();
        }
    }

    return (
        <form method="POST" id="event_form" name="event_form" onSubmit={handleSubmit}>
            <input type="text" id="title" name="title" placeholder="Event Title..." defaultValue={event?.title}/><br />

            <label htmlFor="category">Category: </label>
            <select name="category" id="category">
                <option value="practice">Practice</option>
                <option value="event">Social Event</option>
                <option value="tournament">Tournament</option>
                <option value="deadline">Deadline</option>
            </select><br />

            <label htmlFor="starDatet">Start: </label>
            <input type="date" id="startDate" name="startDate" defaultValue={
                formatDate(dates ? dates[0] : event.start)
            }/><br />

            <label htmlFor="endDate">End: </label>
            <input type="date" id="endDate" name="endDate" defaultValue={
                formatDate(dates ? dates[1] : event.final)
            }/><br />

            <label htmlFor="allDay">All Day</label>
            <input type="checkbox" name="allDay" id="allDay" defaultChecked={allDay} onChange={handleChecked}/><br />

            {!allDay && <>
                <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    defaultValue={getTime(dates ? dates[0] : event.start)}
                />
                <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    defaultValue={getTime(dates ? dates[1] : event.end)}
                /><br />
                </>
            }

            <label htmlFor="interval">Repeat</label>
            <select name="interval" defaultValue={event?.period.toLowerCase() || 'never'}>
                <option value="never">Never</option>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Annually</option>
            </select><br />

            <label htmlFor="comments">Comments</label><br />
            <textarea id="comments" name="comments" rows="4" defaultValue={event?.comments} /><br /><br />

            <button type="reset" id="reset_button">Reset</button>
            <button type="submit" id="submit_button">Save</button>
        </form>
    );
}