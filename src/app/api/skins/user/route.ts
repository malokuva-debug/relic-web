import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const steamId = searchParams.get('steam_id');
    const weaponType = searchParams.get('weapon_type');

    if (!steamId || !weaponType) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    const { data: userSkin } = await supabase
        .from('user_skins')
        .select('skin_id')
        .eq('steam_id', steamId)
        .eq('weapon_type', weaponType)
        .single();

    if (!userSkin) return NextResponse.json({ workshop_id: null });

    // Check if skin_id is a UUID (custom workshop skin)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userSkin.skin_id);

    if (isUuid) {
        const { data: customSkin } = await supabase.from('skins').select('workshop_id').eq('id', userSkin.skin_id).single();
        if (customSkin) return NextResponse.json({ workshop_id: customSkin.workshop_id });
    }

    // Default: it's a direct paintkit index from official DB
    // The server plugin currently parses `workshop_id` returning an int as the fallback paint kit natively.
    return NextResponse.json({ workshop_id: userSkin.skin_id });
}
