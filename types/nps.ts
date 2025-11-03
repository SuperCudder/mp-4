// ts interfaces for NPS API responses
// https://www.nps.gov/subjects/developer/api-documentation.htm

export interface NPSImage { /* image for data fetch */
  credit: string;
  title: string;
  altText: string;
  caption: string;
  url: string;
}

export interface NPSAddress { /* park addresses, contacts, etc*/
  postalCode: string;
  city: string;
  stateCode: string;
  countryCode: string;
  provinceTerritoryCode: string;
  line1: string;
  line2: string;
  line3: string;
  type: string;
}

export interface NPSContact { /* contact nums for park service operators/offices */
  phoneNumbers: Array<{
    phoneNumber: string;
    description: string;
    extension: string;
    type: string;
  }>;
  emailAddresses: Array<{
    description: string;
    emailAddress: string;
  }>;
}

export interface NPSEntranceFee { /* p self explanitory, fee processing/info */
  cost: string;
  description: string;
  title: string;
}

export interface NPSOperatingHours {
  exceptions: Array<{ /* exception hours due to *cough* gov't shutdown *cough* *cough* */
    exceptionHours: {
      [key: string]: string;
    };
    startDate: string;
    name: string;
    endDate: string;
  }>;
  description: string;
  standardHours: {
    [key: string]: string;
  };
  name: string;
}

export interface NPSPark { /* slew of data regarding specific parks, who what when where and how*/
  id: string;
  url: string;
  fullName: string;
  parkCode: string;
  description: string;
  latitude: string;
  longitude: string;
  latLong: string;
  activities: Array<{
    id: string;
    name: string;
  }>;
  topics: Array<{
    id: string;
    name: string;
  }>;
  states: string;
  contacts: NPSContact;
  entranceFees: NPSEntranceFee[];
  entrancePasses: Array<{
    cost: string;
    description: string;
    title: string;
  }>;
  fees: unknown[];
  directionsInfo: string;
  directionsUrl: string;
  operatingHours: NPSOperatingHours[];
  addresses: NPSAddress[];
  images: NPSImage[];
  weatherInfo: string;
  name: string;
  designation: string;
}

export interface NPSAlert { /* altert interface, diff types of alerts, who what when where how and why*/
  id: string;
  title: string;
  parkCode: string;
  description: string;
  category: 'Park Closure' | 'Caution' | 'Information' | 'Danger';
  url: string;
  lastIndexedDate: string;
}

export interface NPSEvent { /*special event data, prob wont even use this */
  id: string;
  title: string;
  parkfullname: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  category: string;
  tags: string[];
  contactname: string;
  contactemailaddress: string;
  contacttelephonenumber: string;
  datestart: string;
  dateend: string;
  times: Array<{
    timestart: string;
    timeend: string;
  }>;
  date: string;
  parkCode: string;
  sitecode: string;
  types: string[];
  recurrencedatestart: string;
  recurrencedateend: string;
  recurrencerule: string;
}

export interface NPSApiResponse<T> { /* api fetch response with non-expected type arr */
  total: string;
  data: T[];
  limit: string;
  start: string;
}

export type NPSParksResponse = NPSApiResponse<NPSPark>;
export type NPSAlertsResponse = NPSApiResponse<NPSAlert>;
export type NPSEventsResponse = NPSApiResponse<NPSEvent>;
