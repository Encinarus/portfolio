#!/usr/bin/python

'''Parses dumps from the NYC restaurant inspection reports
'''

import os

def list_files(directory):
  for (root, dirs, files) in os.walk(directory):
    for f in files:
      file_path = os.path.join(root, f)
      if 'detail.do' in file_path:
        print file_path
      print os.path.join(root, f)
    

if __name__ == '__main__':
  list_files('.')