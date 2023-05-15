export const DatasetDocs = {

    template: `
        <div class="container mt-3 mb-5">

            <h1>Dataset</h1>

            <p>This Dataset contains Formula 1 data of seasons 2021, 2022 and the first four rounds of 2023.</p>
            <p>The data has been scraped by publicly available PDFs  on the <a class="link-light" target="_blank" href="https://www.fia.com">FIA website</a>.</p>
            <p>The csv files that compose the Dataset available for download <a class="link-light" href="/#/datasetFolder">here</a></p>

            <div class="my-5">
                <ul class="list-group">
                    <li class="list-group-item fs-5 ps-5 text-light"><b>Dublin Core Metadata Element Set</b></li>
                    <li class="list-group-item"><b>Title</b> F1 Dataset</li>
                    <li class="list-group-item"><b>Creator</b> Mauro Farina</li>
                    <li class="list-group-item"><b>Subject</b> "Formula One", "Formula 1", "F1", "Motorsport", "Dataset", "CSV", "API"</li>
                    <li class="list-group-item"><b>Description</b> A dataset containing information about the latest seasons of Formula 1</li>
                    <li class="list-group-item"><b>Format</b> CSV (Comma Separated Values)</li>
                    <li class="list-group-item"><b>Identifier</b> https://f1-app-demo-a5kvrhkn4a-ew.a.run.app/api/dataset</li>
                    <li class="list-group-item"><b>License</b> CC0 1.0 Universal (https://creativecommons.org/publicdomain/zero/1.0/)</li>
                </ul>
            </div>

            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Description</th>
                        <th>Data Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">drivers.csv</td>
                    </tr>
                    <tr>
                        <td>driver_id</td>
                        <td>Unique identifier for the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>driver_name</td>
                        <td>Name of the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>country</td>
                        <td>Country of origin for the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>date_of_birth</td>
                        <td>Date of birth for the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>url</td>
                        <td>URL to driver's wikipedia page</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>void</td>
                        <td>A dummy field required by MongoDB Compass</td>
                        <td>---</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">constructors.csv</td>
                    </tr>
                    <tr>
                        <td>constructor_id</td>
                        <td>Unique identifier for the constructor</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>constructor_name</td>
                        <td>Name of the constructor</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>country</td>
                        <td>Country that issues a FIA License to the constructor</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>main_office</td>
                        <td>Location of the main office</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>url</td>
                        <td>URL to constructor's wikipedia page</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>void</td>
                        <td>A dummy field required by MongoDB Compass</td>
                        <td>---</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">circuits.csv</td>
                    </tr>
                    <tr>
                        <td>circuit_id</td>
                        <td>Unique identifier for the circuit</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>circuit_name</td>
                        <td>Name of the circuit</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>country</td>
                        <td>Country where the circuit is located</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>city</td>
                        <td>City where the circuit is located</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>length_in_km</td>
                        <td>Length of the circuit in kilometers</td>
                        <td>Number</td>
                    </tr>
                    <tr>
                        <td>url</td>
                        <td>URL to circuits's wikipedia page</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>void</td>
                        <td>A dummy field required by MongoDB Compass</td>
                        <td>---</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">races.csv</td>
                    </tr>
                    <tr>
                        <td>year</td>
                        <td>Year of the F1 Season</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>round</td>
                        <td>Round within season</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>circuit_id</td>
                        <td>Id of the circuit that holds the race</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>gp_name</td>
                        <td>Formal name of the event</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>race_date</td>
                        <td>Date of the race</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>url</td>
                        <td>URL to official F1 page about the race</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>void</td>
                        <td>A dummy field required by MongoDB Compass</td>
                        <td>---</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">sprint_results.csv</td>
                    </tr>
                    <tr>
                        <td>year</td>
                        <td>The year of the sprint race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>round</td>
                        <td>The round of the sprint race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>finish_position</td>
                        <td>The finishing position of the driver in the sprint race</td>
                        <td>Int or "N/C"</td>
                    </tr>
                    <tr>
                        <td>driver_id</td>
                        <td>The ID of the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>constructor_id</td>
                        <td>The ID of the constructor the driver raced for</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>finish_status</td>
                        <td>The finishing status of the driver in the sprint race</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">race_grid.csv</td>
                    </tr>
                    <tr>
                        <td>year</td>
                        <td>The year of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>round</td>
                        <td>The round of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>grid_position</td>
                        <td>The starting grid position of the driver</td>
                        <td>Int or "PIT LANE"</td>
                    </tr>
                    <tr>
                        <td>driver_id</td>
                        <td>The ID of the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>quali_time</td>
                        <td>The qualifying time of the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">race_results.csv</td>
                    </tr>
                    <tr>
                        <td>year</td>
                        <td>The year of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>round</td>
                        <td>The round of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>finish_position</td>
                        <td>The finishing position of the driver in the race</td>
                        <td>Int or "N/C"</td>
                    </tr>
                    <tr>
                        <td>driver_id</td>
                        <td>The ID of the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>constructor_id</td>
                        <td>The ID of the constructor the driver raced for</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>finish_status</td>
                        <td>The finishing status of the driver in the race</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">race_lap_times.csv</td>
                    </tr>
                    <tr>
                        <td>year</td>
                        <td>The year of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>round</td>
                        <td>The round of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>lap</td>
                        <td>The lap number of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>driver_id</td>
                        <td>The ID of the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>lap_time</td>
                        <td>The time taken by the driver to complete the lap</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">driver_standings.csv</td>
                    </tr>
                    <tr>
                        <td>year</td>
                        <td>The year of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>round</td>
                        <td>The round of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>position</td>
                        <td>The position of the driver in the driver standings</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>driver_id</td>
                        <td>The ID of the driver</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>points</td>
                        <td>The number of points accumulated by the driver in the given <code>year</code>, up to race <code>round</code></td>
                        <td>Number</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="fw-bold text-light ps-5 fs-5">constructor_standings.csv</td>
                    </tr>
                    <tr>
                        <td>year</td>
                        <td>The year of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>round</td>
                        <td>The round of the race</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>position</td>
                        <td>The position of the constructor in the constructor standings</td>
                        <td>Int</td>
                    </tr>
                    <tr>
                        <td>constructor_id</td>
                        <td>The ID of the constructor</td>
                        <td>String</td>
                    </tr>
                    <tr>
                        <td>points</td>
                        <td>The number of points accumulated by the constructor in the given <code>year</code>, up to race <code>round</code></td>
                        <td>Number</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
}
/**
race_grid.csv: year,round,grid_position,driver_id,quali_time
race_results.csv: year,round,finish_position,driver_id,constructor_id,finish_status
race_lap_times.csv: year,round,lap,driver_id,lap_time
driver_standings.csv: year,round,position,driver_id,points




 */