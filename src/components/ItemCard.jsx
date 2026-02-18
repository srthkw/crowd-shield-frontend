import { FiCamera, FiMapPin } from "react-icons/fi";

const ItemCard = ({
    item,
    user,
    checkMatches,
    setDetails,
    claimItem,
    setClaimLoad,
    claimLoad,
    timeAgo
}) => {
    const isOwner =
        item.reportedBy.toString() === user.id ||
        user.role === "admin" ||
        user.role === "organizer";

        console.log(user.id, item.reportedBy.toString(), "Is owner:", isOwner);

    return (
        <div
            key={item._id}
            onClick={() => isOwner && checkMatches(item)}
            className={`bg-white flex flex-col h-full relative rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0.5 ${item.reportedBy.toString() === user.id
                ? "border-t-4 border-blue-500/70 cursor-pointer"
                : "border-t-4 border-green-500/70"
                }`}>
            {item.reportedBy.toString() === user.id && (
                <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Reported by you
                </span>
            )}
            {/* Item Header with Status */}
            <div className="p-4 pb-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-base line-clamp-1 mb-1">
                            {item.itemName}
                        </h3>

                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        {timeAgo(item.createdAt)}
                    </span>
                </div>
            </div>

            {/* Item Images */}
            <div className="flex flex-row pb-3">
                <div className="px-1.5">
                    <div className="flex">
                        {item.imageUrls?.length > 0 ? (
                            item.imageUrls.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={item.itemName}
                                    className="h-21 w-21 md:h-20 md:w-20 object-cover rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                                    loading="lazy"
                                />
                            ))
                        ) : (
                            <div className="h-21 w-21 md:h-20 md:w-20 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-100 flex-shrink-0">
                                <div className="text-2xl text-gray-400 mb-1"><FiCamera /></div>
                                <p className="text-xs text-gray-500">No image</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 relative">
                <div className="absolute w-full rounded-lg h-full border-x-3 border-gray-200 bg-gray-100/50 z-0"></div>
                <p className="relative z-5 text-sm md:text-sm text-gray-700 rounded-lg line-clamp-4 px-2 pt-1 mr-1 md:mr-2 md:pr-3 md:pl-2 whitespace-pre-wrap wrap-break-word">
                    {item.description}</p></div>
            </div>

            {/* Item Details */}
            <div className="px-4 pb-4">
                <div className="space-y-3">

                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center gap-1 text-gray-600 bg-gray-50 w-full px-2.5 py-1.5 rounded-lg">
                            <div><FiMapPin className="text-gray-400 text-xs" /></div>
                            <span className="line-clamp-1 text-xs wrap-break-word">{item.location}</span>
                        </div>
                    </div>
                </div>
            </div>
            
{/* {isOwner && (
                <span className="text-gray-500 text-xs italic mb-3 text-center">
                    Tap card to view matches
                </span>
            )} */}

            <div className={`my-auto flex flex-col md:flex-row md:gap-0 justify-center items-center ${(item.reportedBy.toString() === user.id || user.role === "admin" || user.role === "organizer") ? "pt-0" : "pt-3 md:pt-4 bg-gray-100/70 h-full rounded-b-xl"}`}>

                {/* Read Details Button */}
                <div className="px-2 pb-2 md:pb-4 w-full">
                    <button className="w-full cursor-pointer px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetails(item);
                        }}>
                        View Details
                    </button>
                </div>

                {/* Claim Button */}
                {item.reportedBy.toString() === user.id && (
                    <div className="px-2 pb-4 w-full">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                claimItem(item);
                                setClaimLoad(item._id);
                            }}
                            className="w-full cursor-pointer px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
                        >
                            {claimLoad === item._id ? "Claiming..." : "Mark as Claimed"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemCard;
