import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { weapon_type, skin_id } = await request.json();

        if (!weapon_type || !skin_id) {
            return NextResponse.json({ error: 'Missing weapon_type or skin_id' }, { status: 400 });
        }

        // Global Knife/Glove Equip Logic
        const filePath = path.join(process.cwd(), 'public', 'skins.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileData);
        
        const weaponInfo = data.weapons[weapon_type];
        if (weaponInfo) {
            const cat = weaponInfo.category;
            if (cat === 'Knives' || cat === 'Gloves') {
                const catWeapons = Object.values(data.weapons)
                    .filter((w: any) => w.category === cat)
                    .map((w: any) => w.name);
                
                await supabase
                    .from('user_skins')
                    .delete()
                    .eq('steam_id', session.steamId)
                    .in('weapon_type', catWeapons);
            }
        }

        const { error } = await supabase
            .from('user_skins')
            .upsert({
                steam_id: session.steamId,
                weapon_type,
                skin_id
            }, { onConflict: 'steam_id,weapon_type' });

        if (error) {
            console.error("DB Error:", error);
            return NextResponse.json({ error: 'Failed to select skin' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("API Error:", e.message);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}
