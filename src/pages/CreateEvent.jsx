import React, { useState } from "react";
import API from "./../api/axios";
import Navbar from "../components/Navbar";

const CreateEvent = () => {

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        date: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.name || !formData.location || !formData.date || !formData.description) {
            setError("Name, location, and date are non-negotiable.");
            return;
        }

        try {
            setLoading(true);

            await API.post("/events",
                formData
            );

            setSuccess("Event created. Crowd control unlocked.");
            setFormData({ name: "", location: "", date: "", description: "" });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Event creation failed. Backend said nope."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200/50 via-purple-200/50 to-gray-100 flex flex-col items-center text-gray-600">
            <Navbar />
            <div className="md:mt-5">
                <div className="p-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-600 mb-5 md:mb-8">
                        Create an Event
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4 md:max-w-xl">
                        <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Event name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 bg-white/80 border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
                        />

                        <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Location *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 bg-white/80 border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
                        />

                        <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            min={today}
                            inputMode="none"
                            onKeyDown={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onClick={(e) => e.target.showPicker()}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 bg-white/80 border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />

                        <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Description *</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 bg-white/80 border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
                        />

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60"
                        >
                            {loading ? "Creating event..." : "Create event"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
