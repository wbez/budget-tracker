#!/usr/bin/env python

"""
Functions specific to the Grading Rahm app.
"""

import copytext
import app_config
from render_utils import flatten_app_config, JavascriptIncluder, CSSIncluder
from collections import OrderedDict
from datetime import datetime, date, timedelta

def make_context(asset_depth=0):
    """
    Create a base-context for rendering views.
    Includes app_config and JS/CSS includers.
    `asset_depth` indicates how far into the url hierarchy
    the assets are hosted. If 0, then they are at the root.
    If 1 then at /foo/, etc.
    """
    context = flatten_app_config()
    context['ITEMS'] = []
    context['TOPICS'] = []
    dates = []
    copy = copytext.Copy(app_config.COPY_PATH)

    items = copy['tracker']

    for item in items:
		date_obj = datetime.strptime(item['date'],'%m/%d/%Y')
		dates.append(date_obj)
    dates.sort()
    dates.pop(0)

    start = min(dates)
    end = max(dates)
    days_count = (end-start).days

    for i, item in enumerate(items):

    	tags = item['tags'].split(',')
    	tags = [x.strip() for x in tags]
    	topics = item['topic'].split(',')
    	topics = [x.strip() for x in topics] 
    	tags_slug = [x.lower().replace(' ','') for x in tags] 
    	topics_slug = [x.lower().replace(' ','') for x in topics]

    	for topic in topics:
    		if topic != '':
	    		topic_dict = {'topic':topic,'slug':topic.lower().replace(' ','')}
	    		if topic_dict not in context['TOPICS']:
	    			context['TOPICS'].append(topic_dict)


		date_obj = datetime.strptime(item['date'],'%m/%d/%Y')

        item_context = {}
        item_context['date'] = item['date']
        item_context['date_obj'] = date_obj
        
        if i == 0:
        	timeline_value = 100*( (date_obj-start).days/float(days_count) )
        else:
	        if item['date'] == items[i-1]['date']:
	        	timeline_value = context['ITEMS'][-1]['timeline_value'] + 1
	        #	context['ITEMS'][-1]['timeline_value'] = context['ITEMS'][-1]['timeline_value'] - 1
	        else:
	        	timeline_value = 100*( (date_obj-start).days/float(days_count) )
	    	

        item_context['timeline_value'] = timeline_value
        item_context['topics'] = topics
        item_context['topics_slug'] = topics_slug
        item_context['text'] = item['text']
        item_context['status'] = item['status']
        item_context['tags'] = tags
        item_context['tags_slug'] = tags_slug
        item_context['template'] = item['template']
        item_context['annotation'] = item['annotation']
        item_context['audio'] = item['audio']
        item_context['link'] = item['link']
        item_context['photo'] = item['photo']
        item_context['quote_name'] = item['quote_name']

        context['ITEMS'].append(item_context)

    context['TIME'] = {'oldest':min(dates),'newest':max(dates)}
    context['COPY'] = copytext.Copy(app_config.COPY_PATH)
    context['JS'] = JavascriptIncluder(asset_depth=asset_depth)
    context['CSS'] = CSSIncluder(asset_depth=asset_depth)



    return context