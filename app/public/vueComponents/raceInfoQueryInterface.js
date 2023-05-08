export const RaceInfoQueryInterface = {
    data : function() {
        return {
            raceYear : "",
            raceRound : "" ,
            raceInfo : "",
            roundsOfYear : [],
            raceOverview : null,
            raceResults : [],
            raceSprint : [],
            raceDriverStandings : [],
            raceConstructorStandings : []
        }
    },
    template : `
        <article>
            <div class="input-group mb-4">
                <div class="form-floating">
                    <select class="form-select bg-dark" id="floatingYear" v-model="raceYear">
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                    <label for="floatingYear">Year</label>
                </div>

                <div class="form-floating">
                    <select class="form-select bg-dark" id="floatingYear" v-model="raceRound">
                        <option v-for="r of roundsOfYear" :value="r">{{r}}</option>
                    </select>
                    <label for="floatingYear">Round</label>
                </div>

                <div class="form-floating">
                    <select class="form-select bg-dark" id="floatingInfoType" v-model="raceInfo">
                        <option value="">Overview</option>
                        <!--<option value="race_grid">Race Grid</option>-->
                        <option value="race_results">Race Results</option>
                        <option value="sprint_results">Sprint Results</option>
                        <option value="driver_standings">Driver Standings</option>
                        <option value="constructor_standings">Constructor Standings</option>
                    </select>
                    <label for="floatingInfoType">Information</label>
                </div>

                <button class="btn btn-outline-secondary btn-lg" type="button" @click.prevent="sendRaceQuery">
                    <i class="bi bi-search"></i>
                </button>
            </div>

            <table class="table table-dark table-hover" v-if="raceOverview !== null">
                <tr>
                    <th>Country</th>
                    <th>City</th>
                    <th>Event</th>
                    <th>Circuit</th>
                    <th>Date</th>
                    <th>F1 Website</th>
                </tr>
                <tr>
                    <td>{{raceOverview.country}}</td>
                    <td>{{raceOverview.city}}</td>
                    <td>{{raceOverview.gp_name}}</td>
                    <td>{{raceOverview.circuit_name}}</td>
                    <td>{{raceOverview.race_date}}</td>
                    <td><a :href="raceOverview.url" class="link-light" target="_blank">{{raceOverview.url}}</a></td>
                    </tr>
            </table>

            <table class="table table-dark table-hover" v-if="raceResults.length > 0">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Driver</th>
                        <th>Constructor</th>
                        <th>Grid</th>
                        <th>Finish Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rr of raceResults">
                        <td>{{rr.finish_position}}</td>
                        <td>{{rr.driver_name}}</td>
                        <td>{{rr.constructor_name}}</td>
                        <td>{{rr.grid_position}}</td>
                        <td>{{rr.finish_status}}</td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-dark table-hover" v-if="raceSprint.length > 0">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Driver</th>
                        <th>Constructor</th>
                        <th>Finish Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rr of raceSprint">
                        <td>{{rr.finish_position}}</td>
                        <td>{{rr.driver_name}}</td>
                        <td>{{rr.constructor_name}}</td>
                        <td>{{rr.finish_status}}</td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-dark table-hover" v-if="raceDriverStandings.length > 0">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Driver</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ds of raceDriverStandings">
                        <td>{{ds.position}}</td>
                        <td>{{ds.driver_name}}</td>
                        <td>{{ds.points}}</td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-dark table-hover" v-if="raceConstructorStandings.length > 0">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Constructor</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cs of raceConstructorStandings">
                        <td>{{cs.position}}</td>
                        <td>{{cs.constructor_name}}</td>
                        <td>{{cs.points}}</td>
                    </tr>
                </tbody>
            </table>

        </article>
    `,
    watch: {
        raceYear: async function (newVal, oldVal) {
            this.roundsOfYear = (await (await fetch(`/api/${newVal}/races`)).json()).map(r => r.round);
        }
    },
    methods : {
        sendRaceQuery: async function() {
            let apiURL = `/api/${this.raceYear}/${this.raceRound}/${this.raceInfo}`;
            try {
                let resultResponse = await fetch(apiURL);
                if(resultResponse.status !== 200) throw new Error();
                let resultJson = await resultResponse.json();
                this.resetRaceArrays();
                switch(this.raceInfo) {
                    case '' : this.raceOverview = resultJson; break;
                    case 'race_results' : this.raceResults = resultJson.results; break;
                    case 'sprint_results' : this.raceSprint = resultJson.results; break;
                    case 'driver_standings' : this.raceDriverStandings = resultJson.driver_standings; break;
                    case 'constructor_standings' : this.raceConstructorStandings = resultJson.constructor_standings; break;
                }
            } catch(err) {
                console.log(`${err}`);
            }
        },
        resetRaceArrays : function() {
            this.raceOverview = null;
            this.raceResults = [];
            this.raceSprint = [];
            this.raceDriverStandings = [];
            this.raceConstructorStandings = [];
        }
    }
}