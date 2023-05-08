export const ApiDocs = {
    data: function() {
        return {
            apiEndpointsList : [
                '/api/drivers',
                '/api/drivers/sebastian_vettel',
                '/api/constructors',
                '/api/constructors/ferrari',
                '/api/circuits',
                '/api/circuits/monza_circuit',
                '/api/races',
                '/api/2021/races',
                '/api/2021/drivers',
                '/api/2021/constructors',
                '/api/2021/circuits',
                '/api/2021/14',
                //'/api/2021/01/race_grid',
                '/api/2021/14/race_results',
                '/api/2021/14/sprint_results',
                '/api/2021/14/race_lap_times',
                '/api/2021/14/race_lap_times/lap/50',
                '/api/2021/14/race_lap_times/driver/daniel_ricciardo',
                '/api/2021/14/driver_standings',
                '/api/2021/14/constructor_standings',
                '/api/dataset',
                '/api/dataset/drivers.csv'
            ],
            apiResponseExample : ''
        }
    },
    template: `
        <div class="container my-3"> <!-- container -->

            <h1>REST API Documentation</h1>

            <div class="container mb-5"> <!-- API TABLE -->
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Endpoint</th>
                            <th>Returned Information</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/drivers</code></td>
                            <td>Returns information about all drivers across all seasons in the Formula One
                                championship.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/drivers/:driver_id</code></td>
                            <td>Returns information about a single driver with the provided <code>driverName</code>
                                parameter. The <code>driver_id</code> parameter should be replaced with the id of the
                                driver you are querying, which is given by the formula 
                                <code>driver_id = driver_name.toLowerCase().replace(' ','_')</code>, 
                                e.g. <code>GET /api/drivers/sebastian_vettel</code>.
                                </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/constructors</code></td>
                            <td>Returns information about all constructors across all seasons in the Formula One
                                championship.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/constructors/:constructor_id</code></td>
                            <td>Returns information about a single constructor with the provided
                                <code>constructorName</code> parameter. The <code>constructorName</code> parameter
                                should be replaced with the name of the constructor you are querying, which is given
                                by the formula <code>driver_id = driver_name.toLowerCase().replace(' ','_')</code>, 
                                e.g. <code>GET /api/constructors/ferrari</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/circuits</code></td>
                            <td>Returns information about all circuits across all seasons in the Formula One
                                championship.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/circuits/:circuit_id</code></td>
                            <td>Returns information about a single circuit with the provided <code>circuit_id</code>
                                parameter. The <code>circuit_id</code> parameter should be replaced with the name of
                                the circuit you are querying, e.g. <code>GET /api/circuits/monza_circuit</code>.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/races</code></td>
                            <td>Returns information about all races across all seasons in the Formula One championship.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/drivers</code></td>
                            <td>Returns information about all the drivers who competed in the given <code>year</code>
                                in the Formula One championship. Replace <code>year</code> with the year you want to
                                query in four-digit format, e.g. <code>GET /api/2023/drivers</code>.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/races</code></td>
                            <td>Returns information about all the races of the given <code>year</code> in the Formula
                                One championship, including the circuit name, location, and date. Replace
                                <code>year</code> with the year you want to query in four-digit format, e.g.
                                <code>GET /api/2023/races</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/constructors</code></td>
                            <td>Returns information about all the constructors who competed in the given
                                <code>year</code> in the Formula One championship. Replace <code>year</code> with the
                                year you want to query in four-digit format, e.g. <code>GET /api/2023/constructors</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/circuits</code></td>
                            <td>Returns information about all the circuits used in the given <code>year</code> in the
                                Formula One championship. Replace <code>year</code> with the year you want to query in
                                four-digit format, e.g. <code>GET /api/2023/circuits</code>.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round</code></td>
                            <td>Returns information about the race for the given <code>year</code> and
                                <code>round</code>. Replace <code>year</code> with the year you want to query in
                                four-digit format, and <code>round</code> with the round of the championship in which
                                the race occurred, e.g. <code>GET /api/2023/5</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round/race_results</code></td>
                            <td>Returns the results of the race for the given <code>year</code> and
                                <code>round</code>. Replace <code>year</code> with the year you want to query in
                                four-digit format, and <code>round</code> with the round of the championship in which
                                the race occurred, e.g. <code>GET /api/2023/5/race_results</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round/race_lap_times</code></td>
                            <td>Returns the lap times of all drivers in the given race for the given <code>year</code>
                                and <code>round</code>. Replace <code>year</code> with the year you want to query in
                                four-digit format, and <code>round</code> with the round of the championship in which
                                the race occurred, e.g. <code>GET /api/2023/5/race_lap_times</code>.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round/race_lap_times/lap/:lap</code></td>
                            <td>Returns the lap times of all drivers on lap <code>lap</code> in the given race for the
                                given <code>year</code> and <code>round</code>. Replace <code>year</code> with the
                                year you want to query in four-digit format, <code>round</code> with the round of the
                                championship in which the race occurred, and <code>lap</code> with the lap number you
                                want to query, e.g. <code>GET /api/2023/5/race_lap_times/lap/3</code>.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round/race_lap_times/driver/:driver_id</code></td>
                            <td>Returns the lap times of the specified driver in the given race for the given
                                <code>year</code> and <code>round</code>. Replace <code>year</code> with the year you
                                want to query in four-digit format, <code>round</code> with the round of the
                                championship in which the race occurred, and <code>driver_id</code> with the id of the
                                driver you want to query, e.g.
                                <code>GET /api/2023/5/race_lap_times/driver/lewis_hamilton</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round/sprint_results</code></td>
                            <td>Returns the results of the sprint race for the given <code>year</code> and
                                <code>round</code>, e.g. <code>GET /api/2023/5/race_results</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round/driver_standings</code></td>
                            <td>Returns the driver standings after the given race (<code>round</code>) of a given 
                            <code>year</code> (F1 season), e.g. <code>GET /api/2022/4/driver_standings</code>.</td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/:year/:round/constructor_standings</code></td>
                            <td>Returns the constructor standings after the given race (<code>round</code>) of a given 
                            <code>year</code> (F1 season), e.g. <code>GET /api/2022/4/constructor_standings</code>.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/dataset</code></td>
                            <td>Returns information about the csv files that compose the dataset.
                            </td>
                        </tr>
                        <tr>
                            <td><code>GET</code></td>
                            <td><code>/api/dataset/:filename</code></td>
                            <td>Returns the content of <code>filename</code>.
                            If visited from a browser, automatically starts the download of the file.
                            e.g. <code>GET /api/dataset/drivers.csv</code>.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="api-examples">API Response Examples</h2>
            <p>Click a Request to display the corresponding Response</p>

            <div class="list-group mb-5"> <!-- examples container -->

                <div v-for="apiExample of apiEndpointsList" class="list-group-item">
                    <button data-bs-toggle="collapse" class="btn btn-dark" :href="'#'.concat(apiExample)" @click="fetchResponse(apiExample)">
                        <code>GET {{apiExample}}</code> <i class="bi bi-chevron-expand"></i>
                    </button>
                    <div class="collapse" :id="apiExample">
                        <pre v-if="apiResponseExample">
                            <code>
                                {{apiResponseExample}}
                            </code>
                        </pre>
                    </div>
                </div>

            </div> <!-- api responses examples list group -->

        </div>
    `,
    methods : {
        fetchResponse: async function(url) {
            this.apiResponseExample = '';

            
            
            let apiRequest = fetch(url).then(res => {
                if(url !== '/api/dataset/drivers.csv')
                    return res.json();
                else
                    return res.text();
            });

            const collapseElements = document.querySelectorAll('.collapse');

            for(let element of collapseElements) {
                element.setAttribute('aria-expanded', 'false');
                element.classList.remove('show');
            }

            this.apiResponseExample = await (Promise.resolve(apiRequest));
        }
    }
}