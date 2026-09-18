import InfoCard from "./InfoCard";
import Info from "./Info";
import ParentInfo from "./ParentInfo";
import { formatDate, formatText } from "./livestock-utils";

export default function AnimalInformation({ animal }) {
    return (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
            <InfoCard title="Basic Information">
                <Info label="Name" value={animal.name} />

                <Info
                    label="Tag Number"
                    value={animal.tagNumber}
                />

                <Info
                    label="Species"
                    value={animal.species}
                />

                <Info label="Breed" value={animal.breed} />

                <Info
                    label="Date of Birth"
                    value={formatDate(animal.dateOfBirth)}
                />

                <Info
                    label="Weight"
                    value={
                        animal.weight
                            ? `${animal.weight} kg`
                            : "—"
                    }
                />
            </InfoCard>

            <InfoCard title="Production">
                <Info
                    label="Status"
                    value={formatText(animal.productionStatus)}
                />

                <Info
                    label="Lactation Number"
                    value={animal.lactationNumber || "—"}
                />

                <Info
                    label="Lactation Start"
                    value={formatDate(animal.lactationStartDate)}
                />

                <Info
                    label="Current Milk"
                    value={
                        animal.currentMilkProduction
                            ? `${animal.currentMilkProduction} L/day`
                            : "—"
                    }
                />
            </InfoCard>

            <InfoCard title="Parentage">
                <ParentInfo
                    title="Mother"
                    source={animal.motherSource}
                    internal={animal.mother}
                    externalName={animal.motherExternalName}
                    externalBreed={animal.motherExternalBreed}
                    externalTag={animal.motherExternalTag}
                />

                <ParentInfo
                    title="Father"
                    source={animal.fatherSource}
                    internal={animal.father}
                    externalName={animal.fatherExternalName}
                    externalBreed={animal.fatherExternalBreed}
                    externalTag={animal.fatherExternalTag}
                />
            </InfoCard>

            <InfoCard title="Reproductive Information">
                <Info
                    label="Pregnancy"
                    value={formatText(animal.pregnancyStatus)}
                />

                <Info
                    label="Last Calving"
                    value={formatDate(animal.lastCalvingDate)}
                />

                <Info
                    label="Expected Calving"
                    value={formatDate(animal.expectedCalvingDate)}
                />
            </InfoCard>

            {animal.notes && (
                <div className="md:col-span-2">
                    <InfoCard title="Notes">
                        <p className="text-sm leading-6 text-gray-600">
                            {animal.notes}
                        </p>
                    </InfoCard>
                </div>
            )}
        </div>
    );
}
