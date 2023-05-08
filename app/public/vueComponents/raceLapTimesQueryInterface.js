export const RaceLapTimesQueryInterface = {
    data : function() {
        return {
            querySection : "generalInfo",
            raceYear : "",
            raceRound : "" ,
            raceLaps : "",
            lapLapNum : "",
            lapDriver : "",
            lapDriversList : [],
            roundsOfYear : [],
            lapTimes : []
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
                    <select class="form-select bg-dark" id="floatingLapNumber" v-model="lapLapNum">
                        <option value="">All</option>
                        <option v-for="lapNum in raceLaps" :value="lapNum">{{lapNum}}</option>
                    </select>
                    <label for="floatingLapNumber">Lap</label>
                </div>

                <div class="form-floating">
                    <select class="form-select bg-dark" id="floatingDriver" v-model="lapDriver">
                        <option value="">All</option>
                        <option v-for="driver in lapDriversList" :value="driver">{{driver}}</option>
                    </select>
                    <label for="floatingDriver">Driver</label>
                </div> 

                <button class="btn btn-outline-secondary btn-lg" type="button" @click.prevent="sendRaceLapQuery">
                    <i class="bi bi-search"></i>
                </button>
            </div>

            <table class="table table-dark table-hover" v-if="lapTimes.length > 0">
                <thead>
                    <tr>
                        <th>Lap</th>
                        <th>Driver</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody v-for="l in lapTimes">
                    <tr v-for="ld of l.times">
                        <td>{{l.lap}}</td>
                        <td>{{ld.driver_name}}</td>
                        <td>{{ld.lap_time}}</td>
                    </tr>
                </tbody>
            </table>

        </article>
    `,
    watch: {
        raceYear: async function (newVal, oldVal) {
            this.roundsOfYear = (await (await fetch(`/api/${newVal}/races`)).json()).map(r => r.round);
        },
        raceRound: async function (newVal, oldVal) {
            let raceLapTimes = await (await fetch(`/api/${this.raceYear}/${newVal}/race_lap_times`)).json();
            this.raceLaps = raceLapTimes.lap_times.length;
            this.lapDriversList = raceLapTimes.lap_times[0].times.map(o => o.driver_id);
        }
    },
    methods : {
        sendRaceLapQuery: async function() {
            let apiURL = `/api/${this.raceYear}/${this.raceRound}/race_lap_times/`;
            if(this.lapDriver === "" && this.lapLapNum !== "") {
                apiURL = apiURL.concat(`lap/${this.lapLapNum}`);
            } else if(this.lapDriver !== "") {
                apiURL = apiURL.concat(`driver/${this.lapDriver}`);
            }
            try {
                let resultResponse = await fetch(apiURL);
                if(resultResponse.status !== 200) throw new Error();
                let resultJson = await resultResponse.json();
                this.lapTimes = [];
                if(apiURL.includes('driver/')) {
                    for(let _lap of resultJson.lap_times) {
                        if(this.lapLapNum !== "" && _lap.lap != this.lapLapNum) 
                            continue;
                        this.lapTimes.push({
                            lap : _lap.lap,
                            times : [{
                                driver_name : resultJson.driver_name,
                                lap_time : _lap.lap_time
                            }]
                        });
                    }
                } else if(apiURL.includes('/lap/')) {
                    this.lapTimes = [
                        {
                            lap : resultJson.lap,
                            times : resultJson.lap_times
                        }
                    ];
                } else {
                    this.lapTimes = resultJson.lap_times;
                }
            } catch(err) {
                console.log(`${err}`);
            }
        }
    }
}