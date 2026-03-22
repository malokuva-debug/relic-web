#!/usr/bin/env node
/**
 * CS2 Skins Generator - Complete Edition
 * 
 * Pulls from TWO sources to get EVERY skin:
 *   1. qwkdev/csapi data2.json - has most weapon skins with paint indexes
 *   2. ByMykel/CSGO-API skins.json - has gloves, knives, and structured data
 * 
 * Merges both to produce a complete skins.json with all weapons, gloves, knives.
 * 
 * Usage: node scripts/generate-skins.mjs
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA2_URL = 'https://raw.githubusercontent.com/qwkdev/csapi/main/data2.json';
const BYMYKEL_URL = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json';

const RARITY_MAP = {
    'consumer grade': { name: 'Consumer Grade', color: '#b0c3d9' },
    'industrial grade': { name: 'Industrial Grade', color: '#5e98d9' },
    'mil-spec grade': { name: 'Mil-Spec', color: '#4b69ff' },
    'mil-spec': { name: 'Mil-Spec', color: '#4b69ff' },
    'restricted': { name: 'Restricted', color: '#8847ff' },
    'classified': { name: 'Classified', color: '#d32ce6' },
    'covert': { name: 'Covert', color: '#eb4b4b' },
    'contraband': { name: 'Contraband', color: '#e4ae39' },
    'extraordinary': { name: 'Extraordinary', color: '#eb4b4b' },
    'exotic': { name: 'Exotic', color: '#d32ce6' },
    'remarkable': { name: 'Remarkable', color: '#8847ff' },
    'high grade': { name: 'High Grade', color: '#4b69ff' },
    'base grade': { name: 'Base Grade', color: '#b0c3d9' },
    'distinguished': { name: 'Distinguished', color: '#8847ff' },
    'superior': { name: 'Superior', color: '#d32ce6' },
    'master': { name: 'Master', color: '#eb4b4b' },
    'common': { name: 'Consumer Grade', color: '#b0c3d9' },
    'uncommon': { name: 'Industrial Grade', color: '#5e98d9' },
    'rare': { name: 'Mil-Spec', color: '#4b69ff' },
    'mythical': { name: 'Restricted', color: '#8847ff' },
    'legendary': { name: 'Classified', color: '#d32ce6' },
    'ancient': { name: 'Covert', color: '#eb4b4b' },
    'immortal': { name: 'Contraband', color: '#e4ae39' },
};

const CATEGORIES = {
    pistols: ['Glock-18', 'P2000', 'USP-S', 'P250', 'Tec-9', 'Five-SeveN', 'CZ75-Auto', 'Desert Eagle', 'R8 Revolver', 'Dual Berettas'],
    smgs: ['MAC-10', 'MP9', 'MP7', 'MP5-SD', 'UMP-45', 'P90', 'PP-Bizon'],
    rifles: ['Galil AR', 'FAMAS', 'AK-47', 'M4A4', 'M4A1-S', 'SG 553', 'AUG'],
    snipers: ['SSG 08', 'AWP', 'G3SG1', 'SCAR-20'],
    shotguns: ['Nova', 'XM1014', 'MAG-7', 'Sawed-Off'],
    machineguns: ['M249', 'Negev'],
};

function getCategory(weaponName) {
    for (const [cat, weapons] of Object.entries(CATEGORIES)) {
        if (weapons.includes(weaponName)) {
            const catMap = { pistols: 'Pistols', smgs: 'SMGs', rifles: 'Rifles', snipers: 'Sniper Rifles', shotguns: 'Shotguns', machineguns: 'Machine Guns' };
            return catMap[cat];
        }
    }
    if (weaponName.includes('Knife') || weaponName.includes('Bayonet') || weaponName.includes('Karambit') || weaponName.includes('Daggers') || weaponName.includes('Navaja') || weaponName.includes('Stiletto') || weaponName.includes('Talon') || weaponName.includes('Ursus') || weaponName.includes('Bowie') || weaponName.includes('Butterfly') || weaponName.includes('Falchion') || weaponName.includes('Flip') || weaponName.includes('Gut') || weaponName.includes('Huntsman') || weaponName.includes('Paracord') || weaponName.includes('Survival') || weaponName.includes('Nomad') || weaponName.includes('Skeleton') || weaponName.includes('Classic') || weaponName.includes('Kukri')) return 'Knives';
    if (weaponName.includes('Gloves') || weaponName.includes('Wraps') || weaponName.includes('gloves')) return 'Gloves';
    return 'Other';
}

function getRarity(rarityStr) {
    const key = (rarityStr || '').toLowerCase().trim();
    return RARITY_MAP[key] || { name: rarityStr || 'Mil-Spec', color: '#4b69ff' };
}

async function main() {
    console.log('🔫 CS2 Skins Generator - Complete Edition\n');

    const skins = {};
    const weapons = {};

    // Source 1: data2.json (most weapon skins with paint indexes)
    console.log('1. Fetching data2.json (weapon skins with paint indexes)...');
    try {
        const res = await fetch(DATA2_URL);
        if (res.ok) {
            const data2 = await res.json();
            const entries = Object.entries(data2);
            console.log(`   ✓ Got ${entries.length} entries`);
            
            let added = 0;
            for (const [key, item] of entries) {
                if (!item.weapon || !item.name || !item.image) continue;
                const weaponName = item.weapon;
                const skinName = item.name;
                const paintIndex = item['finish-catalog'] ? item['finish-catalog'].toString() : key;
                const category = getCategory(weaponName);
                const rarity = getRarity(item.rarity);

                skins[skinName] = {
                    id: skinName,
                    name: skinName,
                    weapon: weaponName,
                    paint_index: paintIndex,
                    image: item.image,
                    category,
                    rarity: rarity.name,
                    color: item.color || rarity.color,
                };
                added++;

                if (!weapons[weaponName]) {
                    weapons[weaponName] = { id: weaponName, name: weaponName, image: item.image, category };
                }
            }
            console.log(`   Added ${added} skins from data2.json`);
        }
    } catch (e) {
        console.log(`   ✗ Failed: ${e.message}`);
    }

    // Source 2: ByMykel/CSGO-API (has gloves, better structured data)
    console.log('\n2. Fetching ByMykel/CSGO-API (gloves, knives, all items)...');
    try {
        const res = await fetch(BYMYKEL_URL);
        if (res.ok) {
            const byMykelData = await res.json();
            console.log(`   ✓ Got ${byMykelData.length} entries`);
            
            let added = 0, skipped = 0;
            for (const item of byMykelData) {
                const weaponName = item.weapon?.name;
                if (!weaponName) continue;

                // Extract skin name: "★ Butterfly Knife | Fade" -> full name
                const skinName = item.name;
                if (!skinName) continue;

                // Skip if we already have this skin from data2
                if (skins[skinName]) { skipped++; continue; }

                const paintIndex = item.paint_index?.toString() || skinName;
                const category = item.category?.name || getCategory(weaponName);
                const rarity = getRarity(item.rarity?.name);
                const imageUrl = item.image;

                if (!imageUrl) continue;

                skins[skinName] = {
                    id: skinName,
                    name: skinName,
                    weapon: weaponName,
                    paint_index: paintIndex,
                    image: imageUrl,
                    category,
                    rarity: rarity.name,
                    color: item.rarity?.color || rarity.color,
                };
                added++;

                if (!weapons[weaponName]) {
                    weapons[weaponName] = { id: weaponName, name: weaponName, image: imageUrl, category };
                }
            }
            console.log(`   Added ${added} new skins (${skipped} already existed from data2)`);
        }
    } catch (e) {
        console.log(`   ✗ Failed: ${e.message}`);
    }

    // Build output
    const skinCount = Object.keys(skins).length;
    const weaponCount = Object.keys(weapons).length;

    const output = {
        _generated: new Date().toISOString(),
        _sources: ['qwkdev/csapi/data2.json', 'ByMykel/CSGO-API/skins.json'],
        _skin_count: skinCount,
        _weapon_count: weaponCount,
        weapons,
        skins,
    };

    const outputPath = resolve(__dirname, '..', 'public', 'skins.json');
    writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Generated skins.json`);
    console.log(`   Total skins: ${skinCount}`);
    console.log(`   Total weapons: ${weaponCount}`);
    console.log(`   Saved to: ${outputPath}`);

    // Category breakdown
    console.log('\n📊 Category breakdown:');
    const catCounts = {};
    for (const skin of Object.values(skins)) {
        catCounts[skin.category] = (catCounts[skin.category] || 0) + 1;
    }
    for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
        console.log(`   ${cat}: ${count} skins`);
    }
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
