export const GeneralInfoQueryInterface = {
    data : function() {
        return {
            generalYear : "",
            generalInfo : "",
            generalDrivers : [],
            generalConstructors : [],
            generalCircuits : [],
            generalRaces : []
        }
    },
    template : `
        <article>
            <div class="input-group mb-4">
                <div class="form-floating">
                    <select class="form-select bg-dark" id="floatingYear" v-model="generalYear">
                        <option value="">Any</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                    <label for="floatingYear">Year</label>
                </div>

                <div class="form-floating">
                    <select class="form-select bg-dark" id="floatingInfoType" v-model="generalInfo">
                        <option value="drivers">Drivers</option>
                        <option value="constructors">Constructors</option>
                        <option value="circuits">Circuits</option>
                        <option value="races">Races</option>
                    </select>
                    <label for="floatingInfoType">Information</label>
                </div>

                <button class="btn btn-outline-secondary btn-lg" type="button" @click.prevent="sendGeneralQuery">
                    <i class="bi bi-search"></i>
                </button>

            </div>

            <table class="table table-dark table-hover" v-if="generalDrivers.length > 0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>DoB</th>
                        <th>Wikipedia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="d of generalDrivers">
                        <td>{{d.driver_name}}</td>
                        <td>{{d.country}}</td>
                        <td>{{d.date_of_birth}}</td>
                        <td><a :href="d.url" class="link-light" target="_blank">{{d.url}}</a></td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-dark table-hover" v-if="generalConstructors.length > 0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Licensing Country</th>
                        <th>Office Location</th>
                        <th>Wikipedia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c of generalConstructors">
                        <td>{{c.constructor_name}}</td>
                        <td>{{c.country}}</td>
                        <td>{{c.main_office}}</td>
                        <td><a :href="c.url" class="link-light" target="_blank">{{c.url}}</a></td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-dark table-hover" v-if="generalCircuits.length > 0">
                <thead>
                    <tr>
                        <th>Circuit</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>Length</th>
                        <th>Wikipedia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c of generalCircuits">
                        <td>{{c.circuit_name}}</td>
                        <td>{{c.country}}</td>
                        <td>{{c.city}}</td>
                        <td>{{c.length_in_km}}</td>
                        <td><a :href="c.url" class="link-light" target="_blank">{{c.url}}</a></td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-dark table-hover" v-if="generalRaces.length > 0">
                <thead>
                    <tr>
                        <th v-if="generalYear === ''">Year</th>
                        <th>Round</th>
                        <th>Race Date</th>
                        <th>Circuit</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>F1 Website</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r of generalRaces">
                        <td v-if="generalYear === ''">{{r.year}}</td>
                        <td>{{r.round}}</td>
                        <td>{{r.race_date}}</td>
                        <td>{{r.circuit_name}}</td>
                        <td>{{r.country}}</td>
                        <td>{{r.city}}</td>
                        <td><a :href="r.url" class="link-light" target="_blank">{{r.url}}</a></td>
                    </tr>
                </tbody>
            </table>
        </article>
    `,
    methods : {
        sendGeneralQuery: async function() {
            let apiURL = `/api/${this.generalInfo}?year=${this.generalYear}`;

            try {
                let resultResponse = await fetch(apiURL);
                if(resultResponse.status !== 200) throw new Error();
                let resultJson = await resultResponse.json();
                this.resetGeneralArrays();
                switch(this.generalInfo) {
                    case 'drivers' : this.generalDrivers = resultJson; break;
                    case 'constructors' : this.generalConstructors = resultJson; break;
                    case 'circuits' : this.generalCircuits = resultJson; break;
                    case 'races' : this.generalRaces = resultJson; break;
                }
            } catch(err) {
                console.log(`${err}`);
            }
        },
        resetGeneralArrays : function() {
            this.generalDrivers = [];
            this.generalConstructors = [];
            this.generalCircuits = [];
            this.generalRaces = [];
        }
    },
    watch: {
        generalYear: function (newVal, oldVal) {
            if(this.generalInfo !== '') {
                this.sendGeneralQuery();
            }
        },
        generalInfo: function (newVal, oldVal) {
            this.sendGeneralQuery();
        }
    }
}