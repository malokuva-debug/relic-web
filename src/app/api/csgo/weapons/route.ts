import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

let cachedWeapons: any[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 3600_000 * 24; // 24 hours

export async function GET() {
    try {
        if (cachedWeapons && Date.now() - cacheTime < CACHE_TTL) {
            return NextResponse.json(cachedWeapons);
        }

        const filePath = path.join(process.cwd(), 'public', 'skins.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileData);
        
        const result = Object.values(data.weapons).map((w: any) => ({
            id: w.id,
            name: w.name,
            image: w.image,
            category: { name: w.category }
        }));
        
        cachedWeapons = result;
        cacheTime = Date.now();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Internal Proxy Error [Weapons]:", error.message);
        return NextResponse.json({ error: 'Failed to aggregate weapons data from local skins.json' }, { status: 500 });
    }
}
