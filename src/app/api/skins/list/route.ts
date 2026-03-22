import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CS_SKINS } from '@/lib/csSkins';

export async function GET() {
    const { data: dbSkins, error } = await supabase
        .from('skins')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: 'Failed to fetch skins' }, { status: 500 });
    }

    const combined = [
        ...(dbSkins || []).map(s => ({...s, isCustom: true})),
        ...CS_SKINS
    ];

    return NextResponse.json(combined);
}
