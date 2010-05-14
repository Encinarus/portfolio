#!/usr/bin/python

'''Parses dumps from the NYC restaurant inspection reports
'''

from BeautifulSoup import BeautifulSoup
import re
import sys
import json


def parsePage(file):
  text = open(file)
  soup = BeautifulSoup(text)
  violationMatcher = re.compile(
      "<b>(.*?)</b>" +
      "<br />(.*?)" + 
      "<br />(.*?)<br />" + 
      ".*?Violation points: <b>.*?([0-9]*)</b>")
  inspectionMatcher = re.compile("Inspection Date: <b> *(.*?)</b>")
  
  restaurantReport = {}  
  for report in soup.findAll(name="table", attrs={"class": "report"}):
    rows = report.findAll(name="tr")

    for row in rows:
      m = violationMatcher.search("%s" % row)
      if (m):
        restaurantReport["name"] = m.groups()[0]
        #Compress inner spaces of the address
        restaurantReport["address"] = re.sub(" +", " ", m.groups()[1])
        restaurantReport["phone"] = m.groups()[2]
        restaurantReport["points"] = m.groups()[3]
      
      m = inspectionMatcher.search("%s" % row)
      if (m):
        restaurantReport["inspection-date"] = m.groups()[0]
        
      if (re.search("Violations were cited", "%s" % row)):
        violationsTable = row.findAll(name="table")[0]
        restaurantReport["citations"] = []
        for violationRow in violationsTable.findAll(name="tr"):
          m = re.search('<td align="left">(.*?)</td>', "%s" % violationRow)
          if (m):
            restaurantReport["citations"].append(m.groups()[0])
            
  m = soup.findAll(name="a", attrs={"class": "inspectionHistory"})
  if (m):
    restaurantReport["history"] = m[0].attrs[0][1]

  return restaurantReport


if __name__ == '__main__':
  for arg in sys.argv[1:]:
    try: 
      report = parsePage(arg)
      if report:
        print json.dumps(parsePage(arg), sort_keys=True, indent=2), ","
      else:
        print >> sys.stderr, "%s came up empty" % arg
    except Exception as e:
      print >> sys.stderr, "%s threw %s" % (arg, e)
