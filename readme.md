# A "Modern Campus" Catalog Scrapper for Augusta University

Augusta University uses the [modern campus product](https://moderncampus.com/) for [their catalog](https://catalog.augusta.edu/).
In addition to being hard to navigate, this platform is poorly accessible, since the courses' description, pre-requisites, etc., are accessible only after clicking on some elements (triggering some javascript function).

This repository hosts two simple programs (one using the Node.js library [Puppeteer](https://pptr.dev/), and the other a bash script using mainly sed) to scrape the data for a particular diploma and present the data as a `csv` file.

# Getting Started

Normally, the following steps are enough:

1. Find the `poid` of your program. For example, the _Bachelor of Science with a major in Computer Science_ is at `https://catalog.augusta.edu/preview_program.php?catoid=44&poid=10211&hl=computer&returnto=search`, which means that the `poid` I am looking for is `10211`.
2. Open `index.js`, and replace `getProgram(10211);` with `getProgram(xxxxx);` where `xxxxx` is the `poid` you obtained during step 1.
3. Run the following commands:
    ```
    npm init -y 
    npm install puppeteer
    node index.js
    chmod +x format_catalog_json.sh
    ./format_catalog_json.sh
    ```
4. Open the `xxxx.csv` file (possibly with [libreoffice](https://www.libreoffice.org/)).
