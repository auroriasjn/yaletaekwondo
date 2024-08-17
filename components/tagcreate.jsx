'use client'

import { useState } from 'react';
import { HexColorPicker } from "react-colorful";

export default function TagCreate({ name, onFinished }) {
    const [color, setColor] = useState("#aabbcc");

    const handleSubmit = async () => {
        const formData = { name: name, color: color };
        try {
            const response = await fetch(`http://localhost:3002/api/admin/tag/add`, {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            onFinished(name, color, data.id);
        } catch (e) {
            console.error(e, 'Error creating new tag.');
        }
    }

    return (
        <div className="tag_create_form">
            <h3>Tag Creator</h3>
            <HexColorPicker color={color} onChange={setColor} />
            <button onClick={handleSubmit} id="create_tag">Save</button>
        </div>
    );
}