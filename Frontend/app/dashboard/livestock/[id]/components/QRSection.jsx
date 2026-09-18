"use client";

import { useState } from "react";
import QRCode from "qrcode";

import QRCodeModal from "./QRCodeModal";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1";

export default function QRSection({
    animalId,
}) {
    const [qrImage, setQrImage] = useState("");
    const [publicUrl, setPublicUrl] = useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const generateQr = async () => {
        if (!animalId) {
            setError("Animal ID is missing.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("authToken");

            if (!token) {
                throw new Error(
                    "Please login again."
                );
            }

            // =========================
            // REQUEST PUBLIC URL
            // =========================

            const response = await fetch(
                `${API_BASE_URL}/qr/animals/${animalId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to generate QR"
                );
            }

            const url =
                data?.data?.publicUrl;

            if (!url) {
                throw new Error(
                    "Public profile URL was not returned."
                );
            }

            // =========================
            // GENERATE QR IMAGE
            // =========================

            const qrDataUrl =
                await QRCode.toDataURL(url, {
                    width: 400,
                    margin: 2,
                    errorCorrectionLevel: "H",
                });

            setPublicUrl(url);
            setQrImage(qrDataUrl);

            // Open modal
            setShowModal(true);
        } catch (error) {
            console.error(
                "QR generation error:",
                error
            );

            setError(
                error.message ||
                    "Failed to generate QR"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="mt-8">

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    {/* =========================
                        HEADER
                    ========================= */}

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Animal QR Code
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                            Generate a QR code that opens
                            this animal's public profile
                            with its complete recorded history.
                        </p>
                    </div>

                    {/* =========================
                        ERROR
                    ========================= */}

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* =========================
                        BUTTON
                    ========================= */}

                    <div className="mt-5">

                        <button
                            type="button"
                            onClick={generateQr}
                            disabled={loading}
                            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Generating QR..."
                                : "Generate QR Code"}
                        </button>

                    </div>

                </div>

            </section>

            {/* =========================
                QR MODAL
            ========================= */}

            <QRCodeModal
                open={showModal}
                qrImage={qrImage}
                publicUrl={publicUrl}
                onClose={() =>
                    setShowModal(false)
                }
            />
        </>
    );
}