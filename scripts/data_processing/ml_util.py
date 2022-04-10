# =============================================================================
# Created By  : Kikura
# Created Date: Sat April 9th 
# =============================================================================
"""The Module applies NLP to extract entities from tweets"""
# =============================================================================

import en_core_web_sm
nlp = en_core_web_sm.load()

from collections import Counter
from string import punctuation

def get_hotwords(text):
    """
    identify keywords from the text
    """
    result = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN'] 
    doc = nlp(text.lower())
    for token in doc:
        if(token.text in nlp.Defaults.stop_words or token.text in punctuation):
            continue
        if(token.pos_ in pos_tag):
            if 'http' in token.text:
                continue
            if len(token.text)<=3:
                continue
            
            result.append(token.text)
                
    return set(result)

