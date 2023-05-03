export const DatabaseQueryInterface = {
    props : {
        currentPath : String
    },
    data : function() {
        return {
            querySection : "generalInfo"
        }
    },
    template : `
    <section class="container my-3">

        <div class="form-floating col-sm-6 col-md-4 mb-3">
            <select class="form-select bg-dark" id="floatingQuerySection" v-model="querySection">
                <option value="generalInfo" default>General Information</option>
                <option value="raceInfo">Race-specific Information</option>
                <option value="lapTimes">Race Lap Times</option>
            </select>
            <label for="floatingQuerySection">Query Section</label>
        </div>

        <!-- GENERAL INFO -->
        <general-info-query-interface v-if="querySection === 'generalInfo'"></general-info-query-interface>

        <!-- RACE DATA -->
        <race-info-query-interface v-if="querySection === 'raceInfo'"></race-info-query-interface>
    
        <!-- RACE LAP TIMES -->
        <race-lap-times-query-interface v-if="querySection === 'lapTimes'"></race-lap-times-query-interface>

    </section>
    `
}