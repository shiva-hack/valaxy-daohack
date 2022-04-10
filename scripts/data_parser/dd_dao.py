# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""The Module retrieves the deepdao downloaded data"""
# =============================================================================
import requests
import config
import logging
import pandas as pd
import time
import os

REQUEST_HEADER = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
}

class DDDAOLoader:

    def __init__(self, dao_eth_name, dao_name, data_path):
        """
        Initialize DAO and load the data
        """
        self.dao_name = dao_name
        self.dao_eth_name = dao_eth_name
        self.dao_details = {}
        self.dao_assets = {}

        self.df_org_infos = pd.read_csv(data_path)
        self.df_org_infos.fillna('', inplace=True)
        self.df_org_infos['dao_eth_name']= '' #dynamically mapped 

    def get_dao_info(self):
        """
        Mapping between snapshot & DD is done based on
            if dao_eth_name matches
            if dao_name matches
        """
        #check if the snapshot eth name is already mapped
        match = (self.df_org_infos['dao_eth_name'] == self.dao_eth_name)
        if self.df_org_infos[match].shape[0] == 1:
            return self.df_org_infos[match].iloc[0].to_dict()

        #If not , map using dd_eth_names fetched from dd
        for idx, row in self.df_org_infos.iterrows():
            for eth_name in row['dd_eth_names'].split(','):
                if self.dao_eth_name==eth_name:
                    self.df_org_infos.loc[idx, 'dao_eth_name'] = self.dao_eth_name
                    return self.df_org_infos.loc[idx,:].to_dict()

        for idx, row in self.df_org_infos.iterrows():
                if self.dao_name.lower()==row['name'].lower():
                    self.df_org_infos.loc[idx, 'dao_eth_name'] = self.dao_eth_name
                    return self.df_org_infos.loc[idx,:].to_dict()
        
        return None


