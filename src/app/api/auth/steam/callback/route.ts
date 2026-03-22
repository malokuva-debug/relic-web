import { NextResponse } from 'next/server';
import { verifySteamCallback, getSteamProfile } from '@/lib/steam';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/session';

export async function GET(request: Request) {
    const steamId = await verifySteamCallback(request.url);
    
    if (!steamId) {
        return NextResponse.redirect(new URL('/?error=authentication_failed', request.url));
    }

    // Get profile data
    const profile = await getSteamProfile(steamId);
    if (!profile) {
        return NextResponse.redirect(new URL('/?error=profile_fetch_failed', request.url));
    }

    const username = profile.personaname;
    const avatar = profile.avatarmedium;

    // Upsert user in Supabase
    const { error } = await supabase
        .from('users')
        .upsert({ 
            steam_id: steamId, 
            username, 
            avatar 
        }, { onConflict: 'steam_id' });

    if (error) {
        console.error("Error upserting user:", error);
        return NextResponse.redirect(new URL('/?error=database_error', request.url));
    }

    // Create session cookie
    await createSession(steamId);

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/', request.url));
}
