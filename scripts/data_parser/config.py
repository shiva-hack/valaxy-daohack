SNAPSHOT_DAO_LIST_URL = 'https://hub.snapshot.org/api/explore'
SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql?'

#If this file is not available, the program will automatically generate it but it will take ~30 minutes to load
ORG_INFOS_FILE = 'data/dd_org_infos.csv' 
DD_ORGS_URL = "https://golden-gate-server.deepdao.io/dashboard/ksdf3ksa-937slj3"
DD_ORGS_DETAILS_URL = "https://golden-gate-server.deepdao.io/organization/ksdf3ksa-937slj3/{}"
DD_ORGS_ASSETS_URL = "https://golden-gate-server.deepdao.io/organization/ksdf3ksa-937slj3/{}/assets"

COVALENT_BALANCES_API_URL = "https://api.covalenthq.com/v1/{}/address/{}/balances_v2/?key={}"
COVALENT_PRICING_API_URL = "https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/{}/?&key={}"
COVALENT_TOKEN_HOLDERS_API_URL = "https://api.covalenthq.com/v1/1/tokens/{}/token_holders/?page-size=200000&key={}"
COVALENT_API_KEY = ""

DISCORD_API_URL = "https://discord.com/api/v9/invites/{}?with_counts=true&with_expiration=true"
TWITTER_API_URL = "https://api.twitter.com/1.1/users/show.json?screen_name={}"

TWITTER_BEARER_TOKEN = ""
MAX_ORG_PARSE_LIMIT = 50