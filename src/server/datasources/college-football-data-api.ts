import fetch from "cross-fetch";

import { env } from "../../env/server.mjs";
const CFB_ENDPOINT = "https://api.collegefootballdata.com";

export interface CFBDGame {
  id: number;
  season: number;
  week: number;
  season_type: string;
  start_date: string;
  completed: boolean;
  conference_game: boolean;
  venue: string;
  home_id: number;
  home_team: string;
  home_conference: string;
  home_points: number;
  home_division: string;
  away_id: number;
  away_team: string;
  away_conference: string;
  away_points: number;
  away_division: string;
  // Will be the bowl game title
  notes?: string;
}

export interface CFBDGameMedia {
  id: number;
  outlet?: string;
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
    return (await this.games(season, { seasonType: "postseason" })).filter(
      // Ignore non-bowl games and FCS championship games
      // Non-bowl games have no `notes`
      (g) => g.notes && g.home_division === "fbs"
    );
  }

  postSeasonGamesMedia(season: number): Promise<CFBDGameMedia[]> {
    return this.gamesMedia(season, { seasonType: "postseason" });
  }
}
