import SkinClient from './SkinClient';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';

export default async function Home() {
    const session = await getSession();
    let user = null;
    let userSkins: any[] = [];
    
    if (session) {
        const { data } = await supabase.from('users').select('*').eq('steam_id', session.steamId).single();
        user = data;
        const { data: skins } = await supabase.from('user_skins').select('weapon_type, skin_id').eq('steam_id', session.steamId);
        userSkins = skins || [];
    }

    const { data: dbSkins } = await supabase.from('skins').select('*').order('created_at', { ascending: false });

    return (
        <SkinClient initialUserSkins={userSkins} user={user} customDbSkins={dbSkins || []} />
    );
}
