export const DatasetFolder = {
    data: function () {
        return {
            datasetFiles : [],
        }
    },
    template: `
    <div class="container my-3">
        <p><a class="link-light" href="/#/datasetDocs">Go back to the website</a></p> 
        <p>Click on a link to download the respective csv file</p>
        <table class="table">
            <thead>
                <th>Filename</th>
                <th>Size</th>
                <th>Last Modified</th>
            </thead>
            <tbody>
                <tr v-for="file of datasetFiles">
                    <td>
                        <a class="text-dark-emphasis" href="'/dataset/'.concat(file.filename)">{{file.filename}}</a>
                    </td>
                    <td>{{file.size_in_byte}} bytes</td>
                    <td>{{file.last_modified}}</td>
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
    }
}