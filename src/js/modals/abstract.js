const Swal = require('sweetalert2');
const Noty = require('noty');

class Modal {

    constructor() {

    }

    static Alert(type, message, title = '...') {

        Swal.fire({
            icon: type,
            title: title,
            text: message
        })

    }

    static Toast(type, message, timeout = 1500) {


        new Noty({
            type: type,
            layout: 'topRight',
            text: message,
            timeout,
            theme: 'sunset'
        }).show();

    }

}

module.exports = Modal;