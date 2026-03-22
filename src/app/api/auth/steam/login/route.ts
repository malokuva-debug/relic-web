import { NextResponse } from 'next/server';
import { getSteamLoginUrl } from '@/lib/steam';

export async function GET(request: Request) {
    const url = new URL(request.url);
    // The exact URL to our callback route
    const returnTo = `${url.origin}/api/auth/steam/callback`;
    const realm = url.origin;
    
    const steamUrl = getSteamLoginUrl(returnTo, realm);
    return NextResponse.redirect(steamUrl);
}
