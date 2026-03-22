import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('steam_id', session.steamId)
        .single();
        
    if (error || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Also get user's active skins
    const { data: activeSkins } = await supabase
        .from('user_skins')
        .select('weapon_type, skin_id')
        .eq('steam_id', session.steamId);

    return NextResponse.json({
        user,
        activeSkins: activeSkins || []
    });
}
