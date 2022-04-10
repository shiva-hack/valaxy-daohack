# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""
The Module fetches the below information from covalent APIs
    - treasury balances
    - token price
    - total supply
    - market cap
    - num token holders
    - contract address (if not provided)
"""
# =============================================================================

import requests
import config

COVALENT_API_KEY = config.COVALENT_API_KEY
COVALENT_BALANCES_API_URL = config.COVALENT_BALANCES_API_URL
COVALENT_PRICING_API_URL = config.COVALENT_PRICING_API_URL
COVALENT_TOKEN_HOLDERS_API_URL = config.COVALENT_TOKEN_HOLDERS_API_URL

class CovalentDAOLoader:

    def __init__(self, dao_name, network, ticker_symbol, treasury_wallets, contract_address=''):
        self.dao_name = dao_name
        self.dao_info = {}
        self.dao_info['network'] = network
        self.dao_info['ticker_symbol'] = ticker_symbol
        self.dao_info['treasury_wallets'] = treasury_wallets
        if contract_address != '':
            self.dao_info['contract_address'] = contract_address


    def get_dao_info(self, info_level = 'all'):
        """
        fetch dao info from covalent apis
        """
        if info_level == 'basic':
            self.fetch_treasury_balances()
            self.fetch_contract_address()
        else:
            self.fetch_treasury_balances()
            self.compute_treasury_size()
            self.fetch_token_price()
            self.fetch_token_stats()

        return self.dao_info

    def get_token_balances(self, network, address):
        """
        fetch token balances
        """
        url = COVALENT_BALANCES_API_URL.format(network, address, COVALENT_API_KEY)
        response = requests.get(url)
        return response.json()['data']['items']

    def fetch_treasury_balances(self):
        """
        get token balances for each of the treasury wallet
        """
        treasury_list = []
        for treasury_wallet in self.dao_info['treasury_wallets']:
            treasury_list.append(self.get_token_balances(self.dao_info['network'], treasury_wallet))
        self.dao_info['treasury_list'] = treasury_list

    def compute_treasury_size(self):
        """
        for each wallet, for each token, add up the balances to get the total treasury balance
        """
        treasury_size = 0
        for treasury in self.dao_info['treasury_list']:
            for token in treasury:
                if token['quote_rate'] is not None:
                    if token['quote_rate'] <= 80000: #some tokens are with insane quote_rates eg mini wth.
                        treasury_size = treasury_size + token['quote']
        self.dao_info['treasury_size'] = treasury_size


    def fetch_contract_address(self):
        """
        map the contract symbol with the token symbol to extract the contract address
        """
        self.dao_info['contract_address'] = None
        for treasury in self.dao_info['treasury_list']:
            for token in treasury:
                if token['contract_ticker_symbol']==self.dao_info['ticker_symbol']:
                    self.dao_info['contract_address'] = token['contract_address']
                       

    def fetch_token_price(self):
        """
        retrieve the token price of the DAO token
        """
        contract_address = self.dao_info['contract_address']
        url = COVALENT_PRICING_API_URL.format(contract_address, COVALENT_API_KEY)
        response = requests.get(url)
        self.dao_info['token_price'] = response.json()['data'][0]['prices'][0]['price']
        
     
    def fetch_token_stats(self):
        """
        fetch token status
            - token holders
            - total supply
        """
        contract_address = self.dao_info['contract_address']
        url = COVALENT_TOKEN_HOLDERS_API_URL.format(contract_address, COVALENT_API_KEY)
        response = requests.get(url)
        self.dao_info['num_voters'] = response.json()['data']['pagination']['total_count']
        total_supply = int(response.json()['data']['items'][0]['total_supply'])
        contract_decimals = int(response.json()['data']['items'][0]['contract_decimals'])
        self.dao_info['total_supply'] = total_supply / (10 ** contract_decimals)
        self.dao_info['market_cap'] = self.dao_info['total_supply'] * self.dao_info['token_price']
