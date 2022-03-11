const axios = require('axios');
const blockingLoader = require('./blocking-loader');
const selectNodeModal = require('../js/modals/select-node');

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Underline from "@editorjs/underline";
import Table from "@editorjs/table";
import Delimiter from "@editorjs/delimiter";

angular.module('network', []).controller('main', async function ($scope, $timeout) {

    blockingLoader.show();
    blockingLoader.setProgress(0);

    $scope.drawPanelIsOpen = false;
    $scope.nodePanelIsOpen = false;

    $scope.toggleDrawOptionsPanel = () => {
        $scope.drawPanelIsOpen = !$scope.drawPanelIsOpen;
    };

    let nodeEditor;

    $scope.closeNodeOptionsPanel = () => {
        $scope.nodePanelIsOpen = false;
        nodeEditor.destroy();
    };

    $scope.openNodeOptionsPanel = async (nodeId) => {

        blockingLoader.show();

        const response = (await axios.get(process.env.API_BASEURL + '/nodes/' + nodeId)).data.data;

        $scope.formData.nodeId = nodeId;
        $scope.formData.nodeTitle = response.name;
        $scope.formData.nodeConnections = [];

        console.log(response);

        nodeEditor = new EditorJS({
            autofocus: true,
            data: JSON.parse(response.content),
            holder: "node-editor",
            onReady: () => {
            },
            tools: {
                header: Header,
                list: List,
                underline: Underline,
                delimiter: Delimiter,
                table: Table
            }
        });


        $timeout(()=> $scope.nodePanelIsOpen = true, 0);


        blockingLoader.hide();

    };

    $scope.saveNode = async () => {

        blockingLoader.show();
        await axios.put(process.env.API_BASEURL + '/nodes/' + $scope.formData.nodeId, {
            name: $scope.formData.nodeTitle,
            content: JSON.stringify(await nodeEditor.save())
        });
        blockingLoader.hide();

        $timeout($scope.closeNodeOptionsPanel, 0);

    };

    $scope.addNodeConnection = (direction) => {

        selectNodeModal.show(null, (node)=>{

            $timeout(()=>{
                $scope.formData.nodeConnections.push({
                    from: direction === 'from' ? $scope.formData.nodeTitle : node,
                    to: direction === 'to' ? $scope.formData.nodeTitle : node,
                    type: ''
                })
            });

        })


    };

    const response = (await axios.get(process.env.API_BASEURL + '/networks/' + window.network)).data.data;

    const nodes = new vis.DataSet(response.nodes);
    const edges = new vis.DataSet(response.edges);

    const container = document.getElementById("network");

    const data = {
        nodes: nodes,
        edges: edges,
    };

    let network;
    const options = JSON.parse(window.options);

    $scope.formData = { options };
    $scope.formData.edgesLabel = !!$scope.formData.options.edges.font.size;

    function draw() {

        network = new vis.Network(container, data, $scope.formData.options);

        network.on("stabilizationProgress", function (params) {
            blockingLoader.setProgress(Math.round(100 * params.iterations / params.total));
        });

        network.once("stabilizationIterationsDone", function () {
            blockingLoader.hide();
        });

        network.on("selectNode", function (event) {
            console.log(event.nodes);
            $timeout(() => $scope.openNodeOptionsPanel(event.nodes[0]), 0);
        });

    }

    draw();

    $scope.redrawNetwork = () => $timeout(draw, 0);

    $scope.toggleEdgesLabel = () => $scope.formData.options.edges.font.size = $scope.formData.edgesLabel ? 15 : 0;


});

