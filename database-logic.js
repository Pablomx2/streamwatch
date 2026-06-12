"use strict";
(function () {
    // ------------------------------------------------------------------
    // Data
    // Each record: { id, brand, model, tc (timecode input), audio (audio input) }
    // ------------------------------------------------------------------
    const cameraData = [
        { id: 1, brand: "AJA", model: "CION", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 2, brand: "Arri", model: "Alexa", tc: "5-pin LEMO", audio: "(1x) 5-pin XLR" },
        { id: 3, brand: "Arri", model: "Alexa Mini", tc: "5-pin LEMO", audio: "(1x) 5-pin LEMO" },
        { id: 4, brand: "Arri", model: "Alexa Mini LF", tc: "5-pin LEMO", audio: "(1x) 6-pin LEMO" },
        { id: 5, brand: "Arri", model: "Amira", tc: "BNC", audio: "(1x) 5-pin XLR; (2x) 3-pin XLR (+48V)" },
        { id: 6, brand: "Arri", model: "Alexa 35", tc: "5-pin LEMO", audio: "(3x) 3-pin Mini XLR (+48V); (1x) 6-pin LEMO" },
        { id: 7, brand: "Arri", model: "Alexa SXT", tc: "5-pin LEMO", audio: "(1x) 5-pin XLR" },
        { id: 8, brand: "Blackmagic", model: "Other Models", tc: "None", audio: "(2x) ¼\" Jack" },
        { id: 9, brand: "Blackmagic", model: "4K URSA", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 10, brand: "Blackmagic", model: "Pocket 6K Pro", tc: "3.5mm Mic Jack", audio: "(2x) 3-pin Mini XLR (+48V); (1x) 3.5mm Mic" },
        { id: 11, brand: "Blackmagic", model: "Studio 4K Plus", tc: "None", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 12, brand: "Blackmagic", model: "Studio 4K Pro", tc: "None", audio: "(2x) 3-pin XLR (+48V); (1x) 3.5mm TRS" },
        { id: 13, brand: "Blackmagic", model: "URSA Mini Pro", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 14, brand: "Blackmagic", model: "Pocket 6K G2", tc: "Auto (All Audio Inputs)", audio: "(2x) 3-pin Mini XLR (+48V); 3.5mm TRS" },
        { id: 15, brand: "Blackmagic", model: "PYXIS 6K/12K", tc: "BNC", audio: "(1x) 3-pin Mini XLR (+48V); 3.5mm TRS" },
        { id: 16, brand: "Canon", model: "1D X Mark III", tc: "None", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 17, brand: "Canon", model: "5D/7D", tc: "None", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 18, brand: "Canon", model: "C100", tc: "None", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 19, brand: "Canon", model: "C200", tc: "None", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 20, brand: "Canon", model: "C300", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 21, brand: "Canon", model: "C500", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 22, brand: "Canon", model: "C70", tc: "BNC", audio: "(2x) 3-pin Mini XLR (+48V); 3.5mm TRS" },
        { id: 23, brand: "Canon", model: "R5C", tc: "DIN 1.0/2.3", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 24, brand: "Canon", model: "C400", tc: "DIN 1.0/2.3", audio: "(2x) 3-pin Mini XLR (+48V)" },
        { id: 25, brand: "Canon", model: "C50", tc: "DIN 1.0/2.3", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 26, brand: "Canon", model: "C80", tc: "BNC", audio: "(2x) 3-pin Mini XLR (+48V); 3.5mm TRS" },
        { id: 27, brand: "Canon", model: "EOS R1", tc: "None (LTC via Audio)", audio: "3.5mm TRS Stereo" },
        { id: 28, brand: "Canon", model: "EOS R5 Mark II", tc: "None (LTC via Audio)", audio: "3.5mm TRS Stereo" },
        { id: 29, brand: "Canon", model: "EOS R6 III", tc: "None (LTC via Audio)", audio: "3.5mm TRS Stereo" },
        { id: 30, brand: "Canon", model: "80D", tc: "None", audio: "3.5mm TRS Stereo" },
        { id: 31, brand: "Canon", model: "XA10/15/20/25", tc: "None", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 32, brand: "Canon", model: "XA40", tc: "None", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 33, brand: "Canon", model: "XF100/200/300", tc: "None", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 34, brand: "Canon", model: "XF105/205/305/605/705", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 35, brand: "DJI", model: "Ronin 4D 6K/8K", tc: "3.5mm Mic Jack", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 36, brand: "DJI", model: "Osmo Pocket 3", tc: "USB-C", audio: "No external input" },
        { id: 37, brand: "DJI", model: "Osmo Action 4/5", tc: "USB-C", audio: "No external input" },
        { id: 38, brand: "Fujifilm", model: "X-H2S", tc: "None", audio: "3.5mm TRS; (2x) Combo XLR/¼\"" },
        { id: 39, brand: "Fujifilm", model: "GFX100 II", tc: "Wireless ATOMOS AirGlu", audio: "3.5mm TRS Stereo" },
        { id: 40, brand: "Fujifilm", model: "X-T50", tc: "None", audio: "3.5mm TRS Stereo" },
        { id: 41, brand: "Fujifilm", model: "GFX ETERNA 55", tc: "BNC", audio: "3.5mm TRS; (2x) 3-pin XLR (+48V)" },
        { id: 42, brand: "Kinefinity", model: "MAVO Edge 6K/8K", tc: "5-pin LEMO", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 43, brand: "Nikon", model: "ZR", tc: "Wireless ATOMOS AirGlu", audio: "3.5mm TRS Stereo" },
        { id: 44, brand: "Panasonic", model: "AG-AF100A", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 45, brand: "Panasonic", model: "HDX900", tc: "BNC", audio: "(2x) 3-pin XLR (+48V); 5-pin XLR" },
        { id: 46, brand: "Panasonic", model: "DC-GH5s", tc: "Flash Sync / BNC (w/ cable)", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 47, brand: "Panasonic", model: "AG-DVX200", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 48, brand: "Panasonic", model: "AU-EVA1", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 49, brand: "Panasonic", model: "Varicam LT", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 50, brand: "Panasonic", model: "Lumix BS1H", tc: "BNC", audio: "3.5mm TRS Stereo" },
        { id: 51, brand: "Panasonic", model: "LUMIX G9II", tc: "None", audio: "3.5mm TRS Stereo" },
        { id: 52, brand: "Panasonic", model: "LUMIX GH7", tc: "Flash Synchro", audio: "3.5mm TRS; (2x) 3-pin XLR (+48V)" },
        { id: 53, brand: "Panavision", model: "Millennium DXL/DXL2", tc: "5-pin LEMO", audio: "Optional wireless block" },
        { id: 54, brand: "RED", model: "DRAGON", tc: "4-pin LEMO", audio: "(2x) 3.5mm TRS Stereo" },
        { id: 55, brand: "RED", model: "EPIC", tc: "4-pin LEMO", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 56, brand: "RED", model: "GEMINI", tc: "4-pin LEMO", audio: "(1x) 5-pin XLR" },
        { id: 57, brand: "RED", model: "One", tc: "5-pin LEMO", audio: "(4x) 3-pin Mini XLR (+48V)" },
        { id: 58, brand: "RED", model: "Ranger", tc: "5-pin LEMO", audio: "(1x) 5-pin XLR" },
        { id: 59, brand: "RED", model: "Scarlet", tc: "4-pin LEMO", audio: "(1x) 3.5mm TRS" },
        { id: 60, brand: "RED", model: "WEAPON", tc: "4-pin LEMO", audio: "(1x) 3.5mm TRS" },
        { id: 61, brand: "RED", model: "Komodo 6K", tc: "9-pin Lemo", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 62, brand: "RED", model: "V-Raptor", tc: "9-Pin LEMO", audio: "(1x) 5-Pin LEMO 00" },
        { id: 63, brand: "RED", model: "Helium", tc: "4-pin LEMO (w/ expander)", audio: "3.5mm TRS (w/ expander)" },
        { id: 64, brand: "Sony", model: "A7S III / A1", tc: "MicroUSB (via Adapter)", audio: "3.5mm TRS Stereo" },
        { id: 65, brand: "Sony", model: "A7S II / A7 III", tc: "None (LTC via Audio)", audio: "3.5mm TRS Stereo" },
        { id: 66, brand: "Sony", model: "F23 / F35", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 67, brand: "Sony", model: "F55 / F5", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 68, brand: "Sony", model: "F65", tc: "BNC", audio: "None" },
        { id: 69, brand: "Sony", model: "FS7 / FS700", tc: "BNC / None", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 70, brand: "Sony", model: "FX3 / FX30", tc: "MicroUSB", audio: "Combo XLR / 3.5mm TRS" },
        { id: 71, brand: "Sony", model: "FX6", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 72, brand: "Sony", model: "FX9", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 73, brand: "Sony", model: "HDC 2500L", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 74, brand: "Sony", model: "HDW F900R", tc: "BNC", audio: "(2x) 3-pin XLR; 5-pin XLR" },
        { id: 75, brand: "Sony", model: "Venice", tc: "BNC", audio: "(1x) 5-pin XLR" },
        { id: 76, brand: "Sony", model: "Venice 2", tc: "BNC In & Out", audio: "(1x) 5-pin XLR" },
        { id: 77, brand: "Sony", model: "Burano", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 78, brand: "Sony", model: "FR7", tc: "BNC", audio: "5-pin XLR" },
        { id: 79, brand: "Sony", model: "A9iii", tc: "None", audio: "3.5mm TRS Stereo" },
        { id: 80, brand: "Sony", model: "FX2", tc: "MicroUSB", audio: "3.5mm TRS; (2x) 3-pin XLR" },
        { id: 81, brand: "Z Cam", model: "E2", tc: "Adapter to BNC", audio: "5-pin LEMO" },
        { id: 82, brand: "BirdDog", model: "Eyes P200", tc: "None", audio: "3.5mm TRS LINE" },
        { id: 83, brand: "RED", model: "Komodo-X", tc: "5-Pin LEMO", audio: "(1x) 5-Pin LEMO (+48V via adapter)" },
        { id: 84, brand: "RED", model: "V-Raptor XL", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 85, brand: "Blackmagic", model: "URSA Cine 12K / 17K", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 86, brand: "Blackmagic", model: "Cinema Camera 6K (FF)", tc: "3.5mm Mic Jack", audio: "(2x) 3-pin Mini XLR (+48V); (1x) 3.5mm Mic" },
        { id: 87, brand: "Blackmagic", model: "Pocket 4K", tc: "3.5mm Mic Jack", audio: "(1x) 3-pin Mini XLR (+48V); (1x) 3.5mm Mic" },
        { id: 88, brand: "Canon", model: "C300 Mark II / III", tc: "BNC", audio: "(2x) 3-pin XLR (+48V); (1x) 3.5mm Mic" },
        { id: 89, brand: "Canon", model: "C500 Mark II", tc: "BNC", audio: "(2x) 3-pin XLR (+48V); (1x) 3.5mm Mic" },
        { id: 90, brand: "Panasonic", model: "Varicam 35 / Pure", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 91, brand: "Panasonic", model: "LUMIX S1H", tc: "BNC (via Flash Sync)", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 92, brand: "Panasonic", model: "LUMIX S5II / S5IIX", tc: "None (LTC via Audio)", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 93, brand: "Sony", model: "PXW-Z280 / Z190", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 94, brand: "Sony", model: "A7 IV / A7R V", tc: "None (LTC via Audio)", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 95, brand: "Sony", model: "HDC-3500", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 96, brand: "Sigma", model: "fp / fp L", tc: "None (LTC via Audio)", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 97, brand: "Freefly", model: "Ember S5K", tc: "None", audio: "No external input" },
        { id: 98, brand: "DJI", model: "Inspire 3", tc: "3.5mm (via Remote)", audio: "3.5mm TRS on Remote" },
        { id: 99, brand: "Nikon", model: "Z9 / Z8", tc: "ATOMOS AirGlu", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 100, brand: "Nikon", model: "Z6 III", tc: "None (LTC via Audio)", audio: "(1x) 3.5mm TRS Stereo" },
        { id: 101, brand: "GoPro", model: "HERO 12 / 13 Black", tc: "QR Code / BT", audio: "Media Mod / 3.5mm Adapter" },
        { id: 102, brand: "Arri", model: "Alexa 65", tc: "5-pin LEMO", audio: "(1x) 5-pin XLR" },

        // ----- Broad-sweep additions: pro film-industry cameras -----
        // ARRI
        { id: 103, brand: "Arri", model: "Alexa LF", tc: "5-pin LEMO", audio: "(1x) 5-pin XLR" },
        { id: 104, brand: "Arri", model: "Alexa XT / Plus / Studio", tc: "5-pin LEMO", audio: "(1x) 5-pin XLR" },
        { id: 105, brand: "Arri", model: "Alexa Classic / EV", tc: "5-pin LEMO", audio: "(1x) 5-pin XLR" },
        // RED
        { id: 106, brand: "RED", model: "V-Raptor [X] / Raptor [X]", tc: "9-Pin LEMO", audio: "(1x) 5-Pin LEMO 00 (+48V)" },
        { id: 107, brand: "RED", model: "Monstro 8K VV (DSMC2)", tc: "5-pin LEMO (w/ expander)", audio: "(1x) 3.5mm TRS (w/ expander)" },
        // Sony
        { id: 108, brand: "Sony", model: "PMW-F3", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 109, brand: "Sony", model: "PXW-FS5 / FS5 II", tc: "None (LTC via Audio)", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 110, brand: "Sony", model: "HDC-5500 / HDC-3500", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 111, brand: "Sony", model: "HDC-F5500", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 112, brand: "Sony", model: "PXW-Z150 / NX100", tc: "None", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        { id: 113, brand: "Sony", model: "A6700", tc: "None (LTC via Audio)", audio: "3.5mm TRS; MI Shoe Digital" },
        { id: 114, brand: "Sony", model: "ZV-E1", tc: "None (LTC via Audio)", audio: "3.5mm TRS; MI Shoe Digital" },
        // Canon
        { id: 115, brand: "Canon", model: "EOS R5", tc: "None (LTC via Audio)", audio: "3.5mm TRS Stereo" },
        { id: 116, brand: "Canon", model: "1D C", tc: "None", audio: "3.5mm TRS Stereo" },
        { id: 117, brand: "Canon", model: "ME20F-SH", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        // Panasonic
        { id: 118, brand: "Panasonic", model: "LUMIX GH6", tc: "Flash Synchro", audio: "3.5mm TRS; (2x) 3-pin XLR (+48V via DMW-XLR1)" },
        { id: 119, brand: "Panasonic", model: "LUMIX S1 / S1R", tc: "None (LTC via Audio)", audio: "3.5mm TRS Stereo" },
        { id: 120, brand: "Panasonic", model: "AG-CX350 / CX10", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        // Blackmagic
        { id: 121, brand: "Blackmagic", model: "URSA Mini 4.6K", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 122, brand: "Blackmagic", model: "URSA Broadcast G2", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        { id: 123, brand: "Blackmagic", model: "Micro Studio 4K G2", tc: "None", audio: "(1x) 3.5mm TRS" },
        // Fujifilm
        { id: 124, brand: "Fujifilm", model: "X-H2", tc: "None", audio: "3.5mm TRS; (2x) Combo XLR/¼\" via adapter" },
        { id: 125, brand: "Fujifilm", model: "X-T5 / X-T4", tc: "None", audio: "3.5mm TRS Stereo" },
        // Nikon
        { id: 126, brand: "Nikon", model: "Z6 II / Z7 II", tc: "None (LTC via Audio)", audio: "3.5mm TRS Stereo" },
        // Vision Research (high speed)
        { id: 127, brand: "Vision Research", model: "Phantom Flex4K", tc: "BNC / Fischer (Mini-BOB)", audio: "AES/EBU (via Mini-BOB)" },
        { id: 128, brand: "Vision Research", model: "Phantom VEO 4K", tc: "BNC / Fischer", audio: "AES/EBU (Digital)" },
        { id: 129, brand: "Vision Research", model: "Phantom Flex (2.5K)", tc: "BNC / Fischer", audio: "AES/EBU (via Capture cable)" },
        // Panavision
        { id: 130, brand: "Panavision", model: "Genesis", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        // Grass Valley (broadcast)
        { id: 131, brand: "Grass Valley", model: "LDX 100 / 150", tc: "BNC", audio: "(2x) 3-pin XLR (+48V)" },
        // Kinefinity
        { id: 132, brand: "Kinefinity", model: "MAVO mark2 LF / S35", tc: "5-pin LEMO", audio: "(2x) 3-pin XLR (+48V); 3.5mm TRS" },
        // Z Cam
        { id: 133, brand: "Z Cam", model: "E2-F6 / F8", tc: "Adapter to BNC", audio: "(1x) 5-pin LEMO" },
        // DJI
        { id: 134, brand: "DJI", model: "Mavic 3 Pro Cine", tc: "None", audio: "No external input" },
        // Insta360
        { id: 135, brand: "Insta360", model: "X4 / X5", tc: "USB-C / BT", audio: "3.5mm TRS (via adapter)" },
        { id: 136, brand: "Insta360", model: "Ace Pro 2", tc: "USB-C / BT", audio: "3.5mm TRS (via adapter)" }
    ];

    // ------------------------------------------------------------------
    // Frame-rate data (keyed by camera id)
    // fpsNote flags cameras whose menu shows "24p" but records at 23.976
    // ------------------------------------------------------------------
    const fpsData = {
        1:   { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60" },
        2:   { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        3:   { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        4:   { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 90fps" },
        5:   { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 200fps" },
        6:   { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        7:   { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        8:   { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60", fpsNote: "Supported rates vary by model." },
        9:   { fps: "23.98 · 24 · 25 · 29.97 · 30" },
        10:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        11:  { fps: "25 · 29.97 · 30 · 50 · 59.94 · 60" },
        12:  { fps: "25 · 29.97 · 30 · 50 · 59.94 · 60" },
        13:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · up to 300fps (G2)" },
        14:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        15:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        16:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        17:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        18:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        19:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        20:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        21:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        22:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        23:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        24:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        25:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        26:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        27:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        28:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        29:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        30:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        31:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        32:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        33:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        34:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        35:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        36:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        37:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        38:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        39:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        40:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        41:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        42:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 150fps" },
        43:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        44:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        45:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        46:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 180", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        47:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        48:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        49:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 240fps" },
        50:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        51:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        52:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        53:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        54:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 300fps" },
        55:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        56:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        57:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · up to 120fps" },
        58:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        59:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · up to 120fps" },
        60:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 300fps" },
        61:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        62:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 600fps" },
        63:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 300fps" },
        64:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        65:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        66:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        67:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 240fps (HFR)" },
        68:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        69:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · up to 240fps (FS700)" },
        70:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        71:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240" },
        72:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        73:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        74:  { fps: "23.98 · 24 · 25 · 29.97 · 30" },
        75:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        76:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        77:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        78:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        79:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        80:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        81:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        82:  { fps: "25 · 29.97 · 30 · 50 · 59.94 · 60" },
        83:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 160fps" },
        84:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 600fps" },
        85:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        86:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        87:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 60" },
        88:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        89:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        90:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 240fps" },
        91:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        92:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        93:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        94:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        95:  { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        96:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        97:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · up to 300fps" },
        98:  { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        99:  { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        100: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        101: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        102: { fps: "23.98 · 24 · 25 · 29.97 · 30 · up to 27fps at 6.5K" },
        103: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 90fps" },
        104: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        105: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        106: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 600fps" },
        107: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 47.95 · 48 · 50 · 59.94 · 60 · up to 75fps at 8K" },
        108: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        109: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240" },
        110: { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        111: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        112: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        113: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        114: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        115: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        116: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        117: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        118: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        119: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 180", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        120: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120" },
        121: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        122: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        123: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60" },
        124: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        125: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        126: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        127: { fps: "23.98 · 24 · 25 · 29.97 · up to 1000fps at 4K" },
        128: { fps: "23.98 · 24 · 25 · 29.97 · up to 1000fps at 1080p" },
        129: { fps: "23.98 · 24 · 25 · 29.97 · up to 2564fps at 2.5K" },
        130: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60" },
        131: { fps: "23.98 · 25 · 29.97 · 50 · 59.94" },
        132: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · up to 120fps" },
        133: { fps: "23.98 · 24 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120" },
        134: { fps: "23.98 · 25 · 29.97 · 30 · 48 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        135: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 120", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
        136: { fps: "23.98 · 25 · 29.97 · 30 · 50 · 59.94 · 60 · 240", fpsNote: "Menu shows '24p' — actual rate is 23.976 (24000/1001)" },
    };
    const getFps = id => fpsData[id] || { fps: "—" };

    // Pre-compute a lowercase search blob and pre-sort once (brand, then model).
    const collator = new Intl.Collator(undefined, { sensitivity: "base" });
    cameraData.forEach(c => { c._search = (c.brand + " " + c.model).toLowerCase(); });
    cameraData.sort((a, b) => collator.compare(a.brand, b.brand) || collator.compare(a.model, b.model));

    // Fast lookup by id.
    const byId = new Map(cameraData.map(c => [c.id, c]));

    // Rig selection: ordered list + Set for O(1) membership tests.
    // rigQty tracks how many of each camera are in the plan (keyed by id).
    const selectedRig = [];
    const rigSet = new Set();
    const rigQty = new Map();

    // ------------------------------------------------------------------
    // DOM references
    // ------------------------------------------------------------------
    const grid = document.getElementById("cameraGrid");
    const searchInput = document.getElementById("searchInput");
    const brandFilter = document.getElementById("brandFilter");
    const countDisplay = document.getElementById("statsCounter");
    const noResults = document.getElementById("noResults");

    // ------------------------------------------------------------------
    // Reusable inline-SVG icons (deduplicated)
    // ------------------------------------------------------------------
    const ICON = {
        clock: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        mic: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
        search: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        close: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        film: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>'
    };

    // Shared button styling for the "+ Rig" / "- Rig" toggle.
    const RIG_BTN_BASE = "px-2 py-1 rounded-lg text-[10px] font-bold transition-all";
    const RIG_BTN_ON = "bg-white text-black hover:bg-zinc-200 border border-white " + RIG_BTN_BASE;
    const RIG_BTN_OFF = "bg-black/80 hover:bg-white hover:text-black text-white border border-zinc-700 " + RIG_BTN_BASE;

    const esc = encodeURIComponent;
    // Build a clean image-search query: use the first model variant and drop
    // "[X]" / "(FF)" style suffixes so the lookup matches a real product shot.
    const imgQuery = cam => {
        const model = cam.model.split("/")[0].replace(/\[.*?\]|\(.*?\)/g, "").trim();
        return `${cam.brand} ${model} camera`;
    };
    const thumbUrl = (cam, w, h) =>
        `https://tse2.mm.bing.net/th?q=${esc(imgQuery(cam))}&w=${w}&h=${h}&c=7&rs=1&p=0`;

    // ------------------------------------------------------------------
    // Brand dropdown
    // ------------------------------------------------------------------
    [...new Set(cameraData.map(c => c.brand))].sort(collator.compare).forEach(brand => {
        const opt = document.createElement("option");
        opt.value = brand;
        opt.textContent = brand;
        brandFilter.appendChild(opt);
    });

    function getBrandColor() {
        return "from-zinc-700 to-zinc-950";
    }

    // Brand-level preferred timecode settings (matches fact-check workflow).
    const TC_SETTINGS = {
        "Arri": { run: "Free Run", sync: "Ext LTC", regen: "Regen", note: "Set to Regen if keeping a sync box continuously attached. Project rate must perfectly match incoming TC." },
        "Sony": { run: "Free Run", sync: "Ext Link", regen: "Preset", note: "TC Make: Preset. TC Run: Free Run. Ext Link must be actively selected to accept the jam." },
        "RED": { run: "Free Run", sync: "External", regen: "Jam", note: "REDs auto-jam when they see valid LTC. Check that the TC indicator icon turns green on the monitor." },
        "Canon": { run: "Free Run", sync: "TC IN", regen: "Preset", note: "Set TC to Preset. If using a C-series body (C300/C500), ensure the physical TC toggle switch is set to IN." },
        "Blackmagic": { run: "Free Run", sync: "Ext TC", regen: "Auto-Jam", note: "BMD cameras automatically jam to incoming timecode; no manual regen trigger is usually needed." },
        "Panasonic": { run: "Free Run", sync: "TC IN", regen: "Preset", note: "Select TC IN. If using audio LTC via a 3.5mm jack, ensure it is routed in the system menus." },
        "DJI": { run: "Free Run", sync: "Ext Source", regen: "Preset", note: "Use proper expansion plate or audio adapter for TC injection (e.g., Ronin 4D)." }
    };
    const TC_DEFAULT = { run: "Free Run", sync: "External / Audio LTC", regen: "Preset / Jam", note: "Standard dual-system setup: Jam to external source, set to Free Run." };
    const getTCSettings = brand => TC_SETTINGS[brand] || TC_DEFAULT;

    // ------------------------------------------------------------------
    // Toast notifications
    // ------------------------------------------------------------------
    const toastArea = document.getElementById("toastArea");
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `px-4 py-3 rounded-lg border text-xs font-semibold shadow-xl transition-all duration-300 transform translate-y-2 pointer-events-auto bg-black ${type === "error" ? "border-red-900 text-red-400" : "border-zinc-800 text-zinc-300"}`;
        toast.textContent = message;
        toastArea.appendChild(toast);
        setTimeout(() => {
            toast.classList.add("opacity-0", "-translate-y-2");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Interactive, self-dismissing toast: lets you stack multiple of the
    // same camera right after adding it (e.g. four matching B-cams).
    function showRigToast(cam) {
        const toast = document.createElement("div");
        toast.style.cssText = "transition: opacity 500ms cubic-bezier(0.4,0,0.2,1), transform 500ms cubic-bezier(0.4,0,0.2,1); opacity:0; transform: translateY(8px) scale(0.97);";
        toast.className = "w-64 px-4 py-3 rounded-lg border border-zinc-800 bg-black shadow-2xl pointer-events-auto";
        toast.innerHTML = `
            <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <p class="text-xs font-bold text-white">Added to rig plan</p>
                    <p class="text-[11px] text-zinc-400 truncate">${cam.brand} ${cam.model}</p>
                </div>
                <button data-act="close" class="text-zinc-500 hover:text-white shrink-0 -mt-0.5 -mr-1 p-1">${ICON.close}</button>
            </div>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
                <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Quantity</span>
                <div class="flex items-center gap-1 bg-zinc-900 border border-zinc-700 rounded-lg">
                    <button data-act="dec" class="w-7 h-7 flex items-center justify-center text-white hover:bg-white hover:text-black rounded-l-lg text-base font-bold leading-none">−</button>
                    <span data-qty-for="${cam.id}" class="w-6 text-center text-sm font-mono text-white">1</span>
                    <button data-act="inc" class="w-7 h-7 flex items-center justify-center text-white hover:bg-white hover:text-black rounded-r-lg text-base font-bold leading-none">+</button>
                </div>
            </div>`;
        toastArea.appendChild(toast);
        // Enter animation — double rAF ensures the initial style is painted first.
        requestAnimationFrame(() => requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0) scale(1)";
        }));

        // Auto-dismiss after 5s; any interaction resets the countdown so the
        // toast never disappears mid-adjustment.
        let timer;
        const dismiss = () => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(4px) scale(0.98)";
            setTimeout(() => toast.remove(), 520);
        };
        const arm = () => { clearTimeout(timer); timer = setTimeout(dismiss, 5000); };
        arm();

        toast.addEventListener("click", e => {
            const btn = e.target.closest("[data-act]");
            if (!btn) return;
            const act = btn.dataset.act;
            if (act === "close") { clearTimeout(timer); dismiss(); return; }
            const cur = rigQty.get(cam.id) || 1;
            if (act === "inc") setRigQty(cam.id, cur + 1);
            else if (act === "dec") setRigQty(cam.id, cur - 1);
            arm();
            e.stopPropagation();
        });

        // Dismiss on any interaction outside the toast.
        const outsideHandler = e => {
            if (!toast.contains(e.target)) {
                clearTimeout(timer);
                document.removeEventListener("click", outsideHandler, true);
                document.removeEventListener("keydown", outsideHandler, true);
                document.removeEventListener("scroll", outsideHandler, true);
                setTimeout(dismiss, 300);
            }
        };
        // Use capture so we catch clicks before they're stopped.
        setTimeout(() => {
            document.addEventListener("click", outsideHandler, true);
            document.addEventListener("keydown", outsideHandler, true);
            document.addEventListener("scroll", outsideHandler, true);
        }, 0);
    }

    // ------------------------------------------------------------------
    // Modal positioning helper (mirrors original click-anchored behaviour)
    // ------------------------------------------------------------------
    function positionModal(inner, e, offset) {
        let clickY = window.scrollY + 100;
        if (e && e.pageY) clickY = e.pageY;
        inner.style.marginTop = `${Math.max(clickY - offset, 20)}px`;
    }

    // ------------------------------------------------------------------
    // Multi-Cam Planner
    // ------------------------------------------------------------------
    function openPlannerModal(e) {
        const modal = document.getElementById("plannerModal");
        positionModal(document.getElementById("plannerModalInner"), e, 200);
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
    function closePlannerModal() {
        document.getElementById("plannerModal").classList.add("hidden");
        if (document.getElementById("cameraModal").classList.contains("hidden")) {
            document.body.style.overflow = "";
        }
    }

    function setRigButton(id) {
        const btn = document.getElementById(`rig-btn-${id}`);
        if (!btn) return;
        const inRig = rigSet.has(id);
        btn.className = inRig ? RIG_BTN_ON : RIG_BTN_OFF;
        btn.textContent = inRig ? "- Rig" : "+ Rig";
        btn.title = inRig ? "Remove from Master Rig Plan" : "Add to Master Rig Plan";
    }

    function toggleRig(id) {
        const cam = byId.get(id);
        if (!cam) return;
        if (rigSet.has(id)) {
            rigSet.delete(id);
            rigQty.delete(id);
            const idx = selectedRig.findIndex(c => c.id === id);
            if (idx > -1) selectedRig.splice(idx, 1);
            showToast(`Removed ${cam.brand} ${cam.model} from rig plan.`);
        } else {
            rigSet.add(id);
            rigQty.set(id, 1);
            selectedRig.push(cam);
            showRigToast(cam);
        }
        updatePlannerUI();
        setRigButton(id);
    }

    // Adjust the quantity for a camera already in the rig (min 1).
    function setRigQty(id, qty) {
        if (!rigSet.has(id)) return;
        const q = Math.max(1, qty | 0);
        rigQty.set(id, q);
        updatePlannerUI();
        // Keep any open quantity toast in sync.
        const disp = document.querySelector(`[data-qty-for="${id}"]`);
        if (disp) disp.textContent = q;
    }

    function removeFromPlanner(id) {
        if (!rigSet.has(id)) return;
        rigSet.delete(id);
        rigQty.delete(id);
        const idx = selectedRig.findIndex(c => c.id === id);
        if (idx > -1) selectedRig.splice(idx, 1);
        updatePlannerUI();
        setRigButton(id);
    }

    function clearPlanner() {
        selectedRig.length = 0;
        rigSet.clear();
        rigQty.clear();
        updatePlannerUI();
        closePlannerModal();
        render(); // reset all rig buttons
    }

    // Aggregate the required sync cables across the selected rig.
    function generateCableSummary() {
        const manifest = {};
        selectedRig.forEach(cam => {
            const tc = cam.tc.toLowerCase();
            const audio = cam.audio.toLowerCase();
            let cableType;
            if (tc.includes("bnc") && !tc.includes("din") && !tc.includes("mini bnc")) cableType = "BNC to BNC (Standard TC)";
            else if (tc.includes("5-pin lemo")) cableType = "5-Pin LEMO to TC Sync";
            else if (tc.includes("4-pin lemo")) cableType = "4-Pin LEMO to TC Sync";
            else if (tc.includes("9-pin lemo")) cableType = "9-Pin LEMO to TC Sync";
            else if (tc.includes("fischer")) cableType = "Fischer / Mini-BOB Sync Cable";
            else if (tc.includes("din 1.0/2.3") || tc.includes("mini bnc")) cableType = "DIN 1.0/2.3 (Mini BNC) to TC Sync";
            else if (tc.includes("microusb")) cableType = "MicroUSB TC Adapter Cable (e.g. VMC-BNCM1)";
            else if (tc.includes("usb-c")) cableType = "USB-C Audio/Sync Adapter";
            else if (tc.includes("wireless") || tc.includes("airglu") || tc.includes("bt") || tc.includes("qr code") || tc.includes("remote")) cableType = "Wireless Sync (AirGlu/BT) - No Cable";
            else if (tc.includes("3.5mm") || tc.includes("ltc via audio") || tc.includes("audio")) cableType = "3.5mm TRS Audio TC Cable";
            else if (tc === "none" && audio.includes("3.5mm")) cableType = "3.5mm TRS Audio TC Cable (LTC)";
            else if (tc === "none" && audio.includes("xlr")) cableType = "XLR to TC Audio Cable (LTC)";
            else if (tc === "none") cableType = "No direct TC input (Check Audio workflow)";
            else cableType = "Unknown / Custom Adapter";
            const qty = rigQty.get(cam.id) || 1;
            (manifest[cableType] || (manifest[cableType] = [])).push({ name: `${cam.brand} ${cam.model}`, qty });
        });
        return manifest;
    }

    function updatePlannerUI() {
        const totalUnits = selectedRig.reduce((sum, cam) => sum + (rigQty.get(cam.id) || 1), 0);
        document.getElementById("plannerBadge").textContent = totalUnits;
        const list = document.getElementById("plannerListModal");
        const manifestList = document.getElementById("cableManifestList");
        list.innerHTML = "";
        manifestList.innerHTML = "";

        if (selectedRig.length === 0) {
            list.innerHTML = `<span class="text-xs text-zinc-600 italic py-4 block text-center">No cameras added to your rig. Click "+ Rig" on a camera card.</span>`;
            manifestList.innerHTML = `<span class="text-xs text-zinc-600 italic py-4 block text-center">Manifest will auto-generate.</span>`;
            return;
        }

        const tagsHtml = selectedRig.map(cam => `
            <div class="flex items-center justify-between bg-zinc-900 border border-zinc-700 p-3 rounded-xl text-sm font-semibold text-white gap-2">
                <div class="flex items-center gap-3 overflow-hidden">
                    <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700 text-zinc-400 uppercase tracking-widest">${cam.brand}</span>
                    <span class="truncate">${cam.model}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <div class="flex items-center gap-1 bg-black border border-zinc-700 rounded-lg" title="Quantity in rig">
                        <button data-action="qty-dec" data-id="${cam.id}" class="w-6 h-6 flex items-center justify-center text-white hover:bg-white hover:text-black rounded-l-lg text-base font-bold leading-none">−</button>
                        <span class="w-5 text-center text-xs font-mono text-white">${rigQty.get(cam.id) || 1}</span>
                        <button data-action="qty-inc" data-id="${cam.id}" class="w-6 h-6 flex items-center justify-center text-white hover:bg-white hover:text-black rounded-r-lg text-base font-bold leading-none">+</button>
                    </div>
                    <button data-action="planner-remove" data-id="${cam.id}" class="text-zinc-500 hover:text-red-400 p-1.5 border border-transparent hover:border-red-900/50 hover:bg-red-950/30 rounded-lg transition-colors" title="Remove camera">
                        ${ICON.close}
                    </button>
                </div>
            </div>`).join("");
        list.innerHTML = tagsHtml;

        const manifest = generateCableSummary();
        manifestList.innerHTML = Object.entries(manifest).map(([cable, cameras]) => {
            const total = cameras.reduce((s, c) => s + c.qty, 0);
            const usedBy = cameras.map(c => c.qty > 1 ? `${c.name} (x${c.qty})` : c.name).join(", ");
            return `
            <div class="flex flex-col border-b border-zinc-800/50 py-3 last:border-0">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-zinc-300 font-bold">${cable}</span>
                    <span class="shrink-0 bg-zinc-800 border border-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded">x${total}</span>
                </div>
                <div class="text-[10px] text-zinc-500 font-medium leading-relaxed">
                    Used by: ${usedBy}
                </div>
            </div>`;
        }).join("");
    }

    // Delegated remove handler inside the planner list.
    document.getElementById("plannerListModal").addEventListener("click", e => {
        const rm = e.target.closest('[data-action="planner-remove"]');
        if (rm) { removeFromPlanner(Number(rm.dataset.id)); return; }
        const inc = e.target.closest('[data-action="qty-inc"]');
        if (inc) { const id = Number(inc.dataset.id); setRigQty(id, (rigQty.get(id) || 1) + 1); return; }
        const dec = e.target.closest('[data-action="qty-dec"]');
        if (dec) { const id = Number(dec.dataset.id); setRigQty(id, (rigQty.get(id) || 1) - 1); }
    });

    // ------------------------------------------------------------------
    // Camera detail modal
    // ------------------------------------------------------------------
    function modalRigSection(id) {
        const inRig = rigSet.has(id);
        const qty = rigQty.get(id) || 1;
        return `
            <div id="modal-rig-section" class="mx-6 mb-6 p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between gap-4">
                <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Rig Plan</p>
                    <p class="text-xs text-zinc-400 mt-0.5">${inRig ? `In rig &mdash; qty <span id="modal-rig-qty" class="text-white font-bold font-mono">${qty}</span>` : "Not in current rig"}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    ${inRig ? `
                    <div class="flex items-center gap-1 bg-black border border-zinc-700 rounded-lg">
                        <button data-modal-action="qty-dec" data-id="${id}" class="w-7 h-7 flex items-center justify-center text-white hover:bg-white hover:text-black rounded-l-lg text-base font-bold leading-none">−</button>
                        <span data-modal-qty="${id}" class="w-6 text-center text-sm font-mono text-white">${qty}</span>
                        <button data-modal-action="qty-inc" data-id="${id}" class="w-7 h-7 flex items-center justify-center text-white hover:bg-white hover:text-black rounded-r-lg text-base font-bold leading-none">+</button>
                    </div>
                    <button data-modal-action="remove" data-id="${id}" class="px-3 py-1.5 rounded-lg text-xs font-bold border border-zinc-700 text-zinc-400 hover:border-red-900 hover:text-red-400 hover:bg-red-950/30 transition-colors">Remove</button>
                    ` : `
                    <button data-modal-action="add" data-id="${id}" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-zinc-200 transition-colors">+ Add to Rig</button>
                    `}
                </div>
            </div>`;
    }

    function openModal(id, e) {
        const cam = byId.get(id);
        if (!cam) return;
        const modal = document.getElementById("cameraModal");
        const content = document.getElementById("modalContent");
        const tc = getTCSettings(cam.brand);
        const fps = getFps(cam.id);

        content.innerHTML = `
            <div class="h-48 relative border-b border-zinc-900 bg-zinc-950 flex items-center justify-center overflow-hidden rounded-t-2xl">
                <img src="${thumbUrl(cam, 800, 400)}" referrerpolicy="no-referrer" decoding="async" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700" onload="this.style.opacity='0.85';" onerror="this.remove()">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                <div class="relative z-10 text-center mt-12">
                    <span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-zinc-700 bg-black/80 rounded-full text-zinc-300">${cam.brand}</span>
                    <h2 class="text-3xl font-bold text-white mt-3">${cam.model}</h2>
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Preferred TC Settings</h3>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6 mt-4">
                    <div class="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                        <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Run Mode</p>
                        <p class="text-sm text-white font-mono">${tc.run}</p>
                    </div>
                    <div class="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                        <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Regen / Make</p>
                        <p class="text-sm text-white font-mono">${tc.regen}</p>
                    </div>
                    <div class="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl col-span-2">
                        <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Sync Mode</p>
                        <p class="text-sm text-white font-mono">${tc.sync}</p>
                    </div>
                </div>
                <h3 class="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-900 pb-2">Hardware I/O</h3>
                <div class="flex flex-col gap-3 mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                            ${ICON.clock}
                        </div>
                        <div>
                            <p class="text-[10px] uppercase font-bold text-zinc-500">Timecode Input</p>
                            <p class="text-sm font-semibold text-zinc-300">${cam.tc}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                            ${ICON.mic}
                        </div>
                        <div>
                            <p class="text-[10px] uppercase font-bold text-zinc-500">Audio Input</p>
                            <p class="text-sm font-semibold text-zinc-300">${cam.audio}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <p class="text-[10px] text-zinc-400 font-bold uppercase mb-1">Mixer Note:</p>
                    <p class="text-xs text-zinc-300 leading-relaxed">${tc.note}</p>
                </div>

                <h3 class="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-6 mb-4 border-b border-zinc-900 pb-2">Frame Rates</h3>
                <p class="text-sm font-mono text-zinc-300 leading-relaxed mb-3">${fps.fps}</p>
                ${fps.fpsNote ? `<div class="bg-amber-950/30 border border-amber-900/40 p-3 rounded-xl text-xs text-amber-400 leading-relaxed">⚠ ${fps.fpsNote}</div>` : ""}
            </div>
        </div>
        ${modalRigSection(cam.id)}
        `;

        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
    function closeModal() {
        document.getElementById("cameraModal").classList.add("hidden");
        if (document.getElementById("plannerModal").classList.contains("hidden")) {
            document.body.style.overflow = "";
        }
    }

    document.getElementById("modalContent").addEventListener("click", e => {
        const btn = e.target.closest("[data-modal-action]");
        if (!btn) return;
        const id = Number(btn.dataset.id);
        const act = btn.dataset.modalAction;
        if (act === "add") {
            rigSet.add(id); rigQty.set(id, 1); selectedRig.push(byId.get(id));
            showRigToast(byId.get(id));
        } else if (act === "remove") {
            removeFromPlanner(id);
        } else if (act === "qty-inc") {
            setRigQty(id, (rigQty.get(id) || 1) + 1);
        } else if (act === "qty-dec") {
            setRigQty(id, (rigQty.get(id) || 1) - 1);
        }
        // Replace the rig section in-place.
        const section = document.getElementById("modal-rig-section");
        if (section) {
            const tmp = document.createElement("div");
            tmp.innerHTML = modalRigSection(id);
            section.replaceWith(tmp.firstElementChild);
        }
        updatePlannerUI();
        setRigButton(id);
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closeModal();
            closePlannerModal();
        }
    });

    // ------------------------------------------------------------------
    // Card template + grid render
    // ------------------------------------------------------------------
    function cardHtml(cam) {
        const inRig = rigSet.has(cam.id);
        const fps = getFps(cam.id);
        const searchLink = `https://www.google.com/search?tbm=isch&q=${esc(cam.brand + " " + cam.model + " camera")}`;
        return `
            <div class="camera-card bg-black rounded-2xl overflow-hidden flex flex-col cursor-pointer relative group" data-id="${cam.id}">
                <div class="relative h-28 sm:h-44 image-placeholder border-b border-zinc-900">
                    <div class="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4 text-center">
                        <div class="bg-gradient-to-br ${getBrandColor(cam.brand)} border border-zinc-700 w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mb-1 sm:mb-2 flex items-center justify-center shadow-xl">
                            <span class="text-white font-black text-sm sm:text-xl">${cam.brand.charAt(0)}</span>
                        </div>
                        <span class="text-white/5 font-black text-2xl sm:text-4xl absolute -bottom-2 -right-2 rotate-12 pointer-events-none">${cam.brand.toUpperCase()}</span>
                        <p class="text-[9px] mono text-zinc-600 uppercase tracking-tighter">ID: ${cam.id}</p>
                    </div>

                    <img src="${thumbUrl(cam, 400, 300)}"
                         alt="${cam.brand} ${cam.model}"
                         referrerpolicy="no-referrer"
                         loading="lazy"
                         decoding="async"
                         class="absolute inset-0 w-full h-full object-cover z-10 opacity-0 transition-opacity duration-700"
                         onload="this.style.opacity='1'; if(this.previousElementSibling){this.previousElementSibling.style.display='none';}"
                         onerror="this.remove()">

                    <div class="absolute top-2 right-2 z-20 flex gap-2">
                        <button id="rig-btn-${cam.id}" data-action="rig" data-id="${cam.id}" class="${inRig ? RIG_BTN_ON : RIG_BTN_OFF}" title="${inRig ? "Remove from Master Rig Plan" : "Add to Master Rig Plan"}">
                            ${inRig ? "- Rig" : "+ Rig"}
                        </button>
                        <a href="${searchLink}" target="_blank" rel="noopener" data-action="link" class="bg-black/80 hover:bg-white hover:text-black border border-zinc-700 p-2 rounded-lg text-white transition-colors" title="Search manually on Google">
                            ${ICON.search}
                        </a>
                    </div>
                </div>
                <div class="p-3 sm:p-5 flex-1 flex flex-col">
                    <div class="mb-2 sm:mb-4 flex items-start justify-between">
                        <div class="min-w-0">
                            <span class="text-[9px] font-bold px-2 py-0.5 rounded border border-zinc-800 text-zinc-400 uppercase tracking-widest">${cam.brand}</span>
                            <h3 class="text-sm sm:text-lg font-bold text-white truncate mt-2">${cam.model}</h3>
                        </div>
                    </div>
                    <div class="space-y-3 mt-auto border-t border-zinc-900 pt-3">
                        <div class="flex items-center gap-3">
                            <div class="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hidden sm:flex items-center justify-center text-white shrink-0">
                                ${ICON.clock}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[8px] uppercase font-bold text-zinc-500 mb-0.5">Timecode</p>
                                <p class="text-xs font-semibold text-zinc-300 truncate" title="${cam.tc}">${cam.tc}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hidden sm:flex items-center justify-center text-white shrink-0">
                                ${ICON.mic}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[8px] uppercase font-bold text-zinc-500 mb-0.5">Audio Input</p>
                                <p class="text-xs font-semibold text-zinc-300 truncate" title="${cam.audio}">${cam.audio}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hidden sm:flex items-center justify-center text-white shrink-0">
                                ${ICON.film}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[8px] uppercase font-bold text-zinc-500 mb-0.5">Frame Rates</p>
                                <p class="text-xs font-semibold text-zinc-300 truncate" title="${fps.fps}">${fps.fps}</p>
                                ${fps.fpsNote ? `<p class="text-[8px] text-amber-500/80 mt-0.5 truncate">⚠ ${fps.fpsNote}</p>` : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    function render() {
        const query = searchInput.value.trim().toLowerCase();
        const brand = brandFilter.value;
        // Data is pre-sorted, so a single filter pass preserves brand/model order.
        const filtered = cameraData.filter(c =>
            (brand === "All" || c.brand === brand) &&
            (query === "" || c._search.includes(query))
        );

        countDisplay.innerHTML = `<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> DB: ${filtered.length} MODELS`;

        if (filtered.length === 0) {
            grid.innerHTML = "";
            noResults.classList.remove("hidden");
            return;
        }
        noResults.classList.add("hidden");
        grid.innerHTML = filtered.map(cardHtml).join("");
    }

    // Delegated grid interactions (replaces per-card inline handlers).
    grid.addEventListener("click", e => {
        const rigBtn = e.target.closest('[data-action="rig"]');
        if (rigBtn) { e.stopPropagation(); toggleRig(Number(rigBtn.dataset.id)); return; }
        if (e.target.closest('[data-action="link"]')) return; // let the Google link open
        const card = e.target.closest("[data-id]");
        if (card) openModal(Number(card.dataset.id), e);
    });

    // Debounced search so typing doesn't re-render on every keystroke.
    let searchTimer;
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(render, 120);
    });
    brandFilter.addEventListener("change", render);

    function resetFilters() {
        searchInput.value = "";
        brandFilter.value = "All";
        render();
    }

    // ------------------------------------------------------------------
    // ------------------------------------------------------------------
    // PDF export — opens a styled print window, auto-triggers print dialog
    // ------------------------------------------------------------------
    function downloadRigPDF() {
        if (selectedRig.length === 0) { showToast("No cameras in rig plan.", "error"); return; }

        const manifest = generateCableSummary();
        const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const totalUnits = selectedRig.reduce((s, c) => s + (rigQty.get(c.id) || 1), 0);

        const camRows = selectedRig.map(cam => {
            const qty = rigQty.get(cam.id) || 1;
            const fps = getFps(cam.id);
            return `<tr>
                <td class="brand">${cam.brand}</td>
                <td class="model">${cam.model}</td>
                <td class="center">${qty}</td>
                <td>${cam.tc}</td>
                <td>${cam.audio}</td>
                <td>${fps.fps}${fps.fpsNote ? `<div class="fps-note">* ${fps.fpsNote}</div>` : ""}</td>
            </tr>`;
        }).join("");

        const cableRows = Object.entries(manifest).map(([cable, cameras]) => {
            const total = cameras.reduce((s, c) => s + c.qty, 0);
            const usedBy = cameras.map(c => c.qty > 1 ? `${c.name} (×${c.qty})` : c.name).join(", ");
            return `<tr>
                <td>${cable}</td>
                <td class="center bold">${total}</td>
                <td>${usedBy}</td>
            </tr>`;
        }).join("");

        const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Still Speeding — Rig Plan</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: Helvetica Neue, Helvetica, Arial, sans-serif; color:#111; background:#fff; padding:36px 44px; font-size:12px; }
header { display:flex; justify-content:space-between; align-items:flex-end; padding-bottom:14px; border-bottom:2px solid #000; margin-bottom:28px; }
.co { font-size:20px; font-weight:800; letter-spacing:-0.5px; }
.sub { font-size:9px; text-transform:uppercase; letter-spacing:2.5px; color:#777; margin-top:5px; }
.meta { font-size:10px; color:#999; text-align:right; line-height:1.7; }
h2 { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#999; margin:24px 0 10px; }
table { width:100%; border-collapse:collapse; }
th { font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#aaa; padding:7px 10px; border-bottom:1px solid #ccc; text-align:left; }
td { padding:9px 10px; border-bottom:1px solid #eee; vertical-align:top; line-height:1.45; }
tr:last-child td { border-bottom:none; }
.brand { font-size:9px; font-weight:700; color:#999; text-transform:uppercase; letter-spacing:0.8px; }
.model { font-weight:600; }
.center { text-align:center; }
.bold { font-weight:700; }
.fps-note { font-size:9px; color:#b45309; margin-top:3px; }
footer { margin-top:36px; padding-top:10px; border-top:1px solid #eee; display:flex; justify-content:space-between; font-size:9px; color:#bbb; }
@page { margin:12mm 14mm; }
@media print { body { padding:0; } }
</style>
</head><body>
<header>
<div>
<div class="co">Still Speeding LLC</div>
<div class="sub">Multi-Cam Rig Plan</div>
</div>
<div class="meta">
<div>${now}</div>
<div>${selectedRig.length} camera type${selectedRig.length !== 1 ? "s" : ""} · ${totalUnits} total unit${totalUnits !== 1 ? "s" : ""}</div>
</div>
</header>
<h2>Selected Cameras</h2>
<table>
<thead><tr><th>Brand</th><th>Model</th><th>Qty</th><th>TC Input</th><th>Audio Input</th><th>Frame Rates</th></tr></thead>
<tbody>${camRows}</tbody>
</table>
<h2>Sync Cable Manifest</h2>
<table>
<thead><tr><th>Cable Type</th><th>Count</th><th>Used By</th></tr></thead>
<tbody>${cableRows}</tbody>
</table>
<footer>
<span>Still Speeding LLC — Camera Audio &amp; Timecode Database</span>
<span>Fact-Checked Database</span>
</footer>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`;

        const win = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
    }

    // ------------------------------------------------------------------
    // Expose the handlers referenced by inline onclick attributes
    // ------------------------------------------------------------------
    Object.assign(window, {
        openPlannerModal, closePlannerModal, clearPlanner,
        closeModal, resetFilters, downloadRigPDF
    });

    // Init
    render();
    updatePlannerUI();
})();