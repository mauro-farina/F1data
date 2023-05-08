import {ApiDocs} from './vueComponents/apiDocs.js';
import {DatasetDocs} from './vueComponents/datasetDocs.js';
import {DatasetFolder} from './vueComponents/datasetFolder.js';
import {DatabaseQueryInterface} from './vueComponents/dbQueryInterface.js';
import {GeneralInfoQueryInterface} from './vueComponents/generalInfoQueryInterface.js';
import {RaceInfoQueryInterface} from './vueComponents/raceInfoQueryInterface.js';4
import {RaceLapTimesQueryInterface} from './vueComponents/raceLapTimesQueryInterface.js';
import {ChampionshipBattleChart} from './vueComponents/championshipBattle.js';

const { createApp } = Vue;

const app = createApp({
    data : function() { 
        return {
            currentPath: window.location.hash,
        };
    },
    mounted: async function () {
        window.addEventListener('hashchange', () => {
            this.currentPath = window.location.hash;
        });
    }
});

app.component("ApiDocs", ApiDocs);
app.component("DatasetDocs", DatasetDocs);
app.component("DatasetFolder", DatasetFolder);
app.component("DatabaseQueryInterface", DatabaseQueryInterface);
app.component("GeneralInfoQueryInterface", GeneralInfoQueryInterface);
app.component("RaceInfoQueryInterface", RaceInfoQueryInterface);
app.component("RaceLapTimesQueryInterface", RaceLapTimesQueryInterface);
app.component("ChampionshipBattleChart", ChampionshipBattleChart);


app.mount("#app");