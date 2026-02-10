/**
 * This utility provides ultra-low latency geospatial tiling without heavy library dependencies.
 */

const HEX_SIZE = 0.01;

export interface HexCoord {
    q: number;
    r: number;
    id: string;
}

export function getHexFromLatLng(lat: number, lng: number): HexCoord {
    const q = (Math.sqrt(3) / 3 * lng - 1 / 3 * lat) / HEX_SIZE;
    const r = (2 / 3 * lat) / HEX_SIZE;
    return roundToHex(q, r);
}

function roundToHex(q: number, r: number): HexCoord {
    let s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);
    const q_diff = Math.abs(rq - q);
    const r_diff = Math.abs(rr - r);
    const s_diff = Math.abs(rs - s);
    if (q_diff > r_diff && q_diff > s_diff) rq = -rr - rs;
    else if (r_diff > s_diff) rr = -rq - rs;
    return { q: rq, r: rr, id: `h_${rq}_${rr}` };
}

export function getHexNeighbors(hex: HexCoord, k: number = 1): string[] {
    const neighbors: string[] = [];
    for (let q = -k; q <= k; q++) {
        for (let r = Math.max(-k, -q - k); r <= Math.min(k, -q + k); r++) {
            neighbors.push(`h_${hex.q + q}_${hex.r + r}`);
        }
    }
    return neighbors;
}

/**
 * Converts a physical radius (km) to the number of hexagonal rings needed.
 * This is the bridge between merchant "Broadcast Radius" and technical "Hex Rings".
 */
export function getHexesInRadius(lat: number, lng: number, radiusKm: number): string[] {
    const centerHex = getHexFromLatLng(lat, lng);
    // Rough estimate: Each hex with HEX_SIZE 0.01 covers ~1.1km
    const k = Math.ceil(radiusKm / 1.1);
    return getHexNeighbors(centerHex, k);
}

export const MOCK_RESTAURANTS_DATA = [
    {
        id: 1,
        name: 'Pizza Hut',
        rating: 4.5,
        lat: 17.4485, lng: 78.3915,
        cuisines: 'Pizzas',
        area: 'Hitec City',
        offer: 'ITEMS AT ₹59',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'
    },
    {
        id: 2,
        name: 'Imperial Kitchen',
        rating: 4.3,
        lat: 17.4490, lng: 78.3925,
        cuisines: 'Biryani, Indian',
        area: 'Hitec City',
        offer: '40% OFF',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
    },
    {
        id: 3,
        name: 'Zomoz',
        rating: 4.2,
        lat: 17.4475, lng: 78.3900,
        cuisines: 'Momos, Chinese',
        area: 'Hitec City',
        offer: '50% OFF',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80'
    },
    {
        id: 4,
        name: 'McDonalds',
        rating: 4.4,
        lat: 17.4500, lng: 78.3935,
        cuisines: 'Burgers, Fast Food',
        area: 'Madhapur',
        offer: '₹100 OFF',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'
    },
    {
        id: 5,
        name: 'Paradise Biryani',
        rating: 4.6,
        lat: 17.4460, lng: 78.3880,
        cuisines: 'Biryani, North Indian',
        area: 'Hitec City',
        offer: 'FLAT ₹50 OFF',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80'
    },
    {
        id: 6,
        name: 'Al Taza',
        rating: 4.5,
        lat: 17.4065, lng: 78.4373,
        cuisines: 'Arabian, Juices',
        area: 'Mehdipatnam',
        offer: '10% OFF',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'
    },
    {
        id: 7,
        name: 'The Rameshwaram Cafe',
        rating: 4.4,
        lat: 17.4350, lng: 78.4100,
        cuisines: 'South Indian',
        area: 'Jubilee Hills',
        offer: '20% OFF',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80'
    },
    {
        id: 8,
        name: 'Bawarchi',
        rating: 4.7,
        lat: 17.4000, lng: 78.4500,
        cuisines: 'Biryani, Indian',
        area: 'RTC X Roads',
        offer: 'LEGENDARY',
        offerColor: 'bg-primary',
        image: 'https://images.unsplash.com/photo-1589187151003-0dd351ad9559?w=400&q=80'
    }
];

export const NEARBY_DATA = MOCK_RESTAURANTS_DATA.map(r => ({
    ...r,
    hexId: getHexFromLatLng(r.lat, r.lng).id
}));
