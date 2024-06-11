#!/bin/bash

for f in ./outputs/*.json; do
    echo "Code,Number,Title,Credit Hours,Description,Lecture Hours,Lab Hours,Grade Mode,Repeat Status,Pre-requisites,Schedule Type" > "${f%.*}".csv
    # Getting rid of the array markers
    sed 's-\["--g' $f | sed 's-\"]--g' | sed 's-","-\n-g' | \
    # This captures
    # 1. The course code:
    sed 's-^\([A-Z]*\) -\1,-g' | \
    # 2. The course number:
    sed 's/,\([0-9]*\) - /,\1,/g' | \
    # 3. The number of credit hours (only one of the two following rule will apply):
    sed 's- (\([0-9]\) Credit Hours) *-,\1,"-g' | \
    sed 's/(\([0-9]*\) Credit Hour TO \([0-9]*\) Credit Hours)/,\1-\2,"/g' | \
    # 4. The description is "what's left between 3. and 5.".
    # Note that those two introduce the " signs to escape possible commas in the description.
    # 5. The lecture hours. If "Grade Mode" is right after Lecture Hours, we add ",," to leave the Lab hours empty
    # Note that only one of the following will be applied.
    sed 's/Lecture Hours: \([0-9]\) *Grade Mode/",\1,,Grade Mode/g' | \
    sed 's/Lecture Hours: \([0-9]\) TO \([0-9]\) *Grade Mode/",\1-\2,,Grade Mode/g' | \
    sed 's/Lecture Hours: \([0-9]\) TO \([0-9]\) */",\1-\2,/g' | \
    sed 's/Lecture Hours: \([0-9]\) */",\1,/g' | \
    # 6. The lab hours
    sed 's/Lab Hours: \([0-9]\) */\1,/g' | \
    # 7. The Grade mode
    sed 's/Grade Mode: Normal, Audit, In Progress/Normal Audit In Progress,/g' | \
    sed 's/Grade Mode: Normal\, Audit/Normal Audit,/g' | \
    # 8. The repeat status:
    sed 's-Prerequisites: \(.*\)Repeat Status: -,\1,-g' | \
    # 9. The schedule type (escaped because it can contain commas):
    sed 's- *Schedule Type:\(.*\)-,"\1",-g' >> "${f%.*}".csv
done 
