export default function Info({ label, value }) {
    return (
        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
            <span className="text-sm text-gray-500">
                {label}
            </span>

            <span className="text-right text-sm font-medium text-gray-800">
                {value || "—"}
            </span>
        </div>
    );
}
