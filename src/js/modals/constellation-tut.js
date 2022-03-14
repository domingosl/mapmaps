const Swal = require('sweetalert2');

module.exports.show = async () => {

    const ignoreConstTut = localStorage.getItem("ignoreConstTut") || "false";

    if(ignoreConstTut === 'true')
        return;

    await Swal.fire({
        title: 'How to use it',
        html: `
        <div class="tut-modal">
            <ul>
                <li><span class="tut-icon mouse-wheel"></span> Mouse wheel to zoom in and out</li>
                <li><span class="tut-icon double-click-empty"></span> Double click on empty space to add a node</li>
                <li><span class="tut-icon double-click-node"></span> Double click on a node to edit</li>
            </ul>
        </div>
        `,
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'Got it, dont show this again',
        allowEnterKey: false,
        preConfirm: () => {
            localStorage.setItem("ignoreConstTut", "true");
        }
    });

};

