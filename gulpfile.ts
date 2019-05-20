/* TypeScript: parse all .CSV files in a folder into Message Stream,
then compose them right back into CSV files again and save with
changed names */

let gulp = require('gulp')
import { src, dest } from 'gulp'
import * as rename from 'gulp-rename'
import { tapCsv } from 'gulp-etl-tap-csv'
import { targetCsv } from 'gulp-etl-target-csv'
import { handlelines } from 'gulp-etl-handlelines'

const handleLine = (lineObj: any): object => {
    lineObj.record["year"] = 2019
    return lineObj
}

export function processCsv() {
    return src(['data/*.csv', '!data/*-parsed.csv'])
    .on('data', function (file:any) {
        console.log('Starting processing on ' + file.basename)
    })  
    .pipe(tapCsv({ columns:true }))
    .pipe(handlelines({propsToAdd: {["year"]:2019}},{transformCallback: handleLine}))
    .pipe(rename({ extname: ".ndjson" })) // rename to *.ndjson
    .on('data', function (file:any) {
        console.log('Done parsing ' + file.basename)
    })  
    //.pipe(targetCsv({header:true}))
    .pipe(rename({suffix:"-parsed", extname: ".csv" })) // rename to *.ndjson
    .on('data', function (file:any) {
        console.log('Done processing on ' + file.basename)
    })  
    .pipe(gulp.dest('data/'));
}