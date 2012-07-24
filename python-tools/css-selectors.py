# -*- coding: utf-8 -*-
# vim: ai ts=4 sts=4 et sw=4

import sys

if len(sys.argv) < 3:
    if len(sys.argv) < 2:
        print "No input files"
    else:
        print "2 files needed"
    exit()
files = sys.argv[1:]


f1 = open(files[0], 'r')
f2 = open(files[1], 'r')

file1 = list()
file2 = list()

for line in f1:
    file1.append(line)

for line in f2:
    file2.append(line)

if len(file1) > len(file2):
    longest = file1
    shortest = file2
else:
    longest = file2
    shortest = file1

for line in shortest:
    if line in longest:
        print line
