export interface DiscographyItem {
  date: string;         // 'YYYY-MM-DD'
  title: string;        // 楽曲名
  compilation?: string; // 参加コンピレーション名
  label?: string;       // レーベル / 企画名
  links?: {             // 配信・試聴リンク（省略可能）
    name: string;
    url: string;
  }[];
}

export const discographyData: DiscographyItem[] = [
  {
    date: '2023-10-7',
    title: 'Jaku',
    compilation: '家ンザーコンピ vol.0',
    label: '家ンザー',
    links: [
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/track/jaku' }
    ]
  },
  {
    date: '2024-1-17',
    title: 'depth hoar',
    compilation: 'hoarfrost',
    label: 'loser4dim',
    links: [
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/album/hoarfrost' }
    ]
  },
  {
    date: '2024-3-1',
    title: 'After School',
    compilation: 'remind',
    label: 'loser4dim',
    links: [
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/album/remind' }
    ]
  },
  {
    date: '2024-6-17',
    title: 'buffer padding',
    compilation: 'Midnight Residents',
    label: 'Electrosheep Records',
    links: [
      { name: 'TuneCore', url: 'https://linkco.re/GqSrnrhv' },
      { name: 'YouTube', url: 'https://www.youtube.com/watch?v=E94bAOsEryw' },
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/track/buffer-padding' }
    ]
  },
  {
    date: '2024-10-27',
    title: 'Corridor',
    compilation: 'GOOD INTERNET 2',
    label: 'GOOD INTERNET',
    links: [
      { name: 'Booth', url: 'https://booth.pm/ja/items/6185822' },
      { name: 'YouTube', url: 'https://www.youtube.com/watch?v=hYoo_LzRNkM' }
    ]
  },
  {
    date: '2024-11-18',
    title: 'fried onions',
    compilation: 'Midnight Residents 2',
    label: 'Electrosheep Records',
    links: [
      { name: 'TuneCore', url: 'https://linkco.re/Zeft15ED' },
      { name: 'YouTube', url: 'https://www.youtube.com/watch?v=IlX-KU1rlHU' },
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/track/fried-onions' }
    ]
  },
  {
    date: '2024-12-27',
    title: 'Update',
    compilation: '4x4 lintel',
    label: 'loser4dim',
    links: [
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/album/4x4-lintel' }
    ]
  },
  {
    date: '2025-12-20',
    title: 'cicada',
    compilation: 'First Recordings',
    label: 'loser4dim',
    links: [
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/album/first-recordings' }
    ]
  },
  {
    date: '2025-12-24',
    title: 'MONDAYJUKE',
    compilation: 'MONDAY RELIEF Golden Record',
    label: 'MONDAY RELIEF',
    links: [
      { name: 'Bandcamp', url: 'https://mondayrelief.bandcamp.com/album/monday-relief-golden-record' }
    ]
  },
  {
    date: '2026-2-16',
    title: '二錠, KBSNK feat. 知声 - WING IT!!! (loser4dim Bootleg)',
    compilation: 'Upper Groove',
    label: 'loser4dim',
    links: [
      { name: 'Bandcamp', url: 'https://loser4dim.bandcamp.com/album/upper-groove' }
    ]
  },
  {
    date: '2026-4-20',
    title: 'MIDNIGHTFOG',
    compilation: 'GOOD GROOVE COLLECTION',
    label: 'GOOD INTERNET, NEO未來のファンク都市',
    links: [
      { name: 'Site', url: 'https://sites.google.com/view/goodgroovecollection/good-groove-collection' }
    ]
  }
];