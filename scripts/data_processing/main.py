# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""
The Module combines DAO data from various sources (snapshot, deepdao, covalent )
and transforms it to csv format
"""
# =============================================================================

import logging
import sys
from argparse import ArgumentParser
from dao_extract import format_curated_data, collect_snapshot_orgs_data

def init_logger():
    """
    Initiate the logger to write to command line
    """
    rootLogger = logging.getLogger()
    rootLogger.setLevel(logging.INFO)
    logFormatter = logging.Formatter("%(asctime)s %(message)s")
    consoleHandler = logging.StreamHandler(sys.stdout)
    consoleHandler.setFormatter(logFormatter)
    rootLogger.addHandler(consoleHandler)

if __name__ == "__main__":

    init_logger()

    parser = ArgumentParser()
    parser.add_argument("-m", "--mode", dest="mode",
                        help="two modes supported a.collect b.expand")
    parser.add_argument("-o", "--outfile", dest="out_file",
                        help="output_file_location")
    parser.add_argument("-i", "--infile", dest="in_file",
                    help="input_file_location", default='')

    args = parser.parse_args()
    mode = args.mode
    out_file = args.out_file
    in_file = args.in_file

    if args.mode not in ['collect','expand']:
        logging.info('Please choose valid options')
        sys.exit(1)

    if args.mode == 'expand' and args.in_file=='':
        logging.info('Please provide input file')
        sys.exit(1)

    #Workflow#1 : Collects the basic DAO information and write to a csv for manual curation
    if args.mode == 'collect':
        df_dao_list = collect_snapshot_orgs_data()
        df_dao_list.to_csv(args.out_file)

    #Workflow#2 : Once the manual curation is done, this workflow computes additional data points (eg discord followers count etc)
    if args.mode == 'expand':
        df_dao_final = format_curated_data(args.in_file)
        df_dao_final.to_csv(args.out_file)
