import { event as djV00 } from "@/data/dj/details/2022/Virtual00";
import { event as djV01 } from "@/data/dj/details/2022/Virtual01";
import { event as djV1 } from "@/data/dj/details/2022/Virtual1";

import { event as djV219 } from "@/data/dj/details/2025/Virtual219";
import { event as djV220 } from "@/data/dj/details/2026/Virtual220";
import { event as djV221 } from "@/data/dj/details/2026/Virtual221";
import { event as djV222 } from "@/data/dj/details/2026/Virtual222";
import { event as djV223 } from "@/data/dj/details/2026/Virtual223";

import { event as djR19 } from "@/data/dj/details/2025/Real19";
import { event as djR20 } from "@/data/dj/details/2026/Real20";
import { event as djR21 } from "@/data/dj/details/2026/Real21";
import { EventDetail } from "@/types/EventDetail";

//import { event as djV2 } from "@/data/dj/details/2022/DJVitrual2";

export const allPlayEvents: Record<string, EventDetail> = {
  "practice"               : djV00,
  "akipe-tokage-birthday-1": djV01,
  "dj-unknown-1"           : djV1,
  
  "mellons-afterlives-28": djV219,
  "m4tt-and-friends-1": djV220,
  "initium-1"         : djV221,
  "club-silhouette-23": djV222,
  "the-4th-anniv"     : djV223,

  "magnum-tornado-1"    : djR19,
  "technoverse-1"       : djR20,
  "dj-unknown-4th-anniv": djR21,
};


/*const DJ_HistoryDetail: DJ_Detail = [
  {
    year: "2025",
    events: [
      {
        slug: "1",
        title: "DJガチ初心者練習会",
        platform: "VRChat",
        date: "2022年2月12日",
        description: "VRChatの初心者向けイベントで初めての出演でした。",
        image: "/events/vrchat-beginner-party.webp",
      }
    ],
  },
];*/