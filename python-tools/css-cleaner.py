# -*- coding: utf-8 -*-
# vim: ai ts=4 sts=4 et sw=4

import os, re
from optparse import OptionParser

parser = OptionParser()
parser.add_option('-s', '--selectors-file', dest='selectors_file', help='File with selectors to clear', metavar='FILE')
parser.add_option('-c', '--css-file', dest='css_file', help='CSS file to clean', metavar='FILE')
parser.add_option('-o', '--output-file', dest='output_file', help='Output CSS file', metavar='FILE')

(options, args) = parser.parse_args()

selectors = open(options.selectors_file, 'r')
css = open(options.css_file, 'r').read()
output = open(options.output_file, 'w')

selectorCount = 0
findCount = 0

def prepare(string):
    return string.strip().replace(' + ', '+').replace('+', '\s*\+\s*').replace(' ', '\s*').replace('.', '\.').replace('~', '\~')

for selector in selectors:
    searchRE = re.compile('^\s*%s\s*\{[^\}]*\}' % prepare(selector), re.MULTILINE|re.IGNORECASE|re.DOTALL)
    selectorCount += 1
    searched = searchRE.findall(css)
    if searched:
        #css = re.sub(searchRE, '', css)
        for i in searched:
            css = css.replace(i, '')
            findCount += 1

output.write(css)
print "Selectors to replace: " + str(selectorCount)
print "Selectors replaced: " + str(findCount)
