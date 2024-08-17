'use client'

import { useState, useMemo, useContext } from 'react'
import {useFetchEvents} from '@/app/api/user/db.js'
import {useAuth} from "@/app/api/user/auth";

import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import EventForm from "./EventForm";
import EventCard from "./EventCard";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

const CalendarWidget = () => {
    const { user, admin } = useAuth();
    const { events, eventLoading } = useFetchEvents();
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [form, setForm] = useState(null);
    const [edit, setEdit] = useState(null);

    if (eventLoading) {
        return <div>Loading...</div>
    }

    const handleSelect = ({start, end}) => {
        // If not authenticated, no shot.
        if (!admin) {
            return;
        }

        setForm([start, end]);
        setEdit(null);
    };

    function onEventDrop({event, start, end, allDay}) {

    }

    function onEventResize({event, start, end, allDay}) {

    }

    function handleSubmit() {
        setForm(null);
        location.reload();
    }

    return (
        <div className="calendar_container">
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                view={view}
                date={date}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                onView={(view) => setView(view)}
                selectable={true}
                onSelectSlot={handleSelect}
                onSelectEvent={(event) => {
                    setEdit(event);
                    setForm(null);
                }}
                onNavigate={(date) => {
                    setDate(new Date(date));
                }}
                draggableAccessor={(event) => true}
                resizable
            />
            {(form && !edit) &&
                <div>
                    <button className="cancel" onClick={() => setForm(null)}>&times;</button>
                    <EventForm key={JSON.stringify(form)} dates={form} onSubmit={handleSubmit}/>
                </div>
            }
            {edit &&
                <div>
                    <button className="cancel" onClick={() => {
                        setEdit(null);
                        setForm(null);
                    }}>&times;</button>
                    <EventCard event={edit} />
                    <button className="edit" onClick={() => setForm(edit)}>Edit</button>
                    {form && <EventForm key={JSON.stringify(form)} event={form} onSubmit={handleSubmit}/>}
                </div>
            }
        </div>
    );
}

export default CalendarWidget;