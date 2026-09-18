export default function InfoCard({ title, children }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-900">
                {title}
            </h2>

            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
