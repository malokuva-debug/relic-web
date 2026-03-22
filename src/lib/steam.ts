const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login';

export function getSteamLoginUrl(returnTo: string, realm: string) {
    const params = new URLSearchParams({
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.mode': 'checkid_setup',
        'openid.return_to': returnTo,
        'openid.realm': realm,
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    });
    return `${STEAM_OPENID_URL}?${params.toString()}`;
}

export async function verifySteamCallback(url: string): Promise<string | null> {
    const parsedUrl = new URL(url);
    const searchParams = parsedUrl.searchParams;
    
    const params = new URLSearchParams();
    params.set('openid.ns', 'http://specs.openid.net/auth/2.0');
    params.set('openid.mode', 'check_authentication');
    
    searchParams.forEach((value, key) => {
        if (key !== 'openid.mode') {
            params.set(key, value);
        }
    });

    try {
        const response = await fetch(STEAM_OPENID_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        const text = await response.text();
        const isValid = text.includes('is_valid:true');
        
        if (!isValid) return null;
        
        const claimedId = searchParams.get('openid.claimed_id');
        if (!claimedId) return null;

        const steamIdMatch = claimedId.match(/https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)/);
        return steamIdMatch ? steamIdMatch[1] : null;
    } catch (error) {
        console.error("Error verifying Steam callback:", error);
        return null;
    }
}

export async function getSteamProfile(steamId: string) {
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) {
        console.error("STEAM_API_KEY is not set.");
        return null;
    }
    
    try {
        const res = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`);
        const data = await res.json();
        
        if (data.response && data.response.players && data.response.players.length > 0) {
            return data.response.players[0]; // { personaname, avatarmedium, profileurl, etc. }
        }
    } catch (error) {
        console.error("Error fetching Steam profile:", error);
    }
    
    return null;
}
