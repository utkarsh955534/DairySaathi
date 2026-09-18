"use client";

import { useState } from "react";

export default function QRCodeModal({
    open,
    qrImage,
    publicUrl,
    onClose,
}) {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                publicUrl
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error(
                "Copy URL error:",
                error
            );
        }
    };

    const handleDownload = () => {
        if (!qrImage) return;

        const link =
            document.createElement("a");

        link.href = qrImage;
        link.download = "animal-qr-code.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewProfile = () => {
        if (!publicUrl) return;

        window.open(
            publicUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                {/* Close */}

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Header */}

                <div className="pr-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        Animal QR Code
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Scan this QR code to view the animal
                        and its complete history.
                    </p>
                </div>

                {/* QR */}

                <div className="mt-6 flex justify-center">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        {qrImage ? (
                            <img
                                src={qrImage}
                                alt="Animal QR Code"
                                className="h-64 w-64"
                            />
                        ) : (
                            <div className="flex h-64 w-64 items-center justify-center text-sm text-gray-400">
                                QR not available
                            </div>
                        )}
                    </div>
                </div>

                <p className="mt-4 text-center text-sm font-medium text-gray-700">
                    Scan to view public animal profile
                </p>

                {/* Public URL */}

                <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Public Profile URL
                    </label>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={publicUrl || ""}
                            readOnly
                            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
                        />

                        <button
                            type="button"
                            onClick={handleCopy}
                            className="shrink-0 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            {copied
                                ? "Copied"
                                : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Actions */}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={!qrImage}
                        className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Download QR
                    </button>

                    <button
                        type="button"
                        onClick={handleViewProfile}
                        disabled={!publicUrl}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        View Profile
                    </button>

                </div>
            </div>
        </div>
    );
}