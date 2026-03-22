import { redirect } from 'next/navigation';
import SkinClient from './SkinClient';
import { getSession } from '@/lib/session';
import { supabase } from '@/lib/supabase';

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect('/');

    const { data: user } = await supabase.from('users').select('*').eq('steam_id', session.steamId).single();
    if (!user) redirect('/?error=user_not_found');

    const { data: dbSkins } = await supabase.from('skins').select('*').order('created_at', { ascending: false });
    const { data: userSkins } = await supabase.from('user_skins').select('weapon_type, skin_id').eq('steam_id', session.steamId);

    return (
        <SkinClient initialUserSkins={userSkins || []} user={user} customDbSkins={dbSkins || []} />
    );
}
