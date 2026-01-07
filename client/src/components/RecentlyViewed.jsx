import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';

function RecentlyViewed({ excludeId }) {
    const [recentItems, setRecentItems] = useState([]);

    useEffect(() => {
        const storedItems = localStorage.getItem('recentlyViewed');
        if (storedItems) {
            try {
                let items = JSON.parse(storedItems);
                // Filter out excluded ID if provided
                if (excludeId) {
                    items = items.filter(item => item._id !== excludeId);
                }
                setRecentItems(items);
            } catch (e) {
                console.error('Failed to parse recently viewed items', e);
            }
        }
    }, [excludeId]);

    if (recentItems.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentItems.map((item) => (
                    <ListingCard key={item._id} listing={item} />
                ))}
            </div>
        </div>
    );
}

export default RecentlyViewed;
