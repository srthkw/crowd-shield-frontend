import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function StayServicesTab({ eventId, user, event }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

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
                Loading stay services...
            </div>
        );
    }

    return (
        <div>

            {/* Add Service Button */}

            {/* Services Grid */}

            {services.length === 0 ? (
                <p>
                    No stay services available.
                </p>
            ) : (
                services.map((service) => (
                    <div key={service._id}>
                        <img
                            src={service.imageUrl}
                            alt={service.name}
                            width="250"
                        />

                        <h3>{service.name}</h3>

                        <p>
                            📞 {service.contactNumber}
                        </p>

                        <p>
                            📍 {service.address}
                        </p>

                        <p>
                            💰 ₹{service.price}
                        </p>

                        <p>
                            {service.description}
                        </p>
                    </div>
                ))
            )}

        </div>
    );
}