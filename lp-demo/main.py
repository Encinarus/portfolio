#!/usr/bin/env python

import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from Cheetah.Template import Template

def serverPath(filename):
  return os.path.join(os.path.dirname(__file__), filename)

def loadTemplate(templatePath, searchList=[]):
  path = serverPath(templatePath)
  return Template(file=path, searchList = searchList)
  
def mergeParams(default, overrides):
  merged = dict(default)
  merged.update(overrides)
  return merged


class PortfolioHandler(webapp.RequestHandler):
  def __init__(self):
    self.demos = {
        '/life': loadTemplate('templates/conways_life.html'),
        '/dial': loadTemplate('templates/dial_creator.html'),
        '/': loadTemplate('templates/project_list.html'),
    }

  def getDemoContent(self, demoName):
    if not len(demoName) or demoName not in self.demos:
      demoName = '/'

    return self.demos[demoName]

  def get(self):
    demo = self.getDemoContent(self.request.path)
    commonArgs = {
      'page_title': 'Demos @ Light Pegasus',
      'analytics': loadTemplate('templates/analytics.html'),
    }
    site_header = loadTemplate(
        'templates/site_header.html', 
        searchList = commonArgs)

    template_values = mergeParams(commonArgs, { 
      'site_header': site_header,
      'css_includes': loadTemplate('templates/css_includes.html'),
      'top_nav': loadTemplate('templates/top_nav.html'),
      'page_content': demo,
      'common_js': loadTemplate('templates/common_javascript.html'),
    })
    tmpl = loadTemplate('templates/portfolio.html', 
                        searchList = (template_values,))
    self.response.out.write(tmpl)


def main():
  application = webapp.WSGIApplication([('.*', PortfolioHandler)],
                                       debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
