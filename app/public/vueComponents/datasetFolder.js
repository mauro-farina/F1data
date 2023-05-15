export const DatasetFolder = {
    data: function () {
        return {
            datasetFiles : [],
        }
    },
    template: `
    <div class="container my-3">
        <p>Click on a link to download the respective <em>csv</em> file</p>
        <table class="table table-hover">
            <thead>
                <th>Filename</th>
                <th>Size</th>
                <th>Last Modified</th>
            </thead>
            <tbody>
                <tr v-for="file of datasetFiles">
                    <td>
                        <a class="text-dark-emphasis" :href="'/api/dataset/'.concat(file.filename)">{{file.filename}}</a>
                    </td>
                    <td>{{byteToKB(file.size_in_byte)}}</td>
                    <td>{{convertDate(file.last_modified)}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    async mounted() {
        try {
            this.datasetFiles = await (await fetch('/api/dataset')).json();
        } catch(err) {
            // ...
        }
    },
    methods: {
        convertDate: function(fullDate) {
            const dateSplit = fullDate.split('T');
            const dateYYYYMMDD = dateSplit[0].split('-');
            let reformatDate = dateYYYYMMDD[2] + "/" + dateYYYYMMDD[1] + "/" + dateYYYYMMDD[0];
            let reformatTime = dateSplit[1].split('.')[0] + " GMT";
            return reformatDate + " " + reformatTime;
        },
        byteToKB: function(sizeB) {
            if (sizeB < 1024 * 1024) {
                return Math.round((sizeB / 1024) * 10) / 10 + " KB";
            } else {
                return Math.round((sizeB / (1024 * 1024)) * 10) / 10 + " MB";
            }
        }
    }
}