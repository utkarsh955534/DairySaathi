export function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function formatDateTime(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatText(value) {
    if (!value) return "—";

    return String(value)
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getHistoryEventConfig(type) {
    const configs = {
        ANIMAL_CREATED: {
            label: "Animal Added",
            icon: "🐄",
        },

        MILK_RECORD: {
            label: "Milk Record",
            icon: "🥛",
        },

        WEIGHT_RECORD: {
            label: "Weight Record",
            icon: "⚖️",
        },

        HEALTH_RECORD: {
            label: "Health Record",
            icon: "❤️",
        },

        BREEDING_RECORD: {
            label: "Breeding Record",
            icon: "🧬",
        },

        CALVING_RECORD: {
            label: "Calving",
            icon: "🐮",
        },

        LACTATION_RECORD: {
            label: "Lactation",
            icon: "🥛",
        },
    };

    return (
        configs[type] || {
            label: formatText(type) || "Event",
            icon: "📋",
        }
    );
}
