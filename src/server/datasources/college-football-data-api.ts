import fetch from "cross-fetch";

import { env } from "../../env/server.mjs";
const CFB_ENDPOINT = "https://api.collegefootballdata.com";

export interface CFBDGame {
  id: number;
  season: number;
  week: number;
  seasonType: string;
  startDate: string;
  completed: boolean;
  conferenceGame: boolean;
  venue: string;
  homeId: number;
  homeTeam: string;
  homeConference: string;
  homeClassification: string;
  homePoints: number;
  homeDivision: string;
  awayId: number;
  awayTeam: string;
  awayConference: string;
  awayPoints: number;
  awayDivision: string;
  // Will be the bowl game title
  notes?: string;
}

export interface CFBDGameMedia {
  id: number;
  outlet?: string;
}

export interface CFBDTeam {
  id: number;
  school: string;
  mascot: string;
  color: string;
  logos: string[];
}

interface RequestOptions {
  [key: string]: string | number;
}

export class CFBDataSource {
  private auth: string;

  constructor() {
    this.auth = `Bearer ${env.CFBD_API_KEY}`;
  }

  // HACK: CFBD doesn't support `+` in params, and needs `%20`
  private urlEncode(options?: RequestOptions): string {
    if (!options) {
      return "";
    }

    const parts = [];
    for (const [key, value] of Object.entries(options)) {
      parts.push(`${key}=${encodeURIComponent(value)}`);
    }
    return `?${parts.join("&")}`;
  }

  private async makeRequest<T = unknown>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    const params = this.urlEncode(options);
    const url = `${CFB_ENDPOINT}${endpoint}${params}`;
    const result = await fetch(url, {
      headers: {
        Authorization: this.auth,
        Accept: "application/json",
      },
    });
    return (await result.json()) as T;
  }

  games(season: number, options?: RequestOptions): Promise<CFBDGame[]> {
    return this.makeRequest<CFBDGame[]>("/games", {
      year: season,
      ...options,
    });
  }

  gamesMedia(
    season: number,
    options: RequestOptions
  ): Promise<CFBDGameMedia[]> {
    return this.makeRequest<CFBDGame[]>("/games/media", {
      year: season,
      ...options,
    });
  }

  async postSeasonGames(season: number): Promise<CFBDGame[]> {
    return (
      await this.games(season, {
        seasonType: "postseason",
        classification: "fbs",
      })
    ).filter(
      // Non-bowl games have no `notes`
      (g) => {
        return g.notes;
      }
    );
  }

  postSeasonGamesMedia(season: number): Promise<CFBDGameMedia[]> {
    return this.gamesMedia(season, {
      seasonType: "postseason",
      classification: "fbs",
    });
  }

  bowlTeams(): Promise<CFBDTeam[]> {
    return this.makeRequest<CFBDTeam[]>("/teams/fbs");
  }
}
