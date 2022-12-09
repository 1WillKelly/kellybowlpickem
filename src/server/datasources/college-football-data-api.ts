import fetch from "cross-fetch";

import { env } from "../../env/server.mjs";
const CFB_ENDPOINT = "https://api.collegefootballdata.com";

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

  makeRequest(endpoint: string, options?: RequestOptions): Promise<Response> {
    const params = this.urlEncode(options);
    const url = `${CFB_ENDPOINT}${endpoint}${params}`;
    console.log("URL", url);
    return fetch(url, {
      headers: {
        Authorization: this.auth,
        Accept: "application/json",
      },
    }).then((resp) => resp.json());
  }
}
