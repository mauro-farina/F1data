export const ChampionshipBattleChart = {
    data : function() {
        return {
            chartData : {},
            chartID : null,
            championshipYear : ''
        }
    },
    template : `
        <section class="container my-3">
            <div class="form-floating col-sm-3 col-md-3 mb-3">
                <select class="form-select bg-dark" id="floatingYear" v-model="championshipYear">
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>
                <label for="floatingYear">Year</label>
            </div>
            <div>
                <canvas id="championshipChart" class="mx-1"></canvas>
            </div>
        </section>
    `,
    watch: {
        championshipYear: function (newVal, oldVal) {
            if(this.chartID != null){
                this.chartID.destroy();
             }
            this.getChartData();
        },
        chartData: function (newVal, oldVal) {
            this.loadChart();
        }
    },
    methods : {
        loadChart: function() {
            const ctx = document.getElementById('championshipChart');
            this.chartID = new Chart(ctx, {
                type: 'line',
                data: this.chartData,
                options: {
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: 'snow'
                            },
                            title: {
                                text: 'Drivers',
                                display: true,
                                color: 'snow'
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: "snow",
                            },
                            title: {
                                text: 'Points',
                                display: true,
                                color: 'snow'
                            }
                        },
                        x: {
                            beginAtZero: true,
                            ticks: {
                                color: "snow",
                            },
                            title: {
                                text: 'Round',
                                display: true,
                                color: 'snow'
                            }
                        }
                    }
                }
            });
        },
        getChartData: async function() {           
            let driversQuery = await fetch(`/api/${this.championshipYear}/drivers`);
            let racesQuery = await fetch(`/api/${this.championshipYear}/races`);

            if (driversQuery.status !== 200
                || racesQuery.status !== 200) {

                throw new Error();
            }

            let drivers = await driversQuery.json();
            let races = await racesQuery.json();
            let standings = [];

            const numRaces = races.length;

            let standingsApiUrls = [];
            for (let race of races) {
                standingsApiUrls.push(`/api/${this.championshipYear}/${race.round}/driver_standings`);
            }
            let fetchAllStandings = await this.fetchUrlsInOrder(standingsApiUrls);
            for(let singleStandings of fetchAllStandings) {
                standings.push.apply(standings, singleStandings);
            }
            
            const CHART_COLORS = {
                red: 'rgb(255, 99, 132)',
                orange: 'rgb(255, 159, 64)',
                yellow: 'rgb(255, 205, 86)',
                green: 'rgb(75, 192, 192)',
                blue: 'rgb(54, 162, 235)',
                purple: 'rgb(153, 102, 255)',
                grey: 'rgb(201, 203, 207)',
                pink: 'rgb(255, 192, 203)',
                teal: 'rgb(0, 128, 128)',
                lime: 'rgb(0, 255, 0)',
                cyan: 'rgb(0, 255, 255)',
                indigo: 'rgb(75, 0, 130)',
                magenta: 'rgb(255, 0, 255)',
                gold: 'rgb(255, 215, 0)',
                maroon: 'rgb(128, 0, 0)',
                navy: 'rgb(0, 0, 128)',
                olive: 'rgb(128, 128, 0)',
                pink: 'rgb(255, 192, 203)',
                salmon: 'rgb(250, 128, 114)',
                sienna: 'rgb(160, 82, 45)',
                skyBlue: 'rgb(135, 206, 235)',
                tan: 'rgb(210, 180, 140)',
                tomato: 'rgb(255, 99, 71)',
            };

            let datasets = [];
            let count = 0;
            for (let driver of drivers) {
                const datasetElement = {
                    label: driver.driver_name,
                    data: this.zeroPadArray(_.filter(standings, { driver_id: driver.driver_id }).map(s => s.points), numRaces),
                    borderColor: CHART_COLORS[count],
                    backgroundColor: CHART_COLORS[count],
                    hidden: Math.round(Math.random())
                };
                count++;
                datasets.push(datasetElement);
            }

            this.chartData = {
                labels: races.map(r => r.round),
                datasets: datasets
            };
        },
        zeroPadArray: function (arr, desiredLength) {
            while (arr.length < desiredLength) {
                arr.unshift(0);
            }
            return arr;
        },
        fetchUrlsInOrder: async function (urls) {
            const fetchPromises = urls.map(url => fetch(url).then(response => response.json()).then(res => res.driver_standings));
            const results = await Promise.all(fetchPromises);
            return results;
          }
    }
};