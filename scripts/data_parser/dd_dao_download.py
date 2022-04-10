# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""The Module crawls and downloads data from deepdao"""
# =============================================================================
import requests
import config
import logging
import pandas as pd
import time
import os

DD_ORGS_URL = config.DD_ORGS_URL
DD_ORGS_DETAILS_URL = config.DD_ORGS_DETAILS_URL
DD_ORGS_ASSETS_URL = config.DD_ORGS_ASSETS_URL
REQUEST_HEADER = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
}


class DDDAODownloader:

    def __init__(self, dao_name):
        self.orgs = []
        self.org_details = []
        self.org_assets = []
        self.df_dd_dao = None
        self.df_org_infos = None

    @staticmethod
    def get_orgs():
        """
        loads all the organization details
        """
        orgs_url = DD_ORGS_URL
        r = requests.get(orgs_url,headers=REQUEST_HEADER) 
        return r.json()

    @staticmethod
    def get_org_details(org_id):
        """
        loads all the organization details (general and socials)
        """
        orgs_url = DD_ORGS_DETAILS_URL.format(org_id)
        r = requests.get(orgs_url,headers=REQUEST_HEADER) 
        return r.json()  

    @staticmethod
    def get_org_assets(org_id):
        """
        loads all the organization assets (treasury address)
        """
        assets_url = DD_ORGS_ASSETS_URL.format(org_id)
        r = requests.get(assets_url,headers=REQUEST_HEADER) 
        return r.json() 

    @staticmethod
    def load_org_details_from_dd():
        """
        Iterates through every organization
        and fetches general such as name, description etc, 
                    social such as twitter, discord etc,
                    assets such as treasury
        from third party source
        """
        orgs = DDDAODownloader.get_orgs()
        df_dd_dao = pd.DataFrame(orgs['daosSummary'])
        org_details = {}
        org_assets = {}


        #Fetch DAO org details( general, socials) and assets (treasury) from third party sources
        for idx, row in df_dd_dao.iterrows():
            logging.info('processing organization {}'.format(idx))
            org_id = row['organizationId']

            #wait before calling
            if org_id not in org_details or org_id not in org_assets:
                time.sleep(2)

            if org_id not in org_details:
                org_details[org_id] = DDDAODownloader.get_org_details(org_id)

            if org_id not in org_assets:
                org_assets[org_id] = DDDAODownloader.get_org_assets(org_id)
        
        return df_dd_dao, org_details, org_assets

    @staticmethod
    def flatten_curate_data_from_dd(df_dd_dao, org_details, org_assets):
        """
        Flatten and combine the data points into one dataframe
        """
        org_infos = []

        for idx, row in df_dd_dao.iterrows():
            logging.info('processing organization {}'.format(idx))
            org_id = row['organizationId']

            org_info = {}

            #Extract general and social information from org_details
            for k,v in org_details[org_id]['data'].items():

                if k == 'rankings':
                    continue #not relevant at the moment
                
                if k == 'socials':
                    for s in v:
                        social_key = s['type'].strip().lower()
                        if social_key not in org_info:
                            org_info[social_key] = s['url'].split('/')[-1] if social_key == 'twitter' else s['url']
                    continue
                
                new_key = k.strip().lower()
                if new_key not in org_info:
                    org_info[new_key] = v

            #Extract treasury address and eth names from assets data
            treasury_address = []
            dd_eth_names = []
            for ast in org_assets[org_id]['data']:
                if ast['type'] == 'treasury':
                    treasury_address.append(ast['address'])

                if ast['description'] is not None:
                    if 'snapshot' in ast['description'].strip().lower():
                        if ast['address'] is not None:
                            dd_eth_names.append(ast['address'])

            org_info['treasury_address'] = ','.join(treasury_address)
            
            org_info['dd_eth_names'] = ','.join(dd_eth_names)

            org_infos.append(org_info)

        df_org_infos = pd.DataFrame(org_infos)
        return df_org_infos

    @staticmethod
    def load_data(data_path):
        """
        Reload the data if the file doesn't exist
        """
        if os.path.exists(data_path):
            logging.info("DD data extract available. skipping loading")
        else:
            logging.info("DD data extract unavailable. data needs to be extracted from dd. Expected time ~30 minutes ")
            df_dd_dao, org_details, org_assets = DDDAODownloader.load_org_details_from_dd()
            df_org_infos = DDDAODownloader.flatten_curate_data_from_dd(df_dd_dao, org_details, org_assets)
            df_org_infos.to_csv(data_path)

            
    

        



