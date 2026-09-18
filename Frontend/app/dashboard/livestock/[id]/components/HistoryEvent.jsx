import {
    formatDate,
    formatDateTime,
    formatText,
    getHistoryEventConfig,
} from "./livestock-utils";

export default function HistoryEvent({ event }) {
    const config = getHistoryEventConfig(event.type);

    return (
        <div className="relative flex gap-4">

            {/* =========================
                ICON
            ========================= */}

            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-lg">
                {config.icon}
            </div>

            {/* =========================
                CONTENT
            ========================= */}

            <div className="min-w-0 flex-1 pb-1">

                {/* Header */}

                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                            {config.label}
                        </span>

                        <h3 className="mt-1 font-semibold text-gray-900">
                            {event.title ||
                                config.label}
                        </h3>
                    </div>

                    <span className="text-xs text-gray-400 sm:mt-1">
                        {formatDateTime(event.date)}
                    </span>

                </div>

                {/* Description */}

                {event.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        {event.description}
                    </p>
                )}

                {/* =========================
                    TYPE-SPECIFIC DETAILS
                ========================= */}

                {event.type ===
                    "LACTATION_RECORD" && (
                    <LactationDetails
                        details={
                            event.details
                        }
                    />
                )}

                {event.type ===
                    "CALVING_RECORD" && (
                    <CalvingDetails
                        details={
                            event.details
                        }
                    />
                )}

                {event.type ===
                    "MILK_RECORD" && (
                    <MilkDetails
                        details={
                            event.details
                        }
                    />
                )}

                {event.type ===
                    "WEIGHT_RECORD" && (
                    <WeightDetails
                        details={
                            event.details
                        }
                    />
                )}

                {event.type ===
                    "HEALTH_RECORD" && (
                    <HealthDetails
                        details={
                            event.details
                        }
                    />
                )}

                {event.type ===
                    "BREEDING_RECORD" && (
                    <BreedingDetails
                        details={
                            event.details
                        }
                    />
                )}

                {event.type ===
                    "ANIMAL_CREATED" && (
                    <AnimalCreatedDetails
                        details={
                            event.details
                        }
                    />
                )}

            </div>
        </div>
    );
}

/* =====================================================
   LACTATION
===================================================== */

function LactationDetails({ details }) {
    if (!details) return null;

    return (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">

            <Detail
                label="Lactation Number"
                value={
                    details.lactationNumber
                        ? `#${details.lactationNumber}`
                        : null
                }
            />

            <Detail
                label="Start Date"
                value={
                    details.startDate
                        ? formatDate(
                              details.startDate
                          )
                        : null
                }
            />

            <Detail
                label="End Date"
                value={
                    details.endDate
                        ? formatDate(
                              details.endDate
                          )
                        : "Active"
                }
            />

            <Detail
                label="Total Milk"
                value={
                    details.totalMilk !==
                        null &&
                    details.totalMilk !==
                        undefined
                        ? `${details.totalMilk} L`
                        : null
                }
            />

            <Detail
                label="Peak Milk"
                value={
                    details.peakMilk !==
                        null &&
                    details.peakMilk !==
                        undefined
                        ? `${details.peakMilk} L/day`
                        : null
                }
            />

            <Detail
                label="Calf"
                value={
                    details.calf ||
                    "Not linked"
                }
            />

            {details.notes && (
                <div className="sm:col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        {details.notes}
                    </p>
                </div>
            )}

        </div>
    );
}

/* =====================================================
   CALVING
===================================================== */

function CalvingDetails({ details }) {
    if (!details) return null;

    return (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">

            <Detail
                label="Calf"
                value={
                    details.calf ||
                    "Not linked"
                }
            />

            {details.mother && (
                <Detail
                    label="Mother"
                    value={details.mother}
                />
            )}

            {details.notes && (
                <div className="sm:col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        {details.notes}
                    </p>
                </div>
            )}

        </div>
    );
}

/* =====================================================
   MILK
===================================================== */

function MilkDetails({ details }) {
    if (!details) return null;

    return (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">

            <Detail
                label="Morning"
                value={
                    details.morning !==
                        null &&
                    details.morning !==
                        undefined
                        ? `${details.morning} L`
                        : null
                }
            />

            <Detail
                label="Evening"
                value={
                    details.evening !==
                        null &&
                    details.evening !==
                        undefined
                        ? `${details.evening} L`
                        : null
                }
            />

            <Detail
                label="Total"
                value={
                    details.total !==
                        null &&
                    details.total !==
                        undefined
                        ? `${details.total} L`
                        : null
                }
            />

            {details.notes && (
                <div className="sm:col-span-3 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        {details.notes}
                    </p>
                </div>
            )}

        </div>
    );
}

/* =====================================================
   WEIGHT
===================================================== */

function WeightDetails({ details }) {
    if (!details) return null;

    return (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">

            <Detail
                label="Weight"
                value={details.weight}
            />

            <div />

            {details.notes && (
                <div className="sm:col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        {details.notes}
                    </p>
                </div>
            )}

        </div>
    );
}

/* =====================================================
   HEALTH
===================================================== */

function HealthDetails({ details }) {
    if (!details) return null;

    return (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">

            <Detail
                label="Type"
                value={formatText(
                    details.type
                )}
            />

            {details.vaccineName && (
                <Detail
                    label="Vaccine"
                    value={
                        details.vaccineName
                    }
                />
            )}

            {details.dewormerName && (
                <Detail
                    label="Dewormer"
                    value={
                        details.dewormerName
                    }
                />
            )}

            {details.problem && (
                <Detail
                    label="Problem"
                    value={details.problem}
                />
            )}

            {details.diagnosis && (
                <Detail
                    label="Diagnosis"
                    value={
                        details.diagnosis
                    }
                />
            )}

            {details.medicine && (
                <Detail
                    label="Medicine"
                    value={
                        details.medicine
                    }
                />
            )}

            {details.dose && (
                <Detail
                    label="Dose"
                    value={details.dose}
                />
            )}

            {details.checkupType && (
                <Detail
                    label="Checkup Type"
                    value={formatText(
                        details.checkupType
                    )}
                />
            )}

            {details.findings && (
                <div className="sm:col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Findings
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-700">
                        {details.findings}
                    </p>
                </div>
            )}

            {details.notes && (
                <div className="sm:col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        {details.notes}
                    </p>
                </div>
            )}

        </div>
    );
}

/* =====================================================
   BREEDING
===================================================== */

function BreedingDetails({ details }) {
    if (!details) return null;

    return (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">

            {details.type && (
                <Detail
                    label="Type"
                    value={formatText(
                        details.type
                    )}
                />
            )}

            {details.heatObservation && (
                <div className="sm:col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Heat Observation
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-700">
                        {
                            details.heatObservation
                        }
                    </p>
                </div>
            )}

            {details.semenCode && (
                <Detail
                    label="Semen Code"
                    value={
                        details.semenCode
                    }
                />
            )}

            {details.technician && (
                <Detail
                    label="Technician"
                    value={
                        details.technician
                    }
                />
            )}

            {details.pregnancyResult !==
                null &&
                details.pregnancyResult !==
                    undefined && (
                    <Detail
                        label="Pregnancy Result"
                        value={
                            details.pregnancyResult
                                ? "Pregnant"
                                : "Not Pregnant"
                        }
                    />
                )}

            {details.notes && (
                <div className="sm:col-span-2 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-400">
                        Notes
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        {details.notes}
                    </p>
                </div>
            )}

        </div>
    );
}

/* =====================================================
   ANIMAL CREATED
===================================================== */

function AnimalCreatedDetails({
    details,
}) {
    if (!details) return null;

    return (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">

            <Detail
                label="Species"
                value={formatText(
                    details.species
                )}
            />

            <Detail
                label="Sex"
                value={formatText(
                    details.sex
                )}
            />

            <Detail
                label="Life Stage"
                value={formatText(
                    details.lifeStage
                )}
            />

            <Detail
                label="Breed"
                value={details.breed}
            />

        </div>
    );
}

/* =====================================================
   DETAIL
===================================================== */

function Detail({
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-3">

            <p className="text-xs text-gray-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
                {value ?? "—"}
            </p>

        </div>
    );
}