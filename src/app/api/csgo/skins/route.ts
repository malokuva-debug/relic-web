import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

let cachedSkins: any[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 3600_000 * 24; // 24 hours

export async function GET() {
    try {
        if (cachedSkins && Date.now() - cacheTime < CACHE_TTL) {
            return NextResponse.json(cachedSkins);
        }

        const filePath = path.join(process.cwd(), 'public', 'skins.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileData);
        
        const result = Object.values(data.skins).map((s: any) => ({
            id: s.id,
            name: s.name,
            image: s.image,
            paint_index: s.paint_index,
            weapon: { name: s.weapon },
            rarity: { name: s.rarity, color: s.color }
        }));
        
        cachedSkins = result;
        cacheTime = Date.now();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Internal Proxy Error [Skins]:", error.message);
        return NextResponse.json({ error: 'Failed to aggregate skin data from local skins.json' }, { status: 500 });
    }
}
