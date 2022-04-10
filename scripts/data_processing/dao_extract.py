# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""
The Module collects DAO data from various sources (snapshot, deepdao, covalent )
"""
# =============================================================================
import logging
import sys
import pandas as pd
import traceback
from snapshot_dao import SnapshotDAOLoader
from dd_dao import DDDAOLoader
from dd_dao_download import DDDAODownloader
from covalent_dao import CovalentDAOLoader
from social_dao import SocialDAOLoader
from ml_util import get_hotwords
import os
import config


def format_curated_data(data_path):
    """
    read the manually curated data and fetch additional details
    """
    df_curated_data = pd.read_csv(data_path)

    dao_data_agg = []
    for idx, row in df_curated_data[df_curated_data.data_clean_status=='Y'].iterrows():
        logging.info("processing  {}".format(row["eth_name"]))
        try:
            dao_data = {}
            dao_data['id'] = idx
            dao_data['logo'] = row['logo']
            dao_data['name'] = row['name']
            dao_data['mission'] = row['mission']
            dao_data['about'] = row['about']
            dao_data['network'] = "Ethereum Mainnet"
            dao_data['categories'] = row['categories']
            dao_data['website_url'] = row['website']
            dao_data['discord_url'] = row['discord']
            dao_data['twitter_handle'] = row['twitter']
            dao_data['symbol'] = row['symbol']
            dao_data['contract_address'] = row['contract_address'].strip().lower()

            social_dao_loader = SocialDAOLoader(row['eth_name'], 
                        row['discord'], 
                        row['twitter']
                    )
            social_dao_info = social_dao_loader.get_dao_info()
            dao_data['discord_users_count'] = social_dao_info['discord_member_count']
            dao_data['twitter_followers_count'] = social_dao_info['twitter_followers_count']
            dao_data['tags'] = get_hotwords(social_dao_info['twitter_profile_description'])

            covalent_dao_loader = CovalentDAOLoader(row['eth_name'], 
                row['network'], 
                row['symbol'],
                row['treasury_address'].split(','),
                dao_data['contract_address']
            )
            
            covalent_data_info = covalent_dao_loader.get_dao_info('all') 
            dao_data['contract_address'] = covalent_data_info['contract_address']

            dao_data['treasury_size'] = covalent_data_info['treasury_size']
            dao_data['num_proposals'] = row['ss_proposals_count'] 
            dao_data['token_price_usd'] = covalent_data_info['token_price']
            dao_data['market_cap_usd'] = covalent_data_info['market_cap']
            dao_data['num_token_holders'] = covalent_data_info['num_voters']

            dao_data['establishment_date'] = ''

            dao_data_agg.append(dao_data)

        except Exception as e:
            logging.error(traceback.format_exc())
            print('failed for', row['eth_name'])
            pass #Ignore failed ones and move on

    df_dao_data_agg = pd.DataFrame(dao_data_agg)
    return df_dao_data_agg

def collect_snapshot_orgs_data():
    """
    collects all the DAO orgs from snapshot
    Fetch treasurt from DD
    Fetch token, marketcap, treasury balances from Covalent
    Fetch followers count from twitter & discord api
    """

    snapshot_orgs = SnapshotDAOLoader.get_daos()

    #Extract data from snapshot (sorted by followers count)
    DDDAODownloader.load_data(config.ORG_INFOS_FILE)

    dao_data_agg = []

    n_orgs = len(snapshot_orgs)

    for idx, org in zip(range(n_orgs),snapshot_orgs):

        if len(dao_data_agg) == config.MAX_ORG_PARSE_LIMIT:
            logging.info('orgs limit reached as defined in config')
            break

        logging.info('processing org: {}, {}/{}, successfully_parsed:{}/{}'.format(org['name'],str(idx+1),str(n_orgs),str(len(dao_data_agg)+1),str(config.MAX_ORG_PARSE_LIMIT)))

        # Retrieve basic DAO info from snapshot
        snapshot_loader = SnapshotDAOLoader(org['eth_name'])
        snapshot_dao_info = snapshot_loader.get_dao_info()
        dao_data = {}
        dao_data['eth_name'] = org['eth_name']
        dao_data['name'] = snapshot_dao_info['name']
        dao_data['about'] = snapshot_dao_info['about']
        dao_data['categories'] = snapshot_dao_info['categories']
        dao_data['network'] = snapshot_dao_info['network']
        dao_data['logo'] = snapshot_dao_info['avatar']
        dao_data['website'] = snapshot_dao_info['website']
        dao_data['twitter'] = snapshot_dao_info['twitter']
        dao_data['symbol'] = snapshot_dao_info['symbol']
        dao_data['ss_followers_count'] = snapshot_dao_info['followersCount']
        dao_data['ss_proposals_count'] = snapshot_dao_info['proposalsCount']

        #Covalent APIs do have limitations on the networks supported.
        #Need to review and filter only those
        if dao_data['network'] != '1':
            logging.info('skipped : network not supported : {} '.format(dao_data['network']))
            continue

        #Retrieve data from DD : primarily treasury address
        dd_dao_loader = DDDAOLoader(org['eth_name'], dao_data['name'], config.ORG_INFOS_FILE)
        dd_dao_info = dd_dao_loader.get_dao_info()

        if dd_dao_info is None:
            continue

        #Ignore if treasury details are not available
        dao_data['treasury_address'] = dd_dao_info['treasury_address']
        if dao_data['treasury_address'] is None or dao_data['treasury_address'] == '':
            logging.info('skipped : treasury not found')
            continue

        dao_data['description'] = dd_dao_info['description']

        #Reload social from DD if snapshot data is empty
        if dao_data['website'] is None or dao_data['website'] == '':
            dao_data['website'] = dd_dao_info['website']

        if dao_data['twitter'] is None or dao_data['twitter'] == '':
            dao_data['twitter'] = dd_dao_info['twitter']

        dao_data['discord'] = dd_dao_info['discord']
        

        #Check if Twitter and Discord Links are valid
        social_dao_loader = SocialDAOLoader(org['eth_name'], 
            dao_data['discord'], 
            dao_data['twitter']
        )
        social_dao_info = social_dao_loader.get_dao_info()
        dao_data['discord_valid'] = 'Y' if social_dao_info['discord_member_count'] is not None else 'N'
        dao_data['twitter_valid'] = 'Y' if social_dao_info['twitter_followers_count'] is not None else 'N'
        
        #Extract Contract Address from Covalent
        covalent_dao_loader = CovalentDAOLoader(dao_data['eth_name'], 
            dao_data['network'], 
            dao_data['symbol'],
            treasury_wallets = dao_data['treasury_address'].split(',')
            )
        
        covalent_data_info = covalent_dao_loader.get_dao_info('basic') #retrieve only contract address
        dao_data['contract_address'] = covalent_data_info['contract_address']

        dao_data_agg.append(dao_data)
     
    df_dao_data_agg = pd.DataFrame(dao_data_agg)
    return df_dao_data_agg
     