import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Underline from "@editorjs/underline";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";

const blockingLoader = require('./blocking-loader');

angular.module('node', []).controller('main', [ '$scope', '$timeout' ,async function ($scope, $timeout) {


    blockingLoader.show();

    $scope.formData = { node: JSON.parse(atob(window.nodeData)) };

    $scope.formData.node.content = JSON.parse($scope.formData.node.content);
    console.log($scope.formData);

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

}]);