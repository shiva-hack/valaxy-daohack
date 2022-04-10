# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""The Module retrieves 
    - twitter bio
    - twitter followers count
    - discord followers count
"""
# =============================================================================

import requests
import config

DISCORD_API_URL = config.DISCORD_API_URL
TWITTER_API_URL = config.TWITTER_API_URL

class SocialDAOLoader:

    def __init__(self, dao_name, discord_url, twitter_handle):
        self.dao_name = dao_name
        self.dao_info = {}
        self.dao_info['discord_url'] = discord_url
        self.dao_info['twitter_handle'] = twitter_handle

    def get_dao_info(self):
        self.fetch_discord_member_count()
        self.fetch_twitter_stats()
        return self.dao_info

    def fetch_discord_member_count(self):
        try:
            invite_id = self.dao_info['discord_url'].split('/')[-1]
            discord_count_ui_url = DISCORD_API_URL.format(invite_id)
            response = requests.get(discord_count_ui_url)
            self.dao_info['discord_member_count'] = response.json()['approximate_member_count']
        except Exception as e:
            self.dao_info['discord_member_count'] = None

    def fetch_twitter_stats(self):
        try:
            twitter_handle = self.dao_info['twitter_handle']
            url = TWITTER_API_URL.format(twitter_handle)
            headers = {"Authorization": "Bearer {}".format(config.TWITTER_BEARER_TOKEN)}
            response = requests.request("GET", url, headers = headers)
            self.dao_info['twitter_profile_description'] = response.json()['description']
            self.dao_info['twitter_followers_count'] = response.json()['followers_count']
        except:
            self.dao_info['twitter_profile_description'] = None
            self.dao_info['twitter_followers_count'] = None
        