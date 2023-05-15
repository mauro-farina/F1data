const PDFExtract = require('pdf.js-extract').PDFExtract;
const fs = require('fs');

const DOCS_FOLDER = 'scraped-data/f1docs/';
const CSV_OUTPUT_FOLDER = 'scraped-data/f1csvs/';
const START_FROM_YEAR = 2021;
const UP_TO_YEAR = 2023;

async function write_to_csvfile(filename, csv_data) {
    fs.writeFile(CSV_OUTPUT_FOLDER.concat(filename,'.csv'), csv_data, { flag:'a' }, function(err) {
        if(err) {
            console.log(err);
            return false;
        }
        return true;
    });
}

let create_files = async function() {
    await write_to_csvfile("race_results", "year,round,finish_position,driver_id,constructor_id,finish_status");
    await write_to_csvfile("sprint_results", "year,round,finish_position,driver_id,constructor_id,finish_status");
    await write_to_csvfile("lap_times", "year,round,lap,driver_id,lap_time");
    await write_to_csvfile("driver_standings", "year,round,position,driver_id,points");
    await write_to_csvfile("constructor_standings", "year,round,position,constructor_id,points");
    await write_to_csvfile("race_grid", "year,round,grid_position,driver_id,quali_time");
}

let extract_lap_times = async function() {
    // year_round_racehistorychart.pdf
    const pdfExtract = new PDFExtract();

    let year = START_FROM_YEAR;
    for(;year<=UP_TO_YEAR;year++) {
        let csv = "";
        let lap_data = {
            year : year,
            round : 0,
            lap : 0,
            driver_id : '',
            lap_time : "0"
        };

        for(let round = 1; round <= 22; round++) {
            let round_str = round < 10 ? '0'.concat(round) : round;
            let filename = DOCS_FOLDER + year + '_' + round_str + '_' + 'racehistorychart';
            lap_data.lap = 0;
    
            let extracted_data = {};
            try {
                extracted_data = await pdfExtract.extract(filename.concat('.pdf'), {});
            } catch (error) {
                break;
            } 
            
            for(let page_num in extracted_data.pages) {
            
                const table = extracted_data.pages[page_num].content; // array
                
                for(let line of table) {
                    if(line.str.trim() == "") {
                        continue;
                    }
                    if(line.str.match(/LAP\s\d+/g)) { // lap
                        lap_data.lap++;
                    }
                    if(line.str.length <= 2) { // car_number -> driver_id
                        lap_data.driver_id = car_number_to_driver_id(line.str);
                    }
                    if(line.str.length === 8 && line.str.includes(':')) { // lap_time
                        lap_data.lap_time = line.str;
                        const lap_data_csv = lap_data.lap + "," + lap_data.driver_id + ',' + lap_data.lap_time;
                        csv = csv.concat('\n', year, ',', round, ',', lap_data_csv);
                    }
                }
            }
        
            await write_to_csvfile("lap_times", csv);
            csv = "";
        }
    }

}

const extract_standings = async function() {
    // year_round_standings.pdf
    const pdfExtract = new PDFExtract();
    
    const driver_regex = /[A-Z]\.\s[A-Z]+/g;
    let position_in_championship = 0;
    let found_driver = false;
    let year = START_FROM_YEAR;

    let csv_drivers = "";
    let csv_constructors = "";

    for(;year<=UP_TO_YEAR;year++) {
        
        for(let round = 1; round <= 22; round++) {
            let round_str = round < 10 ? '0'.concat(round) : round;
            let filename = DOCS_FOLDER + year + '_' + round_str + '_' + 'standings';

            if (year === 2021 && round === 1) {
                csv_drivers += "\n2021,1,1,lewis_hamilton,25\n"+
                    "2021,1,2,max_verstappen,18\n"+
                    "2021,1,3,valtteri_bottas,16\n"+
                    "2021,1,4,lando_norris,12\n"+
                    "2021,1,5,sergio_perez,10\n"+
                    "2021,1,6,charles_leclerc,8\n"+
                    "2021,1,7,daniel_ricciardo,6\n"+
                    "2021,1,8,carlos_sainz,4\n"+
                    "2021,1,9,yuki_tsunoda,2\n"+
                    "2021,1,10,lance_stroll,1\n"+
                    "2021,1,11,kimi_raikkonen,0\n"+
                    "2021,1,12,antonio_giovinazzi,0\n"+
                    "2021,1,13,esteban_ocon,0\n"+
                    "2021,1,14,george_russell,0\n"+
                    "2021,1,15,sebastian_vettel,0\n"+
                    "2021,1,16,mick_schumacher,0\n"+
                    "2021,1,17,pierre_gasly,0\n"+
                    "2021,1,18,nicholas_latifi,0";
                
                csv_constructors += "\n2021,1,1,mercedes,41\n"+
                    "2021,1,2,red_bull,28\n"+
                    "2021,1,3,mclaren,18\n"+
                    "2021,1,4,ferrari,12\n"+
                    "2021,1,5,alphatauri,2\n"+
                    "2021,1,6,aston_martin,1\n"+
                    "2021,1,7,alfa_romeo,0\n"+
                    "2021,1,8,alpine,0\n"+
                    "2021,1,9,williams,0\n"+
                    "2021,1,10,haas,0";
                
                continue;
            }
            if (year === 2022 && round === 16) {
                csv_drivers += "\n2022,16,1,max_verstappen,335\n"+
                    "2022,16,2,charles_leclerc,219\n"+
                    "2022,16,3,sergio_perez,210\n"+
                    "2022,16,4,george_russell,203\n"+
                    "2022,16,5,carlos_sainz,187\n"+
                    "2022,16,6,lewis_hamilton,168\n"+
                    "2022,16,7,lando_norris,88\n"+
                    "2022,16,8,esteban_ocon,66\n"+
                    "2022,16,9,fernando_alonso,59\n"+
                    "2022,16,10,valtteri_bottas,46\n"+
                    "2022,16,11,pierre_gasly,22\n"+
                    "2022,16,12,kevin_magnussen,22\n"+
                    "2022,16,13,sebastian_vettel,20\n"+
                    "2022,16,14,daniel_ricciardo,19\n"+
                    "2022,16,15,mick_schumacher,12\n"+
                    "2022,16,16,yuki_tsunoda,11\n"+
                    "2022,16,17,zhou_guanyu,6\n"+
                    "2022,16,18,lance_stroll,5\n"+
                    "2022,16,19,alexander_albon,4\n"+
                    "2022,16,20,nyck_de_vries,2\n"+
                    "2022,16,21,nicholas_latifi,0\n"+
                    "2022,16,22,nico_hulkenberg,0";
                
                csv_constructors += "\n2022,16,1,red_bull,545\n"+
                    "2022,16,2,ferrari,406\n"+
                    "2022,16,3,mercedes,371\n"+
                    "2022,16,4,alpine,125\n"+
                    "2022,16,5,mclaren,107\n"+
                    "2022,16,6,alfa_romeo,52\n"+
                    "2022,16,7,haas,34\n"+
                    "2022,16,8,alphatauri,33\n"+
                    "2022,16,9,aston_martin,25\n"+
                    "2022,16,10,williams,6";

                continue;
            }
            if (year === 2023 && round === 2) {
                csv_drivers += "\n2023,2,1,max_verstappen,44\n"+
                    "2023,2,2,sergio_perez,43\n"+
                    "2023,2,3,fernando_alonso,30\n"+
                    "2023,2,4,carlos_sainz,20\n"+
                    "2023,2,5,lewis_hamilton,20\n"+
                    "2023,2,6,george_russell,18\n"+
                    "2023,2,7,lance_stroll,8\n"+
                    "2023,2,8,charles_leclerc,6\n"+
                    "2023,2,9,valtteri_bottas,4\n"+
                    "2023,2,10,esteban_ocon,4\n"+
                    "2023,2,11,pierre_gasly,4\n"+
                    "2023,2,12,kevin_magnussen,1\n"+
                    "2023,2,13,alexander_albon,1\n"+
                    "2023,2,14,yuki_tsunoda,0\n"+
                    "2023,2,15,nico_hulkenberg,0\n"+
                    "2023,2,16,logan_sargeant,0\n"+
                    "2023,2,17,zhou_guanyu,0\n"+
                    "2023,2,18,nyck_de_vries,0\n"+
                    "2023,2,19,oscar_piastri,0\n"+
                    "2023,2,20,lando_norris,0";

                csv_constructors += "\n2023,2,1,red_bull,87\n"+
                    "2023,2,2,aston_martin,38\n"+
                    "2023,2,3,mercedes,38\n"+
                    "2023,2,4,ferrari,26\n"+
                    "2023,2,5,alpine,8\n"+
                    "2023,2,6,alfa_romeo,4\n"+
                    "2023,2,7,haas,1\n"+
                    "2023,2,8,williams,1\n"+
                    "2023,2,9,alphatauri,0\n"+
                    "2023,2,10,mclaren,0";
                continue;
            }
            
            let extracted_data = {};
            try {
                extracted_data = await pdfExtract.extract(filename.concat('.pdf'), {});
            } catch (error) {
                break;
            }
    
            position_in_championship = 0;
            
            // Drivers
            for(let page_num = 1; page_num <= 2; page_num++) {
                for(let text of extracted_data.pages[page_num].content) {
                    if(text.str.trim().length == 0) {
                        continue;
                    }
                    if(found_driver) {
                        csv_drivers = csv_drivers.concat(text.str); // points
                        found_driver = false;
                    }
                    if(text.str.match(driver_regex)) {
                        position_in_championship++;
                        csv_drivers = csv_drivers.concat('\n', year, ',', round, ',', position_in_championship, ',', standing_driver_name_to_driver_id(text.str), ',');
                        found_driver = true;
                    }
                }    
            }
    
            let found_constructor = false;
            position_in_championship = 0;
    
            // constructors
            for(let text of extracted_data.pages[3].content) {
                if(text.str.trim().length == 0) {
                    continue;
                }
    
                if(found_constructor && text.str.match(/^\d+[\.\d]*$/)) {
                    csv_constructors = csv_constructors.concat(text.str); // points
                    found_constructor = false;
                    if(position_in_championship === 10) {
                        break;
                    }
                }
                if(standing_constructor_to_constructor_id(text.str) !== '') {
                    position_in_championship++;
                    csv_constructors = csv_constructors.concat('\n', year, ',', round, ',', position_in_championship, ',', standing_constructor_to_constructor_id(text.str), ',');
                    found_constructor = true;
                }
            }
        }
    }

    await write_to_csvfile("driver_standings", csv_drivers);
    await write_to_csvfile("constructor_standings", csv_constructors);
}

const extract_race_results = async function() {
    // year_round_raceresults.pdf
    const driver_regex = /^[A-Z][a-z]+ [A-Z]+ ?[A-Z]+?( \*)?$/g;
    const chinese_driver_regex = /^[A-Z]+ [A-Z][a-z]+( \*)?$/g;
    const pdfExtract = new PDFExtract();
    let year = START_FROM_YEAR;

    for(;year<=UP_TO_YEAR;year++) {
        let csv = "";
        let race_data = {
            year : year,
            round : 0,
            driver_id : '',
            finish_position : 0,
            finish_status : 'Finish'
        };

        for(let round = 1; round <= 22; round++) {
            let round_str = round < 10 ? '0'.concat(round) : round;
            let filename = DOCS_FOLDER + year + '_' + round_str + '_' + 'raceresults';

            race_data.round = round;
            race_data.finish_position = 0;
    
            let extracted_data = {};
            try {
                extracted_data = await pdfExtract.extract(filename.concat('.pdf'), {});
            } catch (error) {
                break;
            }
            
            const table = extracted_data.pages[1].content; // array
            let default_finish_status = 'Finish'
    
            let first = true;
            
            for(let line of table) {
                if(line.str.trim() == "") {
                    continue;
                }
                if(line.str.trim() == "DRIVER") {
                    default_finish_status = 'Finish';
                }
                if(line.str.trim() == "NOT CLASSIFIED") {
                    default_finish_status = 'DNF';
                }
                if(line.str.trim().includes("FASTEST LAP")) {
                    break;
                }
    
                if(line.str.includes('LAP') || line.str.includes('DNF') || line.str.includes('DSQ')) {
                    race_data.finish_status = line.str.trim();
                }
    
                if(line.str.match(driver_regex) || line.str.match(chinese_driver_regex)) {
                    if(first) {
                        first = false;
                    } else {
                        // save data for previous driver
                        const race_data_csv = race_data.finish_position + "," + race_data.driver_id + ',' + driver_id_to_constructor_id(race_data.driver_id, year) + ',' + race_data.finish_status;
                        csv = csv.concat('\n', year, ',', round, ',', race_data_csv);
                    }
    
                    // create data for next driver
                    race_data.driver_id = line.str.toLowerCase().replace(' *', '').replace(/ /g, '_'); // Max VERSTAPPEN -> max_verstappen
                    if(default_finish_status === 'Finish') {
                        race_data.finish_position++;
                        race_data.finish_status = 'Finish';
                    } else {
                        race_data.finish_position = 'N/C';
                    }
                }
            }
    
            // last driver to finish race
            const race_data_csv = race_data.finish_position + "," + race_data.driver_id + ',' + driver_id_to_constructor_id(race_data.driver_id, year) + ',' + race_data.finish_status;
            csv = csv.concat('\n', year, ',', round, ',', race_data_csv);
    
            first = true;
    
            await write_to_csvfile("race_results", csv);
            csv = "";
        }
    }
}

const extract_sprint_results = async function() {
    // year_round_raceresults.pdf
    const driver_regex = /^[A-Z][a-z]+ [A-Z]+ ?[A-Z]+?( \*)?$/g;
    const chinese_driver_regex = /^[A-Z]+ [A-Z][a-z]+( \*)?$/g;
    const pdfExtract = new PDFExtract();
    let year = START_FROM_YEAR;

    for(;year<=UP_TO_YEAR;year++) {
        let csv = "";
        let race_data = {
            year : year,
            round : 0,
            driver_id : '',
            finish_position : 0,
            finish_status : 'Finish'
        };

        for(let round = 1; round <= 22; round++) {
            let round_str = round < 10 ? '0'.concat(round) : round;
            let filename = DOCS_FOLDER + year + '_' + round_str + '_' + 'sprintresults';

            race_data.round = round;
            race_data.finish_position = 0;
    
            let extracted_data = {};
            try {
                extracted_data = await pdfExtract.extract(filename.concat('.pdf'), {});
            } catch (error) {
                continue;
            }
            
            const table = extracted_data.pages[1].content; // array
            let default_finish_status = 'Finish'
    
            let first = true;
            
            for(let line of table) {
                if(line.str.trim() == "") {
                    continue;
                }
                if(line.str.trim() == "DRIVER") {
                    default_finish_status = 'Finish';
                }
                if(line.str.trim() == "NOT CLASSIFIED") {
                    default_finish_status = 'DNF';
                }
                if(line.str.trim().includes("FASTEST LAP")) {
                    break;
                }
    
                if(line.str.includes('LAP') || line.str.includes('DNF') || line.str.includes('DSQ')) {
                    race_data.finish_status = line.str.trim();
                }
    
                if(line.str.match(driver_regex) || line.str.match(chinese_driver_regex)) {
                    if(first) {
                        first = false;
                    } else {
                        // save data for previous driver
                        const race_data_csv = race_data.finish_position + "," + race_data.driver_id + ',' + driver_id_to_constructor_id(race_data.driver_id, year) + ',' + race_data.finish_status;
                        csv = csv.concat('\n', year, ',', round, ',', race_data_csv);
                    }
    
                    // create data for next driver
                    race_data.driver_id = line.str.toLowerCase().replace(' *', '').replace(/ /g, '_'); // Max VERSTAPPEN -> max_verstappen
                    if(default_finish_status === 'Finish') {
                        race_data.finish_position++;
                        race_data.finish_status = 'Finish';
                    } else {
                        race_data.finish_position = 'N/C';
                    }
                }
            }
    
            // last driver to finish race
            const race_data_csv = race_data.finish_position + "," + race_data.driver_id + ',' + driver_id_to_constructor_id(race_data.driver_id, year) + ',' + race_data.finish_status;
            csv = csv.concat('\n', year, ',', round, ',', race_data_csv);
    
            first = true;
    
            await write_to_csvfile("sprint_results", csv);
            csv = "";
        }
    }
}

const extract_grid = async function() {
    const pdfExtract = new PDFExtract();
    let year = START_FROM_YEAR;
    let csv = '\n';
    const time_regex = /^[1-9]:[0-9][0-9].[0-9]{3}$/;

    for (;year<=UP_TO_YEAR;year++) {
        for (let round = 1; round <= 22; round++) {
            if (year === 2022 && round === 18) {
                let custom_csv = "2022,18,2,charles_leclerc,1:29.314\n"+
                    "2022,18,4,sergio_perez,1:29.709\n"+
                    "2022,18,6,lewis_hamilton,1:30.261\n"+
                    "2022,18,8,george_russell,1:30.389\n"+
                    "2022,18,10,lando_norris,1:31.003\n"+
                    "2022,18,12,valtteri_bottas,1:30.709\n"+
                    "2022,18,14,zhou_guanyu,1:30.709\n"+
                    "2022,18,16,alexander_albon,1:31.311\n"+
                    "2022,18,18,kevin_magnussen,1:31.352\n"+
                    "2022,18,20,nicholas_latifi,1:31.511\n"+
                    "2022,18,1,max_verstappen,1:29.304\n"+
                    "2022,18,3,carlos_sainz,1:29.361\n"+
                    "2022,18,5,esteban_ocon,1:30.165\n"+
                    "2022,18,7,fernando_alonso,1:30.322\n"+
                    "2022,18,9,sebastian_vettel,1:30.554\n"+
                    "2022,18,11,daniel_ricciardo,1:30.659\n"+
                    "2022,18,13,yuki_tsunoda,1:30.808\n"+
                    "2022,18,15,mick_schumacher,1:31.439\n"+
                    "2022,18,17,pierre_gasly,1:31.322\n"+
                    "2022,18,19,lance_stroll,1:31.419\n";
                await write_to_csvfile("race_grid", custom_csv);
                continue;
            }
            if (year === 2022 && round === 6) {
                let custom_csv = "2022,6,2,max_verstappen,1:19.073\n"+
                    "2022,6,4,george_russell,1:19.393\n"+
                    "2022,6,6,lewis_hamilton,1:19.512\n"+
                    "2022,6,8,kevin_magnussen,1:19.682\n"+
                    "2022,6,10,mick_schumacher,1:20.368\n"+
                    "2022,6,12,esteban_ocon,1:20.638\n"+
                    "2022,6,14,pierre_gasly,1:20.861\n"+
                    "2022,6,16,sebastian_vettel,1:20.954\n"+
                    "2022,6,18,alexander_albon,1:21.645\n"+
                    "2022,6,20,fernando_alonso,1:21.043\n"+
                    "2022,6,1,charles_leclerc,1:18.750\n"+
                    "2022,6,3,carlos_sainz,1:19.166\n"+
                    "2022,6,5,sergio_perez,1:19.420\n"+
                    "2022,6,7,valtteri_bottas,1:19.608\n"+
                    "2022,6,9,daniel_ricciardo,1:20.297\n"+
                    "2022,6,11,lando_norris,1:20.471\n"+
                    "2022,6,13,yuki_tsunoda,1:20.639\n"+
                    "2022,6,15,zhou_guanyu,1:21.094\n"+
                    "2022,6,17,lance_stroll,1:21.418\n"+
                    "2022,6,19,nicholas_latifi,1:21.915\n";
                await write_to_csvfile("race_grid", custom_csv);
                continue;
            }
            let round_str = round < 10 ? '0'.concat(round) : round;
            let filename = DOCS_FOLDER + year + '_' + round_str + '_' + 'grid';
    
            let extracted_data = {};
            try {
                extracted_data = await pdfExtract.extract(filename.concat('.pdf'), {});
            } catch (error) {
                break;
            }
            
            const table = extracted_data.pages[1].content;
            let acc = [];
            let pitLaneStarts = false;

            for(let line of table) {
                if(pitLaneStarts && line.str.trim().match(time_regex) && acc.length === 0) {
                    continue;
                }
                if(pitLaneStarts && line.str.trim().match(time_regex)) {
                    acc[1] = acc[1].toLowerCase().replace(' *', '').replace('*', '').replace(/ /g, '_');
                    csv = csv.concat(`${year},${round},PIT LANE,${acc[1]},N/A\n`);
                    acc = [];
                    continue;
                }

                if (line.str.includes('NOTES') || line.str.includes('PENALTIES') 
                    || line.str.includes('FORMULA 1') || line.str.includes('Doc 29')) break;

                if (line.str.trim() == "" && (acc.length !== 4 || year === 2023)) continue;
                if (line.str.trim().match(/^[0-9][0-9]?$/) && acc.length === 4) {
                    if(acc[0].includes('PIT LANE')) acc[0] = 'PIT LANE';
                    acc[2] = acc[2].toLowerCase().replace(' *', '').replace('*', '').replace(/ /g, '_');
                    csv = csv.concat(`${year},${round},${acc[0]},${acc[2]},N/A\n`)
                    acc = [];
                }

                if (line.str.includes('PIT LANE')) {
                    pitLaneStarts = true;
                    continue;
                }

                acc.push(line.str);

                if (pitLaneStarts && acc.length === 3) {
                    //if(acc[3].length === 0) acc[3] = 'N/A';
                    acc[1] = acc[1].toLowerCase().replace(' *', '').replace('*', '').replace(/ /g, '_');
                    //csv = csv.concat(`${year},${round},PIT LANE,${acc[1]},${acc[3]}\n`)
                    csv = csv.concat(`${year},${round},PIT LANE,${acc[1]},N/A\n`)
                    acc = [];
                    continue;
                }
                if (acc.length === 5) {
                    if(acc[0].includes('PIT LANE')) acc[0] = 'PIT LANE';
                    if(acc[4].length === 0) acc[4] = 'N/A';
                    acc[2] = acc[2].toLowerCase().replace(' *', '').replace('*', '').replace(/ /g, '_');
                    csv = csv.concat(`${year},${round},${acc[0]},${acc[2]},${acc[4]}\n`)
                    acc = [];
                } 
            }
    
            await write_to_csvfile("race_grid", csv);
            csv = "";
        }
    }
}

create_files().then(() => {
    extract_lap_times();
    extract_standings(); 
    extract_race_results();
    extract_sprint_results();
    extract_grid();
});


// https://www.fia.com/events/fia-formula-one-world-championship/season-2021/emilia-romagna-grand-prix/eventtiming
// https://www.fia.com/events/fia-formula-one-world-championship/season-2021/bahrain-grand-prix/eventtiming-information


const standing_driver_name_to_driver_id = function(driver) {
    switch (driver) {
        case 'A. GIOVINAZZI': return 'antonio_giovinazzi';
        case 'C. LECLERC': return 'charles_leclerc';
        case 'C. SAINZ': return 'carlos_sainz';
        case 'D. RICCIARDO': return 'daniel_ricciardo';
        case 'E. OCON': return 'esteban_ocon';
        case 'F. ALONSO': return 'fernando_alonso';
        case 'G. RUSSELL': return 'george_russell';
        case 'K. RAIKKONEN': return 'kimi_raikkonen';
        case 'L. HAMILTON': return 'lewis_hamilton';
        case 'L. NORRIS': return 'lando_norris';
        case 'L. STROLL': return 'lance_stroll';
        case 'M. SCHUMACHER': return 'mick_schumacher';
        case 'M. VERSTAPPEN': return 'max_verstappen';
        case 'N. LATIFI': return 'nicholas_latifi';
        case 'N. MAZEPIN': return 'nikita_mazepin';
        case 'P. GASLY': return 'pierre_gasly';
        case 'S. PEREZ': return 'sergio_perez';
        case 'S. VETTEL': return 'sebastian_vettel';
        case 'V. BOTTAS': return 'valtteri_bottas';
        case 'Y. TSUNODA': return 'yuki_tsunoda';
        case 'R. KUBICA': return 'robert_kubica';
        case 'A. ALBON': return 'alexander_albon';
        case 'N. DE VRIES': return 'nyck_de_vries';
        case 'N. HULKENBERG': return 'nico_hulkenberg';
        case 'K. MAGNUSSEN': return 'kevin_magnussen';
        case 'G. ZHOU': return 'zhou_guanyu';
        case 'O. PIASTRI': return 'oscar_piastri';
        case 'L. SARGEANT': return 'logan_sargeant'
        default: return 'unknown';
    }
}

const car_number_to_driver_id = function(car_number) {
    switch (car_number) {
        case '44': return 'lewis_hamilton';
        case '77': return 'valtteri_bottas';
        case '33': return 'max_verstappen';
        case '1': return 'max_verstappen';
        case '11': return 'sergio_perez';
        case '16': return 'charles_leclerc';
        case '55': return 'carlos_sainz';
        case '4': return 'lando_norris';
        case '3': return 'daniel_ricciardo';
        case '14': return 'fernando_alonso';
        case '31': return 'esteban_ocon';
        case '10': return 'pierre_gasly';
        case '22': return 'yuki_tsunoda';
        case '5': return 'sebastian_vettel';
        case '18': return 'lance_stroll';
        case '63': return 'george_russell';
        case '6': return 'nicholas_latifi';
        case '7': return 'kimi_raikkonen';
        case '99': return 'antonio_giovinazzi';
        case '47': return 'mick_schumacher';
        case '9': return 'nikita_mazepin';
        case '88': return 'robert_kubica';
        case '24': return 'zhou_guanyu';
        case '27': return 'nico_hulkenberg';
        case '45': return 'nyck_de_vries';
        case '21': return 'nyck_de_vries';
        case '23': return 'alexander_albon';
        case '20': return 'kevin_magnussen';
        case '2': return 'logan_sargeant';
        case '81': return 'oscar_piastri';
        default: return 'unknown';
    }
}

const driver_id_to_constructor_id = function(driver_id, year) {
    switch (driver_id) {
        case 'lewis_hamilton': return 'mercedes'; 
        case 'valtteri_bottas': 
            if (year === 2021) return 'mercedes';
            if (year === 2022 || year === 2023) return 'alfa_romeo';
        case 'max_verstappen': return 'red_bull'; 
        case 'sergio_perez': return 'red_bull'; 
        case 'charles_leclerc': return 'ferrari'; 
        case 'carlos_sainz': return 'ferrari'; 
        case 'lando_norris': return 'mclaren'; 
        case 'daniel_ricciardo': return 'mclaren'; 
        case 'fernando_alonso': 
            if (year === 2021) return 'alpine';
            if (year === 2022 || year === 2023) return 'aston_martin';
        case 'esteban_ocon': return 'alpine'; 
        case 'pierre_gasly':
            if (year === 2021 || year === 2022) return 'alphatauri';
            if (year === 2023) return 'alpine';
        case 'yuki_tsunoda': return 'alphatauri'; 
        case 'sebastian_vettel': return 'aston_martin'; 
        case 'lance_stroll': return 'aston_martin'; 
        case 'george_russell': 
            if (year === 2021) return 'williams';
            if (year === 2022 || year === 2023) return 'mercedes';
        case 'nicholas_latifi': return 'williams'; 
        case 'kimi_raikkonen': return 'alfa_romeo'; 
        case 'antonio_giovinazzi': return 'alfa_romeo'; 
        case 'mick_schumacher': return 'haas'; 
        case 'nikita_mazepin': return 'haas'; 
        case 'robert_kubica': return 'alfa_romeo';
        case 'alexander_albon': return 'williams';
        case 'nyck_de_vries':
            if (year === 2022) return 'williams';
            if (year === 2023) return 'alphatauri';
        case 'nico_hulkenberg':
            if (year === 2022) return 'aston_martin';
            if (year === 2023) return 'haas';
        case 'zhou_guanyu': return 'alfa_romeo';
        case 'kevin_magnussen': return 'haas';
        case 'oscar_piastri': return 'mclaren';
        case 'logan_sargeant': return 'williams';
        default: return 'unknown';
    }
}

const standing_constructor_to_constructor_id = function(constructor) {
    if(constructor.toLowerCase().includes('mercedes')) {
        return 'mercedes';
    } else if(constructor.toLowerCase().includes('red bull')) {
        return 'red_bull';
    } else if(constructor.toLowerCase().includes('mclaren')) {
        return 'mclaren';
    } else if(constructor.toLowerCase().includes('ferrari')) {
        return 'ferrari';
    } else if(constructor.toLowerCase().includes('aston martin')) {
        return 'aston_martin';
    } else if(constructor.toLowerCase().includes('alfa romeo')) {
        return 'alfa_romeo';
    } else if(constructor.toLowerCase().includes('alphatauri')) {
        return 'alphatauri';
    } else if(constructor.toLowerCase().includes('alpine')) {
        return 'alpine';
    } else if(constructor.toLowerCase().includes('williams')) {
        return 'williams';
    } else if(constructor.toLowerCase().includes('haas')) {
        return 'haas';
    } else {
        return '';
    }
}