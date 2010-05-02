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

class MainHandler(webapp.RequestHandler):
  def get(self):
    path = serverPath('templates/index.html')
    
    site_header = loadTemplate('templates/site_header.html')
    template_values = { 
      'page_title': 'Light Pegasus',
      'site_header': site_header,
      'css_includes': loadTemplate('templates/css_includes.html'),
    }
    tmpl = loadTemplate('templates/index.html', 
                        searchList = (template_values,))
    self.response.out.write(tmpl)


class PortfolioHandler(webapp.RequestHandler):
  def getPageName(self):
    uri = self.request.uri
    uri = uri[uri.find('/portfolio'):]
    return uri.replace('/portfolio', '')

  def getDemoContent(self, demoName):
    if demoName == '/':
      return "Hello World"
    elif demoName == '/dial':
      return  loadTemplate('templates/dial_creator.html')
    elif demoName == '/life':
      return loadTemplate('templates/conways_life.html')
    else:
      return "Whoops, demo %s not found!" % (demoName)

  def get(self):
    commonArgs = {
      'project_name': 'Dial Creator',
      'page_title': 'Demos @ Light Pegasus',
    }
    site_header = loadTemplate(
        'templates/site_header.html', 
        searchList = commonArgs)
    content = self.getDemoContent(self.getPageName())
    template_values = mergeParams(commonArgs, { 
      'site_header': site_header,
      'css_includes': loadTemplate('templates/css_includes.html'),
      'top_nav': loadTemplate('templates/top_nav.html'),
      'page_content': content,
      'common_js': loadTemplate('templates/common_javascript.html'),
    })
    tmpl = loadTemplate('templates/portfolio.html', 
                        searchList = (template_values,))
    self.response.out.write(tmpl)


def main():
  application = webapp.WSGIApplication([('/portfolio/.*', PortfolioHandler),
                                        ('/', MainHandler)],
                                         debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
