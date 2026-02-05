export type Person = {
  name: string;
  url?: string;
};

export type EventDetail = {
  slug : string;
  title: string;

  date: {
    year : number;
    month: number;
    day  : number;
  };

  time: {
    start: string;
    end  : string;
  };

  place: {
    name?    : string;
    url?     : string;
    platform?: {
      name?    : string;
      instance?: string;
    };
  };

  flyer?: {
    width : number;
    height: number;
    image : string;
  };

  organizers: Person[];

  group?: {
    name: string;
    url : string;
  };

  support?: {
    role      : string;
    performers: Person[];
  }[];

  announcements: {
    sns: string;
    url: string;
  }[];

  hashtags?: string[];

  timetable?: {
    width: number;
    height: number;
    image: string;
  };

  timeSlot?: {
    start: string;
    end: string;
    performs: {
      start: string;
      end: string;
      dj: string[];
      vj?: string[];
    }[];
  }[];

  mixArchives?: {
    type: "mixcloud" | "youtube" | "twitch" | "cloudflare";
    embedUrl: string;
  }[];

  setlist?: {
    index: number;
    artist: string;
    track: string;
    url?: string;
  }[];

  galleryTwitter?: string[];
};
