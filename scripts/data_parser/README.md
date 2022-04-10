
## Overview

This module extracts the DAO data from various sources (snapshot, deepdao, covalent) and generates a CSV

### Prerequisites

1. Get a free API Key at [https://www.covalenthq.com/docs/api](https://www.covalenthq.com/docs/api)
2. Get a free API Key at [https://developer.twitter.com/en/docs/twitter-api](https://developer.twitter.com/en/docs/twitter-api)
3. Enter your API keys in `./config.py`

### Workflow

1. Collect basic DAO information by triggering


   ```python
   python main.py --mode collect --outfile dao_list.csv
   ```
2. Review the dao_list to update
    -  Mission and About
    -  Review and edit categories
    -  Fill in missing discord links
    -  Review contract symbol
    -  Fill in missing contract address



3. Once curated, rerun the script in expand mode to collect further information


    ```python
   python main.py --mode expand --infile dao_list.csv --outfile dao_list_updated.csv
   ```