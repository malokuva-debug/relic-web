'use client';

import { useState, useEffect } from 'react';

type UserSkin = { weapon_type: string, skin_id: string };
type Weapon = { id: string, name: string, image: string, category: { name: string } };
type Skin = { id: string, name: string, image: string, paint_index: string, weapon: { name: string }, rarity: { name: string, color: string }, isCustom?: boolean };

// Helper components for SVG usage
const LockIcon = () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm3 10c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/>
    </svg>
);

const SearchIcon = () => (
    <svg className="w-4 h-4 text-[#757575]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const GridIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
    </svg>
);

export default function SkinClient({ initialUserSkins, user, customDbSkins }: { 
    initialUserSkins: UserSkin[], user: any, customDbSkins: any[] 
}) {
    const [weapons, setWeapons] = useState<Weapon[]>([]);
    const [allSkins, setAllSkins] = useState<Skin[]>([]);
    const [userSkins, setUserSkins] = useState<UserSkin[]>(initialUserSkins);
    
    const [loadingData, setLoadingData] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // View states
    const [selectedWeaponToEquip, setSelectedWeaponToEquip] = useState<Weapon | null>(null);
    const [loadingSelect, setLoadingSelect] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('https://bymykel.github.io/CSGO-API/api/en/weapons.json').then(res => res.json()),
            fetch('https://bymykel.github.io/CSGO-API/api/en/skins.json').then(res => res.json())
        ]).then(([weaponsData, skinsData]) => {
            // Filter out items, tools to just pure weapons
            const valid = weaponsData.filter((w: Weapon) => w.category && w.category.name && w.image);
            setWeapons(valid);
            setAllSkins(skinsData);
            setLoadingData(false);
        }).catch(err => {
            console.error(err);
            setLoadingData(false);
        });
    }, []);

    const selectSkin = async (weaponType: string, skinId: string) => {
        setLoadingSelect(true);
        try {
            const res = await fetch('/api/skins/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weapon_type: weaponType, skin_id: skinId })
            });
            if (res.ok) {
                setUserSkins(prev => {
                    const cloned = [...prev.filter(s => s.weapon_type !== weaponType)];
                    cloned.push({ weapon_type: weaponType, skin_id: skinId });
                    return cloned;
                });
                // Go back to weapons view after selecting
                setSelectedWeaponToEquip(null);
            }
        } finally {
            setLoadingSelect(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#0E0F11]">
                <div className="text-[#a0a0a0] text-sm animate-pulse">Loading Asset Database...</div>
            </div>
        );
    }

    // Prepare Custom Skins Data
    const customSkinsFormatted: Skin[] = customDbSkins.map(s => ({
        id: s.id,
        name: `${s.weapon_type} | ${s.name}`,
        image: s.image_url,
        paint_index: s.id,
        weapon: { name: s.weapon_type },
        rarity: { name: 'Workshop', color: '#ecc12e' },
        isCustom: true
    }));

    // Data Filtering
    const tabs = ['Knives', 'Gloves', 'Rifles', 'Sniper Rifles', 'Pistols', 'SMGs', 'Heavy'];
    
    // Search applied directly to weapons base if on main page
    let displayedWeapons = weapons;
    if (activeTab !== 'All') {
        displayedWeapons = weapons.filter(w => w.category?.name === activeTab);
    }
    if (searchQuery) {
        displayedWeapons = displayedWeapons.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // If selecting a specific weapon, get its skins
    let weaponSkinsToDisplay: Skin[] = [];
    if (selectedWeaponToEquip) {
        weaponSkinsToDisplay = allSkins.filter(s => s.weapon?.name === selectedWeaponToEquip.name || s.name.includes(selectedWeaponToEquip.name));
        weaponSkinsToDisplay = [...customSkinsFormatted.filter(s => s.weapon.name === selectedWeaponToEquip.name), ...weaponSkinsToDisplay];
    }

    return (
        <div className="min-h-screen bg-[#0E0F11] text-[#E2E8F0] font-sans flex flex-col items-center">
            {/* Nav Header */}
            <header className="w-full border-b border-[#212226]">
                <div className="w-full max-w-[1500px] mx-auto px-6 py-5 flex justify-between items-center bg-[#0B0C0E]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-600 rounded-lg flex items-center justify-center -rotate-12 cursor-pointer">
                            <svg className="w-6 h-6 text-white rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 22h20L12 2z"/></svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">{user?.username || 'GUEST'} <span className="opacity-90">CS2-PLATFORM.COM</span></h1>
                            <p className="text-xs text-[#757575] mt-0.5">Was in game - <span className="text-[#a0a0a0]">just now</span></p>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[1500px] mx-auto px-6 flex items-end gap-10 mt-2">
                    {['Profile', 'Inventory', 'Skinchanger', 'Friends', 'Referrals', 'Settings'].map((tab) => (
                        <div key={tab} className={`px-2 pb-5 text-sm font-bold tracking-wide cursor-pointer transition-colors ${tab === 'Skinchanger' ? 'text-black bg-white rounded-t-3xl pt-2 px-8' : 'text-[#7A7A7A] hover:text-white'}`}>
                            {tab}
                        </div>
                    ))}
                </div>
            </header>

            {/* Main Layout Area */}
            <div className="w-full max-w-[1500px] mx-auto flex gap-6 px-6 py-6 pb-20">
                {/* Left Sidebar */}
                <aside className="w-56 shrink-0 flex flex-col gap-4">
                    <div className="bg-[#141518] rounded-2xl border border-[#212226] p-4 flex flex-col gap-1">
                        <div className="flex justify-between items-center text-white mb-2 cursor-pointer font-bold text-sm px-2">
                            <span>Collections</span>
                            <span className="text-[10px] transform rotate-180">▼</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#A0A0A0] hover:text-white p-2.5 rounded-xl cursor-pointer transition-colors">
                            <div className="w-2 h-2 rounded-full bg-[#1e40af]"></div>
                            <span className="text-sm font-medium">Blue</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#A0A0A0] hover:text-white p-2.5 rounded-xl cursor-pointer transition-colors">
                            <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                            <span className="text-sm font-medium">Green</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#A0A0A0] hover:text-white p-2.5 rounded-xl cursor-pointer transition-colors">
                            <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                            <span className="text-sm font-medium">Red</span>
                        </div>
                        {/* Selected variant */}
                        <div className="flex items-center gap-3 text-white bg-[#1A1C20] p-2.5 rounded-xl cursor-pointer shadow-sm border border-[#2A2B30]">
                            <div className="w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_8px_#EAB308]"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium leading-none mb-1">Main</div>
                                <div className="text-[10px] text-[#7A7A7A]">{userSkins.length} skins</div>
                            </div>
                            <div className="text-[#7A7A7A] text-xs">⋮</div>
                        </div>
                        <div className="flex items-center gap-3 text-[#A0A0A0] hover:text-white p-2.5 mt-2 rounded-xl cursor-pointer">
                            <div className="w-4 h-4 bg-[#212226] text-[10px] flex items-center justify-center rounded-full font-bold">+</div>
                            <span className="text-sm font-medium">Create collection</span>
                        </div>
                    </div>

                    <div className="flex flex-col mt-2">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#EAB308]/10 to-transparent border-l-[3px] border-[#EAB308] text-[#EAB308] cursor-pointer">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/></svg>
                            <div>
                                <div className="font-bold text-sm">Skins</div>
                                <div className="text-[11px] opacity-70">Select skin for weapon</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#141518] text-[#A0A0A0] cursor-pointer transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            <div>
                                <div className="font-bold text-sm text-white">Agents</div>
                                <div className="text-[11px]">Select skin for agent</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#141518] text-[#A0A0A0] cursor-pointer transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                            <div>
                                <div className="font-bold text-sm text-white">Music kit</div>
                                <div className="text-[11px]">Select round end music</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Pane */}
                <main className="flex-1 bg-[#141518] border border-[#212226] rounded-2xl flex flex-col p-5 shadow-lg relative min-h-[600px]">
                    
                    {!selectedWeaponToEquip ? (
                        <>
                            {/* Weapon Tabs & Search Bar */}
                            <div className="flex justify-between items-center bg-[#181A1F] border border-[#232429] rounded-xl p-1.5 mb-6">
                                <div className="flex items-center gap-1">
                                    <button onClick={() => { setActiveTab('All'); setSearchQuery(''); }} className={`px-4 h-10 rounded-lg flex items-center justify-center transition-all ${activeTab === 'All' ? 'bg-[#212329] text-white border border-[#303238]' : 'text-[#757575] hover:text-white'}`}>
                                        <GridIcon />
                                    </button>
                                    
                                    {/* Mock SVGs using actual weapon silhouettes mapped tightly */}
                                    {tabs.map(cat => {
                                        const sampleWeapon = weapons.find(w => w.category?.name === cat);
                                        const isActive = activeTab === cat;
                                        return (
                                            <button 
                                                key={cat} 
                                                onClick={() => { setActiveTab(cat); setSearchQuery(''); }} 
                                                className={`w-14 h-10 flex items-center justify-center rounded-lg transition-all ${isActive ? 'bg-[#EAB308]/10 border border-[#EAB308]/30' : 'hover:bg-[#212329]'}`}
                                            >
                                                {sampleWeapon ? (
                                                    <img src={sampleWeapon.image} className={`max-h-5 object-contain filter ${isActive ? 'sepia hue-rotate-[320deg] saturate-[5] brightness-150 drop-shadow-[0_0_4px_#EAB308]' : 'grayscale invert opacity-40 brightness-200'}`} alt={cat} />
                                                ) : (
                                                    <div className="text-[9px] uppercase tracking-wider text-[#757575]">{cat}</div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="relative pr-2">
                                    <SearchIcon />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-[#181A1F] border border-[#303238] rounded-md px-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#555] w-64 text-[#A0A0A0]"
                                    />
                                </div>
                            </div>
                            
                            {/* Promo Banner */}
                            <div className="w-full h-[120px] rounded-2xl mb-5 bg-gradient-to-r from-[#0f172a] via-[#3b0764] to-[#be185d] relative overflow-hidden flex items-center px-8 border border-white/5 shadow-inner">
                                <div className="z-10 flex flex-col items-start gap-2">
                                    <div className="text-white bg-black/40 px-3 py-1 rounded backdrop-blur-md border border-white/10 flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-gradient-to-bl from-cyan-400 to-blue-600 flex items-center justify-center text-[8px] font-black italic">S</span>
                                        <h2 className="text-base font-black italic tracking-tighter text-white"><span className="text-cyan-400">SKIN</span>PLUS</h2>
                                    </div>
                                    <p className="text-white/80 text-xs font-bold">7-day free access – no card required</p>
                                </div>
                                <div className="absolute top-0 right-10 z-10 h-full flex items-center">
                                    <button className="bg-white text-black font-black uppercase text-xs px-6 py-3 rounded-xl hover:scale-105 transition-transform">Get for free</button>
                                </div>
                                {/* Decorative Gun Images in background */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2/3 h-[200%] bg-[url('https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEm1Fd6bpth9bN_Iv9nBrm_kVuamvzJtPAdVQ6YwuH-QXqx--6hoj84sopc3B-yA')] bg-cover bg-no-repeat bg-right opacity-30 mix-blend-screen scale-110 blur-[1px]"></div>
                            </div>

                            {/* Standard Grid of Weapons */}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {displayedWeapons.map(w => {
                                    const equippedSkinId = userSkins.find(s => s.weapon_type === w.name)?.skin_id;
                                    const equippedSkin = equippedSkinId ? allSkins.find(s => s.id === equippedSkinId || s.paint_index === equippedSkinId || s.id === `skin-${equippedSkinId}` || equippedSkinId === (s as any).workshop_id) || customSkinsFormatted.find(s => s.id === equippedSkinId) : null;
                                    
                                    if (equippedSkin) {
                                        // Populated Custom Card
                                        return (
                                            <div key={w.id} onClick={() => setSelectedWeaponToEquip(w)} className="bg-[#1C1D21] hover:bg-[#202126] rounded-xl border border-transparent cursor-pointer flex flex-col pt-3 pb-0 relative transition-colors" style={{ borderBottomColor: equippedSkin.rarity?.color || '#fff', borderBottomWidth: '2px' }}>
                                                <div className="absolute top-2 right-2 text-[#EAB308]"><LockIcon /></div>
                                                <div className="h-20 w-full px-4 flex items-center justify-center -mb-2 z-10">
                                                    <img src={equippedSkin.image} className="max-h-full max-w-full object-contain filter drop-shadow-lg" alt=""/>
                                                </div>
                                                <div className="px-2 pt-2 pb-3 text-center flex flex-col items-center justify-center min-h-[50px] bg-[#141518] rounded-b-xl border-t border-[#1C1D21] z-20">
                                                    <div className="text-[10px] text-[#A0A0A0] font-medium leading-none mb-1">{w.name}</div>
                                                    <div className="text-[13px] font-bold text-white truncate w-full px-2" title={equippedSkin.name}>{equippedSkin.name.replace(`${w.name} | `, '')}</div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Empty Silhouette Card
                                        return (
                                            <div key={w.id} onClick={() => setSelectedWeaponToEquip(w)} className="bg-[#181A1F] hover:bg-[#1C1D21] rounded-xl border border-transparent cursor-pointer flex flex-col pt-6 pb-2 relative transition-colors">
                                                <div className="h-[60px] w-full px-4 flex items-center justify-center mb-4">
                                                    <img src={w.image} className="max-h-full max-w-full object-contain filter grayscale invert opacity-[0.15] brightness-200" alt=""/>
                                                </div>
                                                <div className="px-2 text-center mt-auto">
                                                    <div className="text-[10px] text-[#555] font-bold uppercase tracking-wider">{w.name}</div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </>
                    ) : (
                        // SPECIFIC WEAPON SKIN SELECTION VIEW
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center bg-[#181A1F] border border-[#232429] rounded-xl p-2 mb-6">
                                <button onClick={() => setSelectedWeaponToEquip(null)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#A0A0A0] hover:text-white bg-[#212329] hover:bg-[#2A2C33] rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                                    Back to Weapons
                                </button>
                                <div className="text-white font-bold tracking-widest">{selectedWeaponToEquip.name}</div>
                                <div className="pr-4 text-xs font-bold text-[#555]">{weaponSkinsToDisplay.length} skins</div>
                            </div>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto pr-2 pb-10">
                                {weaponSkinsToDisplay.map(skin => {
                                    const isSelected = userSkins.find(s => s.weapon_type === selectedWeaponToEquip.name)?.skin_id === (skin.paint_index || skin.id);
                                    return (
                                        <div 
                                            key={skin.id}
                                            onClick={() => !loadingSelect && selectSkin(selectedWeaponToEquip.name, skin.paint_index || skin.id)}
                                            className={`group relative flex flex-col pt-4 overflow-hidden rounded-xl border cursor-pointer transition-all bg-[#181A1F] 
                                                ${isSelected ? 'border-[#EAB308] bg-[#1C1D21] ring-1 ring-[#EAB308]/50 shadow-[0_4px_20px_rgba(234,179,8,0.15)]' : 'border-transparent hover:border-[#303238] hover:bg-[#1C1D21]'}
                                                ${loadingSelect ? 'opacity-50 pointer-events-none' : ''}`}
                                            style={{ borderBottomColor: skin.rarity?.color || '#fff', borderBottomWidth: '2px' }}
                                        >
                                            <div className="absolute top-2 right-2 text-[#EAB308] opacity-50"><LockIcon /></div>
                                            {skin.isCustom && <div className="absolute top-2 left-2 bg-[#EAB308] text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">CUSTOM</div>}
                                            
                                            <div className="h-24 px-4 flex items-center justify-center flex-1">
                                                <img src={skin.image} alt={skin.name} className={`max-h-full max-w-full drop-shadow-xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            </div>

                                            <div className="px-3 pt-3 pb-4 text-center bg-[#141518] mt-2 border-t border-[#1C1D21]">
                                                <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1" style={{ color: skin.rarity?.color || '#fff' }}>
                                                    {skin.rarity?.name || 'Mil-Spec'}
                                                </div>
                                                <div className="text-[13px] font-bold text-white truncate w-full" title={skin.name}>
                                                    {skin.name.replace(`${selectedWeaponToEquip.name} | `, '')}
                                                </div>
                                                {/* Equip Label appears on hover or if equipped */}
                                                <div className={`text-[10px] font-bold uppercase tracking-wider mt-3 transition-opacity ${isSelected ? 'text-[#EAB308] opacity-100' : 'text-white opacity-0 group-hover:opacity-100'}`}>
                                                    {isSelected ? 'Equipped' : 'Click to Equip'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
