import { createClient } from 'graphqurl';

export const Modes = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
}


/**
 * constructor() - Creates a new GraphQL client
 * *
 */
class MedscrapeClient {
  constructor(mode = 'production') {
    this.mode = mode;
    this.endpoint = '';
    if (this.mode === Modes.PRODUCTION) {
      // TODO: Set the final url for production
      this.endpoint = 'http://api-dev.medscrape.com/';
    } else if (this.mode === Modes.TEST) {
      this.endpoint = 'http://localhost:5002/';
    }

    this.client = createClient({ endpoint: this.endpoint });
  }

  async globalSearch({ query, limit, skip }) {
    const queryStr = `query GlobalSearch($query: String!, $limit: Int!, $skip: Int!) 
                            {
                                globalSearch(query: $query, limit: $limit, skip: $skip)
                                 {
                                    count
                                    data {
                                            npi_number
                                            first_name
                                            middle_name
                                            last_name
                                            credential
                                            state
                                            city
                                            specialty
                                            reasons_for_match
                                            }
                                       }
                                    }`
    const payload = {
      query: queryStr,
      variables: {
        query: query,
        limit: limit,
        skip: skip
      }
    }
    const response = await this.client.query(payload);
    return response;
  }


}

export default MedscrapeClient;