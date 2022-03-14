import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Underline from "@editorjs/underline";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";

const blockingLoader = require('./blocking-loader');
const donateWithCardModal = require('./modals/donate-with-card');
const abstractModal = require('./modals/abstract');

angular.module('node', []).controller('main', [ '$scope', '$timeout' ,async function ($scope, $timeout) {


    blockingLoader.show();

    $scope.formData = { node: JSON.parse(atob(window.nodeData)) };

    $scope.formData.node.content = JSON.parse($scope.formData.node.content);


    const nodeEditor = new EditorJS({
        autofocus: false,
        data: Object.keys($scope.formData.node.content).length === 0 ? null : $scope.formData.node.content,
        holder: "node-editor",
        readOnly: true,
        onReady() {
            blockingLoader.hide();
        },
        tools: {
            header: Header,
            list: List,
            underline: Underline,
            delimiter: Delimiter,
            table: Table
        }
    });


    $scope.donate = (amount) => {
        donateWithCardModal.show(amount);
    }

    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if(queryParams.from_transaction === "true") {
        //TODO: Needs check of the outcome
        abstractModal.Toast("info", "Thank you for your donation!", 10000);
    }

}]);