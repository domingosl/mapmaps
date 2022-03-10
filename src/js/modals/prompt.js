const Swal = require('sweetalert2');

module.exports.show = async (message) => {


    const { value } = await Swal.fire({
        title: 'New Flow',
        allowEnterKey: false,
        html: `      
      <p>` + message + `</p>
      <input id="prompt-modal-value" type="text" class="swal2-input" placeholder="" maxlength="25">
      
    `,
        preConfirm: async () => {
            const el = Swal.getPopup().querySelector('#prompt-modal-value');
            return el.value;
        },
        confirmButtonText: 'ok',
        focusConfirm: false
    });

    return value;

};
