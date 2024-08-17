
export default function Tag({ color, children }) {
    return (
        <div className="tag_box">
            <span style={{ color: color }}>
                {children}
            </span>
        </div>
    );
}