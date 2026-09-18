import { formatText } from "./livestock-utils";

export default function Badge({ children }) {
    return (
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {formatText(children)}
        </span>
    );
}
