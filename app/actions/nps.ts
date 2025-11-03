'use server';

import {NPSAlert, NPSAlertsResponse, NPSEvent, NPSEventsResponse, NPSPark, NPSParksResponse,} from '@/types/nps';

/*
 * the meat and potatoes of the project, api fetch req, lots of data parsing, much of the code taken from: https://www.nps.gov/subjects/developer/api-documentation.htm
 * mainly for getting the info to be displayed on the site relevant to each park.
 */

const NPS_API_BASE = 'https://developer.nps.gov/api/v1';
const API_KEY = process.env.NPS_API_KEY; /* hidden secret key as specified in proj req */

if (!API_KEY) {
  console.error('No NPS API key set.');
}

interface FetchOptions {
  cache?: RequestCache;
  revalidate?: number;
}

/* func to fetch from nps api with err handling */
async function fetchNPS<T>( /* unspecified type */
  endpoint: string,
  params: Record<string, string> = {},
  options: FetchOptions = {}
): Promise<T> {
  if (!API_KEY) { /* if key undefined stops execution early, prevents undefined usage, so necessary */
    throw new Error('No NPS API key set.');
  }

  const searchParams = new URLSearchParams({ /*search under specified params*/
    api_key: API_KEY,
    ...params,
  });

  const url = `${NPS_API_BASE}${endpoint}?${searchParams.toString()}`; /* fetch req string in form of url*/

  try {
    const response = await fetch(url, { /* try catch for lazy err handling, response provided by api fetch*/
      headers: {
        'X-Api-Key': API_KEY,
      },
      cache: options.cache || 'force-cache',
      next: {
        revalidate: options.revalidate || 3600, // cache for 1 hour by default
      },
    });

    if (!response.ok) { /* quick err check if response not given */
      throw new Error(`NPS API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/* get all parks or filter by state, start with limit of 50 (1 per num of states), there are only 63 anyway but the api might fetch combinations or multi state parks/trails (appalachian trail) */
export async function getParks(
  stateCode?: string,
  limit: number = 51
): Promise<NPSPark[]> { /* promise NPSPark obj arr*/
  try {
    const params: Record<string, string> = {
      limit: limit.toString(),
    };

    if (stateCode) {
      params.stateCode = stateCode;
    }

    const response = await fetchNPS<NPSParksResponse>('/parks', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching parks:', error);
    return [];
  }
}

/* search parks by query string (searches name, description, etc.) */
export async function searchParks(query: string): Promise<NPSPark[]> {
  try {
    const params: Record<string, string> = { /* params obj */
      q: query, /* search term to pass to api */
      limit: '50',
    };

    const response = await fetchNPS<NPSParksResponse>('/parks', params);
    return response.data;
  } catch (error) {
    console.error('Error searching parks:', error);
    return [];
  }
}

/* get a specific park by its code, p much the same as searchParks but pushing a code lol, prob could just combine them but too tired, TODO worthy? */
export async function getParkByCode(parkCode: string): Promise<NPSPark | null> {
  try {
    const response = await fetchNPS<NPSParksResponse>('/parks', {
      parkCode,
    });

    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching park ${parkCode}:`, error);
    return null;
  }
}

/* fetch alerts from api response but specifically alerts rather than everything about the park provided */
export async function getAlerts(parkCode?: string): Promise<NPSAlert[]> {
  try {
    const params: Record<string, string> = {
      limit: '50',
    };

    if (parkCode) { /* if code provided set code */
      params.parkCode = parkCode;
    }

    const response = await fetchNPS<NPSAlertsResponse>( /* fetch alerts: https://www.nps.gov/subjects/developer/api-documentation.htm#/alerts/getAlerts */
      '/alerts',
      params,
      { revalidate: 1800 } // Cache for 30 minutes (alerts change more frequently)
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

/* same thing as getAlerts but for events: https://www.nps.gov/subjects/developer/api-documentation.htm#/events/getEvents */
export async function getEvents(parkCode?: string): Promise<NPSEvent[]> {
  try {
    const params: Record<string, string> = {
      limit: '50',
    };

    if (parkCode) {
      params.parkCode = parkCode;
    }

    const response = await fetchNPS<NPSEventsResponse>(
      '/events',
      params,
      { revalidate: 1800 } // Cache for 30 minutes
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/* fetch and filter the states where the parks are located, multiple if park spans multiple */
export async function getParkStates(): Promise<string[]> {
  try {
    const parks = await getParks();
    const statesSet = new Set<string>(); /* create empty set for states to be added*/

    parks.forEach((park) => { /* for each park get their state initials and add them to the set*/
      const states = park.states.split(',').map((s) => s.trim());
      states.forEach((state) => statesSet.add(state));
    });

    return Array.from(statesSet).sort(); /* return the arr or throw err if no states provided */
  } catch (error) {
    console.error('error fetching park states:', error);
    return [];
  }
}
