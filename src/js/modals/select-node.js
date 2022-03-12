const Swal = require('sweetalert2');
const axios = require("axios");

module.exports.show = async (universe, title, cb) => {


    await Swal.fire({
        title,
        allowEnterKey: false,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        html: `      
        <p>Type the name of the node</p>
        <input id="node-autocomplete" type="search" dir="ltr" spellcheck=false autocorrect="off" autocomplete="off" autocapitalize="off">

    `,
        didRender: async () => {

            const autoCompleteJS = new autoComplete({
                selector: '#node-autocomplete',
                placeHolder: "Search for node name...",
                data: {
                    src: async (val) => {
                        const response = await axios.get(process.env.API_BASEURL + '/nodes/search/' + val);
                        return response.data.data;
                    },
                    cache: false,
                    keys: ['label'],
                },
                debounce: 100,
                resultItem: {
                    element: (item, data)=>{
                        item.innerHTML = data.match;
                    },
                    highlight: {
                        render: true
                    }
                },
                events: {
                    input: {
                        selection: (event) => {
                            autoCompleteJS.input.value = event.detail.selection.value;
                            cb(event.detail.selection.value);
                            Swal.close();
                        }
                    }
                }
            });



        }
    });

};
