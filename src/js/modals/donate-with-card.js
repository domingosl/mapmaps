const axios = require('axios');
const Swal = require('sweetalert2');
const blockingLoader = require('../../js/blocking-loader');
const abstractModal = require("../../js/modals/abstract");


module.exports.show = async (amount) => {

    return await Swal.fire({
        title: 'Donate',
        html: `<form id="donate-form">

       <h1>` + amount/100 + ` €</h1>
      <input type="text" id="contact-anem" class="swal2-input" name="name" placeholder="name">
      <label class="form-error" data-error="name"></label>
      
      <input type="text" id="contact-surname" class="swal2-input" name="surname" placeholder="surname">
      <label class="form-error" data-error="surname"></label>
      
      <input type="email" id="contact-email" class="swal2-input" name="email" placeholder="email">
      <label class="form-error" data-error="email"></label>
      
      
      </form>
    `,
        confirmButtonText: 'Pay with credit card',
        focusConfirm: false,
        preConfirm: async () => {


            blockingLoader.show();

            const formData = new FormData(Swal.getPopup().querySelector('#donate-form'));

            const payload = {
                name: formData.get('name'),
                surname: formData.get('surname'),
                email: formData.get('email'),
                amount,
                returnURL: window.location.href + "?from_transaction=true"
            };

            Swal.getPopup()
                .querySelectorAll("[data-error]")
                .forEach(errEl => errEl.innerText = "")

            try {
                const response = (await axios.post(process.env.API_BASEURL + '/pay/card', payload)).data;
                window.location = response.data.redirectURL;
            } catch (e) {
                blockingLoader.hide();

                if(e.response && e.response.data && e.response.data.code === 403)
                    abstractModal.Alert('warning', e.response.data.message, 'Error');


            }


        }
    });


};
