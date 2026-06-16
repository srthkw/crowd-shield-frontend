import { useEffect, useState } from "react";
import Loader2 from "../Loader2"
import API from "../../api/axios";
import { roleGradients } from "../../constants/roleGradient";
import { LuTrash2 } from "react-icons/lu";

export default function StayServicesTab({ eventId, user, event }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        contactNumber: "",
        address: "",
        price: "",
        description: "",
    });

    const [image, setImage] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {

        if (!formData.name || !formData.contactNumber || !formData.address || !formData.price || !formData.description || !image) {
            setError("All fields are required.");
            return;
        }

        try {

            setSubmitting(true);

            const data = new FormData();

            data.append("eventId", eventId);
            data.append("name", formData.name);
            data.append("contactNumber", formData.contactNumber);
            data.append("address", formData.address);
            data.append("price", formData.price);
            data.append("description", formData.description);
            data.append("image", image);

            await API.post(
                "/stay-services",
                data
            );

            await fetchServices();

            setShowModal(false);

            setFormData({
                name: "",
                contactNumber: "",
                address: "",
                price: "",
                description: "",
            });

            setImage(null);

        } catch (err) {

            console.error(
                "CREATE STAY SERVICE ERROR:",
                err
            );

        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (serviceId) => {
        try {
    
            const confirmDelete = window.confirm(
                "Are you sure you want to delete this stay service?"
            );
    
            if (!confirmDelete) return;
    
            await API.delete(
                `/stay-services/${serviceId}`
            );
    
            setServices((prev) =>
                prev.filter(
                    (service) =>
                        service._id !== serviceId
                )
            );
    
        } catch (err) {
    
            console.error(
                "DELETE STAY SERVICE ERROR:",
                err
            );
    
        }
    };

    const fetchServices = async () => {
        try {
            const res = await API.get(
                `/stay-services/${eventId}`
            );

            setServices(res.data.services);
        } catch (err) {
            console.error(
                "FETCH STAY SERVICES ERROR:",
                err
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchServices();
        }
    }, [eventId]);

    if (loading) {
        return (
            <div>
                <Loader2 />
            </div>
        );
    }

    return (
        <div className="text-center text-black">

            {/* Add Service Button */}

            {user.id === event.createdBy &&
                (
                    <button onClick={() => setShowModal(true)} className={`p-3 rounded-md text-white cursor-pointer bg-gradient-to-r ${roleGradients[user.role]}`}>Add Service</button>
                )}

            {/* Add Service Modal */}
            {showModal && (
                <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto no-scrollbar"
                    >
                        {/* Header */}
                        <div className="mb-6 border-b border-green-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-600">
                                Add Stay Service
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">Fill in the details below</p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="block w-full text-sm text-gray-600 p-2 border border-green-200 rounded-xl file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-gray-600 cursor-pointer"
                                />
                            </div>

                            {/* Text Inputs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Service Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Cozy Mountain Lodge"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setError("");
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-gray-600 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., +919345687890"
                                    value={formData.contactNumber}
                                    onChange={(e) => {
                                        setError("");
                                        setFormData({
                                            ...formData,
                                            contactNumber: e.target.value,
                                        })
                                    }
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="123 Main St, City, State"
                                    value={formData.address}
                                    onChange={(e) => {
                                        setError("");
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Price Per Night (₹)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => {
                                        setError("");
                                        setFormData({
                                            ...formData,
                                            price: e.target.value,
                                        })
                                    }
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your stay service..."
                                    value={formData.description}
                                    onChange={(e) => {
                                        setError("");
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors text-gray-700 placeholder-gray-400 resize-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6 pt-4 border-t border-green-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-green-200 text-green-700 font-medium hover:bg-green-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium transition-colors shadow-sm hover:shadow-md"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : (
                                    "Create Service"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Services Grid */}

            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                        <svg
                            className="w-10 h-10 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>

                    {/* Text Content */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        No Stay Services Available
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Currently, there are no stay services listed for this event. Event organizers can add stay services to help attendees find accommodations.
                    </p>

                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-5">
                    {services.map((service) => (
                        <div
                            key={service._id}
                            className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-green-100 hover:border-green-300 transition-all duration-300 overflow-hidden"
                        >
                            {/* Image with overlay gradient */}
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={service.imageUrl}
                                    alt={service.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Delete button */}
                                {user.id === event.createdBy && (
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="absolute top-2 left-2 bg-red-600 text-white p-1.5 rounded-full text-2xl font-semibold shadow-lg cursor-pointer"
                                    >
                                        <span className="flex items-center justify-center"><LuTrash2 /></span>
                                    </button>
                                )}
                                {/* Price badge positioned on image */}
                                {service.price && (
                                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3.5 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                                        ₹{service.price} <span className="font-normal text-green-100">/ night</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-800 mb-1.5 line-clamp-1">
                                    {service.name}
                                </h3>

                                {/* Divider */}
                                <div className="border-t border-green-100 my-3"></div>

                                {/* Contact & Address */}
                                <div className="space-y-2.5">
                                    {/* Contact */}
                                    <div className="flex items-start gap-3">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                                                Contact
                                            </p>
                                            <p className="text-sm text-gray-700 font-medium">
                                                {service.contactNumber}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-3">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                                                Address
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                {service.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}