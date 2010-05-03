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
    if demoName == '/' or not len(demoName):
      return (None, "Hello World")
    elif demoName == '/dial':
      return ("Dial Creator", loadTemplate('templates/dial_creator.html'))
    elif demoName == '/life':
      conway = loadTemplate('templates/conways_life.html', {
        'conway_js': 'hello',
      })
      return ("Conway's Game of Life", conway)
    else:
      return (None, "Whoops, demo %s not found!" % (demoName))

  def get(self):
    (name, content) = self.getDemoContent(self.getPageName())
    commonArgs = {
      'project_name': name,
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
      'page_content': content,
      'common_js': loadTemplate('templates/common_javascript.html'),
    })
    tmpl = loadTemplate('templates/portfolio.html', 
                        searchList = (template_values,))
    self.response.out.write(tmpl)


class NotFoundHandler(webapp.RequestHandler):
  def get(self):
    self.response.set_status(404)
    self.response.out.write("<html><body>Sorry, couldn't find what you were looking for</body></html>")


def main():
  application = webapp.WSGIApplication([('/portfolio.*', PortfolioHandler),
                                        ('/', MainHandler),
                                        ('.*', NotFoundHandler)],
                                       debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
