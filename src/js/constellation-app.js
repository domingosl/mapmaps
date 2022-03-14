const axios = require('axios');
const blockingLoader = require('./blocking-loader');
const selectNodeModal = require('../js/modals/select-node');
const confirmModal = require('../js/modals/confirm-dialog');
const abstractModal = require('../js/modals/abstract');
const constellationTutModal = require('../js/modals/constellation-tut');
const helpers = require('../js/helpers');

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Underline from "@editorjs/underline";
import Table from "@editorjs/table";
import Delimiter from "@editorjs/delimiter";

import 'animate.css';

angular.module('constellation', []).controller('main', [ '$scope', '$timeout' ,async function ($scope, $timeout) {

    blockingLoader.show();
    blockingLoader.setProgress(0);

    $scope.drawPanelIsOpen = false;
    $scope.nodePanelIsOpen = false;

    $scope.toggleDrawOptionsPanel = () => {
        $scope.drawPanelIsOpen = !$scope.drawPanelIsOpen;
    };

    let nodeEditor;

    $scope.snapshot = () => {
        const canvas = document.getElementsByTagName('canvas')[0];
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = "constellapedia-snapshot.png";
        link.href = image;
        link.click();
    }

    $scope.jsonExport = () => {
        blockingLoader.show();
        window.location = process.env.API_BASEURL + '/constellations/' + window.constellation + "?download=json";
        blockingLoader.hide();
    }

    $scope.forkConstellation = () => {
        abstractModal.Alert("info", "We are still in this feature, stay tuned!", "Work in progress!");
    }

    $scope.closeNodeOptionsPanel = () => {
        $scope.nodePanelIsOpen = false;
        nodeEditor.destroy();
    };

    $scope.openNodeOptionsPanel = async (nodeId) => {

        blockingLoader.show();

        let content;

        if(nodeId) {

            const response = (await axios.get(process.env.API_BASEURL + '/nodes/' + nodeId)).data.data;

            $scope.formData.nodeId = nodeId;
            $scope.formData.nodeTitle = helpers.capitalize(response.name);
            $scope.formData.nodeEdges = response.edges;
            content = JSON.parse(response.content);
            $scope.formData.nodeType = response.type;
        }
        else {
            $scope.formData.nodeId = null;
            $scope.formData.nodeTitle = "";
            $scope.formData.nodeEdges = [];
            content = {};
        }



        nodeEditor = new EditorJS({
            autofocus: false,
            placeholder: "Tell the story of this node...",
            data: Object.keys(content).length === 0 ? null : content,
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

        if($scope.formData.nodeId)
            await axios.put(process.env.API_BASEURL + '/nodes/' + $scope.formData.nodeId, {
                name: $scope.formData.nodeTitle,
                content: JSON.stringify(await nodeEditor.save()),
                edges: $scope.formData.nodeEdges,
                constellation: window.constellation
            });
        else
            await axios.post(process.env.API_BASEURL + '/nodes/', {
                name: $scope.formData.nodeTitle,
                content: JSON.stringify(await nodeEditor.save()),
                edges: $scope.formData.nodeEdges,
                constellation: window.constellation,
                type: $scope.formData.nodeType
            });

        blockingLoader.hide();

        $timeout(()=>{ $scope.closeNodeOptionsPanel(); $scope.redrawConstellation(); }, 0);

    };

    $scope.deleteNode = () => {

        confirmModal.show(async ()=>{
            blockingLoader.show();
            await axios.delete(process.env.API_BASEURL + '/nodes/' + $scope.formData.nodeId);
            $scope.closeNodeOptionsPanel();
            $scope.redrawConstellation();
        });

    };

    $scope.removeEdge = async (index) => {
        $scope.formData.nodeEdges.splice(index, 1);
    };

    $scope.addNodeEdge = (direction) => {

        if(!$scope.formData.nodeTitle)
            return abstractModal.Toast('error', "A node title must be added first");

        selectNodeModal.show(window.constellation, direction === 'from' ? "To node" : "From node", (node)=>{

            $timeout(()=>{
                $scope.formData.nodeEdges.push({
                    from: direction === 'from' ? { name: $scope.formData.nodeTitle, id: $scope.formData.nodeId} : { id: node.id, name: node.label },
                    to: direction === 'to' ? { name: $scope.formData.nodeTitle, id: $scope.formData.nodeId} : { id: node.id, name: node.label },
                    type: 'IMPLIES_THAT'
                })
            });

        })


    };

    $scope.redrawConstellation = () => $timeout(draw, 0);

    $scope.toggleEdgesLabel = () => $scope.formData.options.edges.font.size = $scope.formData.edgesLabel ? 15 : 0;


    async function draw() {

        blockingLoader.show();

        $scope.drawPanelIsOpen = false;

        const response = (await axios.get(process.env.API_BASEURL + '/constellations/' + window.constellation)).data.data;

        const nodes = new vis.DataSet(response.nodes);
        const edges = new vis.DataSet(response.edges);

        const container = document.getElementById("constellation");

        const data = {
            nodes: nodes,
            edges: edges,
        };

        let constellation;

        if(!$scope.formData)
            $scope.formData = {};

        if(!$scope.formData.options)
            $scope.formData = { options: JSON.parse(atob(window.options)) };

        $scope.formData.edgesLabel = !!$scope.formData.options.edges.font.size;

        constellation = new vis.Network(container, data, $scope.formData.options);

        constellation.on("stabilizationProgress", function (params) {
            blockingLoader.setProgress(Math.round(100 * params.iterations / params.total));
        });

        constellation.once("stabilizationIterationsDone", function () {
            blockingLoader.hide();
        });

        constellation.once("afterDrawing", function () {
            blockingLoader.hide();
            constellationTutModal.show();
        });



        constellation.on("doubleClick", function (event) {
            if(!event.nodes[0])
                $timeout(() => $scope.openNodeOptionsPanel(), 0);
            else
                $timeout(() => $scope.openNodeOptionsPanel(event.nodes[0]), 0);
        });

    }

    draw();


}]);

