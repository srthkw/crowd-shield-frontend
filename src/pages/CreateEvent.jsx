import React, { useState, useEffect } from "react";
import API from "./../api/axios";
import Navbar from "../components/Navbar";
import { roleGradientsBG, roleGradients } from "../constants/roleGradient";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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

    useEffect(() => {
            if (!user || user.role !== "admin") {
                setTimeout(() => {
                    navigate("/events");
                }, 2000);
            }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.name || !formData.location || !formData.date || !formData.description) {
            setError("All fields are required.");
            return;
        }

        try {
            setLoading(true);

            await API.post("/events",
                formData
            );

            setSuccess("Event created successfully!");
            setFormData({ name: "", location: "", date: "", description: "" });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to create event. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (user.role !== "organizer" || user.role !== "admin") {
        return (
            <div className={`min-h-screen bg-gradient-to-br ${roleGradientsBG[user.role] || ''} flex flex-col items-center text-gray-600`}>
                <Navbar />
                <div className="md:mt-5">
                    <div className="p-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-500 mb-5 md:mb-8">
                            You are not authorized to create an event.
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${roleGradientsBG[user.role] || ''} flex flex-col items-center text-gray-600`}>
            <Navbar />
            <div className="md:mt-5">
                <div className="p-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-500 mb-5 md:mb-8">
                        Create an Event
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4 md:max-w-xl bg-white/40 p-6 rounded-2xl shadow-lg">
                        <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Event name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => {
                                handleChange(e);
                                setError("");
                              }}
                            className="w-full rounded-xl bg-white/70 border-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
                        />

                        <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Location *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={(e) => {
                                handleChange(e);
                                setError("");
                              }}
                            className="w-full rounded-xl bg-white/70 border-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
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
                            onChange={(e) => {
                                handleChange(e);
                                setError("");
                              }}
                            className="w-full rounded-xl bg-white/70 border-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />

                        <label htmlFor="username" className="font-semibold sm:text-base text-xs text-left mr-auto relative left-0">Description *</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={(e) => {
                                handleChange(e);
                                setError("");
                              }}
                            className="w-full rounded-xl bg-white/70 border-none px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 transition-all duration-300"
                        />

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r ${roleGradients[user.role] || ''} text-white rounded-2xl py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-60 cursor-pointer`}
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
