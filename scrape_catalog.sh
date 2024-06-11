#!/bin/bash

## declare an array variable
declare -a arr=(
    # Insert your poid here and delete the following.
    "10215" # Minor in Computer Science
    "10674" # Bachelor of Science in Biomedical Systems Engineering
    "10211" # Bachelor of Science with a major in Computer Science
    "10361" # Bachelor of Science with a major in Cyber Operations
    "10337" # Bachelor of Science with a major in Cybersecurity
    "10394" # Bachelor of Science with a major in Cybersecurity Engineering
    "10369" # Bachelor of Science in Information Technology
    "10370" # Bachelor of Science in Information Technology with a concentration in Business
    "10349" # Certificate of Less than One Year in Cyber Defender
    "10350" # One-Year Certificate in Advanced Cyber Defender
    "10351" # Post-Baccalaureate Certificate in Healthcare Information Security
    "10480" # Doctor of Philosophy with a Major in Computer and Cyber Sciences
    "10459" # Master of Science with a Major in Computer Science
    "10301" # Master of Science with a Major in Information Security Management 
    )

mkdir -p outputs

## now loop through the above array
for i in "${arr[@]}"
    do
        node index.js "$i"
        wait
    done

./convert_to_csv.sh
