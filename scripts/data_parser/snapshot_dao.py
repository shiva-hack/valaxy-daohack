# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""The Module retrieves the top DAOs from snapshot"""
# =============================================================================


import requests
import pandas as pd
import sys
import logging
import traceback
import config


SNAPSHOT_DAO_LIST_URL = config.SNAPSHOT_DAO_LIST_URL

class SnapshotDAOLoader:

    def __init__(self, dao_name=None):
        self.dao_name = dao_name
        self.dao_info = {}
        pass

    @staticmethod
    def get_daos():
        """
        returns the list of DAOs available in Snapshot
        """
        try:
            url = SNAPSHOT_DAO_LIST_URL
            resp = requests.get(url)
            dao_spaces = resp.json()['spaces']

            #Insights #1
            logging.info ('total num of daos found: {}'.format(len([dao for dao in dao_spaces])))

            #Insights #2
            category_list = []
            for dao_name in dao_spaces:
                category_list = category_list + dao_spaces[dao_name].get('categories',[])
            logging.info('categories found: {}'.format(','.join(set(category_list))))

            # Transforms data to <dao_category, dao_eth_name, dao_name, dao_followers_count> format
            # If DAO has more than one category, it will have multiple entries in the data frame one for each category
            dao_list = []
            for k,v in dao_spaces.items():
                categories = v.get('categories',['NA']) 
                categories = categories if len(categories) > 0 else ['NA']
                dao_list = dao_list + [(c, k, v['name'], v.get('followers',0)) for c in categories]

            df_dao_list = pd.DataFrame(dao_list)
            df_dao_list.columns = ['category','eth_name','name','followers_count']
            return df_dao_list.sort_values('followers_count', ascending=False).to_dict('records')
            
        except Exception as e:
            logging.error(traceback.format_exc())


    def get_dao_info(self):
        """
        Fetches key data points from snapshot for the given DAO
        """
        try:
            query = """
            query Spaces {
            spaces (
                where:{
                id:"eth_name"
                }
            )
            {
                id
                name
                about
                categories
                network
                avatar
                website
                twitter
                symbol
                followersCount
                proposalsCount
            }
            }
            """
            query = query.replace("eth_name",self.dao_name)

            url = config.SNAPSHOT_GRAPHQL_URL
            resp = requests.post(url, json={'query': query})
            self.dao_info = resp.json()['data']['spaces'][0] #get the first result
            return self.dao_info
        except Exception as e:
            logging.error(traceback.format_exc())


