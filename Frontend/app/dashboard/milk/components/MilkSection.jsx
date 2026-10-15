"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import MilkRecordForm from "./MilkRecordForm";
import MilkStats from "./MilkStats";
import MilkChart from "./MilkChart";
import MilkHistory from "./MilkHistory";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

function getToday() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getDateKey(value) {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function extractAnimals(result) {
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.animals)) return result.data.animals;
  if (Array.isArray(result?.animals)) return result.animals;
  return [];
}

function extractRecords(result) {
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.records)) return result.data.records;
  if (Array.isArray(result?.records)) return result.records;
  return [];
}

export default function MilkSection() {
  const [animals, setAnimals] = useState([]);
  const [milkRecords, setMilkRecords] = useState({});
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [selectedDate, setSelectedDate] = useState(getToday());

  const [showForm, setShowForm] = useState(false);
  const [formAnimalId, setFormAnimalId] = useState("");

  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [loadingMilk, setLoadingMilk] = useState(false);
  const [error, setError] = useState("");

  // Fetch the logged-in farmer's animals.
  const fetchAnimals = useCallback(async () => {
    try {
      setLoadingAnimals(true);
      setError("");

      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Please log in to view milk records.");
      }

      const response = await fetch(`${API_BASE_URL}/animals/lactating`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to load animals.");
      }

      setAnimals(extractAnimals(result));
    } catch (err) {
      console.error("Animals fetch error:", err);
      setError(err.message || "Failed to load animals.");
    } finally {
      setLoadingAnimals(false);
    }
  }, []);

  // Fetch each animal's records independently.
  const fetchAllMilkRecords = useCallback(async () => {
    if (animals.length === 0) {
      setMilkRecords({});
      return;
    }

    try {
      setLoadingMilk(true);

      const token = localStorage.getItem("authToken");
      const recordsMap = {};

      await Promise.all(
        animals.map(async (animal) => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/milk/animals/${animal.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
              }
            );

            const result = await response.json();

            if (!response.ok) {
              console.error("Milk API error:", animal.id, result);
              recordsMap[animal.id] = [];
              return;
            }

            recordsMap[animal.id] = extractRecords(result);
          } catch (err) {
            console.error("Milk fetch error:", animal.id, err);
            recordsMap[animal.id] = [];
          }
        })
      );

      setMilkRecords(recordsMap);
    } catch (err) {
      console.error("Milk records error:", err);
      setError("Unable to refresh milk records.");
    } finally {
      setLoadingMilk(false);
    }
  }, [animals]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  useEffect(() => {
    if (!loadingAnimals) {
      fetchAllMilkRecords();
    }
  }, [loadingAnimals, fetchAllMilkRecords]);

  // Filter animals according to the selector.
  const visibleAnimals = useMemo(() => {
    if (!selectedAnimalId) return animals;

    return animals.filter(
      (animal) => String(animal.id) === String(selectedAnimalId)
    );
  }, [animals, selectedAnimalId]);

  const visibleMilkRecords = useMemo(() => {
    const result = {};

    visibleAnimals.forEach((animal) => {
      result[animal.id] = milkRecords[animal.id] || [];
    });

    return result;
  }, [visibleAnimals, milkRecords]);

  // One entry per animal for the selected date.
  const dailyRecords = useMemo(() => {
    return visibleAnimals.map((animal) => {
      const records = milkRecords[animal.id] || [];

      const record =
        records.find(
          (item) => getDateKey(item.recordDate) === selectedDate
        ) || null;

      return { animal, record };
    });
  }, [visibleAnimals, milkRecords, selectedDate]);

  // Daily production trend for the farm or selected animal.
  const chartData = useMemo(() => {
    const totals = {};

    Object.values(visibleMilkRecords)
      .flat()
      .forEach((record) => {
        const date = getDateKey(record.recordDate);
        if (!date) return;

        totals[date] =
          (totals[date] || 0) + Number(record.total || 0);
      });

    return Object.entries(totals)
      .map(([date, total]) => ({
        date,
        total: Number(total.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }, [visibleMilkRecords]);

  const formAnimal = useMemo(
    () =>
      animals.find(
        (animal) => String(animal.id) === String(formAnimalId)
      ),
    [animals, formAnimalId]
  );

  // Always open the form for a specific animal.
  const openForm = (animalId) => {
    if (animalId === undefined || animalId === null || animalId === "") {
      setFormAnimalId("");
    } else {
      setFormAnimalId(String(animalId));
    }

    setShowForm(true);
  };

  const handleSuccess = async () => {
    setShowForm(false);
    await fetchAllMilkRecords();
  };

  if (loadingAnimals) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
        <p className="mt-3 text-sm text-gray-500">Loading animals...</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-green-600">DairySaathi</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          Milk Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage individual animal records and daily farm production.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchAnimals}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Animal and date filters */}
      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <div>
          <label
            htmlFor="milk-animal"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Select Animal
          </label>

          <select
            id="milk-animal"
            value={selectedAnimalId}
            onChange={(event) => setSelectedAnimalId(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="">All Animals — Farm Total</option>
            {animals.map((animal) => (
              <option key={animal.id} value={String(animal.id)}>
                {animal.tagNumber || animal.name || `Animal ${animal.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="milk-date"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Select Date
          </label>

          <input
            id="milk-date"
            type="date"
            value={selectedDate}
            max={getToday()}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Add record button */}
      <div className="flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Add Milk Record</h2>
          <p className="mt-1 text-sm text-gray-600">
            Record morning and evening milk for an individual animal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (selectedAnimalId) {
              openForm(selectedAnimalId);
            } else if (animals.length === 1) {
              openForm(animals[0].id);
            } else {
              openForm("");
            }
          }}
          disabled={animals.length === 0}
          className="shrink-0 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add Milk Record
        </button>
      </div>

      {/* Dashboard content */}
      {animals.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-gray-800">No animals found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Add an animal in Livestock Management before recording milk.
          </p>
        </div>
      ) : (
        <>
          <MilkStats
            dailyRecords={dailyRecords}
            milkRecords={visibleMilkRecords}
            animals={visibleAnimals}
            selectedDate={selectedDate}
          />

          <MilkChart data={chartData} />

          <MilkHistory
            dailyRecords={dailyRecords}
            selectedDate={selectedDate}
            onAddRecord={openForm}
          />
        </>
      )}

      {/* Form */}
      {showForm && (
        <MilkRecordForm
          animalId={formAnimal?.id || ""}
          selectedDate={selectedDate}
          animals={animals}
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}

      {loadingMilk && (
        <p className="text-center text-sm text-gray-500">
          Refreshing milk records...
        </p>
      )}
    </section>
  );
}