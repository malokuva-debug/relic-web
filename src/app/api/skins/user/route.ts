import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const steamId = searchParams.get('steam_id');
        const weaponType = searchParams.get('weapon_type');

        if (!steamId || !weaponType) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

        console.log(`[Relic-API] Fetching skin for SteamID: ${steamId}, Weapon: ${weaponType}`);

        const { data: userSkin, error: userError } = await supabase
            .from('user_skins')
            .select('skin_id')
            .eq('steam_id', steamId)
            .eq('weapon_type', weaponType)
            .maybeSingle();

        if (userError) throw userError;
        if (!userSkin) return NextResponse.json({ workshop_id: null });

        // Check if skin_id is a UUID (custom workshop skin)
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userSkin.skin_id);

        if (isUuid) {
            const { data: customSkin, error: customError } = await supabase
                .from('skins')
                .select('workshop_id')
                .eq('id', userSkin.skin_id)
                .maybeSingle();
            
            if (customError) throw customError;
            if (customSkin) return NextResponse.json({ workshop_id: customSkin.workshop_id });
        }

        // Default: it's a direct paintkit index (like the 360 seen in logs)
        return NextResponse.json({ workshop_id: userSkin.skin_id });
    } catch (e: any) {
        console.error('[Relic-API] Error:', e.message);
        return NextResponse.json({ error: 'Internal server error', details: e.message }, { status: 500 });
    }
}
