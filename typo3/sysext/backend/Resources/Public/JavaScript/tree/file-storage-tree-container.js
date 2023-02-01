/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __decorate=function(e,t,o,r){var i,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,r);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(n<3?i(a):n>3?i(t,o,a):i(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};import{html,LitElement}from"lit";import{customElement,query}from"lit/decorators.js";import{FileStorageTree}from"@typo3/backend/tree/file-storage-tree.js";import"@typo3/backend/element/icon-element.js";import Persistent from"@typo3/backend/storage/persistent.js";import ContextMenu from"@typo3/backend/context-menu.js";import{DragDrop,DraggablePositionEnum}from"@typo3/backend/tree/drag-drop.js";import Modal from"@typo3/backend/modal.js";import Severity from"@typo3/backend/severity.js";import Notification from"@typo3/backend/notification.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import{ModuleStateStorage}from"@typo3/backend/storage/module-state-storage.js";import{getRecordFromName}from"@typo3/backend/module.js";export const navigationComponentName="typo3-backend-navigation-component-filestoragetree";let EditableFileStorageTree=class extends FileStorageTree{constructor(){super(),this.actionHandler=new FileStorageTreeActions(this)}updateNodeBgClass(e){return super.updateNodeBgClass.call(this,e).call(this.initializeDragForNode())}nodesUpdate(e){return super.nodesUpdate.call(this,e).call(this.initializeDragForNode())}initializeDragForNode(){return this.actionHandler.connectDragHandler(new FileStorageTreeNodeDragHandler(this,this.actionHandler))}};EditableFileStorageTree=__decorate([customElement("typo3-backend-navigation-component-filestorage-tree")],EditableFileStorageTree);let FileStorageTreeNavigationComponent=class extends LitElement{constructor(){super(...arguments),this.refresh=()=>{this.tree.refreshOrFilterTree()},this.selectFirstNode=()=>{const e=this.tree.nodes[0];e&&this.tree.selectNode(e,!0)},this.treeUpdateRequested=e=>{const t=encodeURIComponent(e.detail.payload.identifier);let o=this.tree.nodes.filter((e=>e.identifier===t))[0];o&&0===this.tree.getSelectedNodes().filter((e=>e.identifier===o.identifier)).length&&this.tree.selectNode(o,!1)},this.toggleExpandState=e=>{const t=e.detail.node;t&&Persistent.set("BackendComponents.States.FileStorageTree.stateHash."+t.stateIdentifier,t.expanded?"1":"0")},this.loadContent=e=>{const t=e.detail.node;if(!t?.checked)return;if(ModuleStateStorage.update("file",t.identifier,!0),!1===e.detail.propagate)return;const o=top.TYPO3.ModuleMenu.App;let r=getRecordFromName(o.getCurrentModule()).link;r+=r.includes("?")?"&":"?",top.TYPO3.Backend.ContentContainer.setUrl(r+"id="+t.identifier)},this.showContextMenu=e=>{const t=e.detail.node;t&&ContextMenu.show(t.itemType,decodeURIComponent(t.identifier),"tree","","",this.tree.getElementFromNode(t))},this.selectActiveNode=e=>{const t=ModuleStateStorage.current("file").selection;let o=e.detail.nodes;e.detail.nodes=o.map((e=>(e.identifier===t&&(e.checked=!0),e)))}}connectedCallback(){super.connectedCallback(),document.addEventListener("typo3:filestoragetree:refresh",this.refresh),document.addEventListener("typo3:filestoragetree:selectFirstNode",this.selectFirstNode),document.addEventListener("typo3:filelist:treeUpdateRequested",this.treeUpdateRequested)}disconnectedCallback(){document.removeEventListener("typo3:filestoragetree:refresh",this.refresh),document.removeEventListener("typo3:filestoragetree:selectFirstNode",this.selectFirstNode),document.removeEventListener("typo3:filelist:treeUpdateRequested",this.treeUpdateRequested),super.disconnectedCallback()}createRenderRoot(){return this}render(){const e={dataUrl:top.TYPO3.settings.ajaxUrls.filestorage_tree_data,filterUrl:top.TYPO3.settings.ajaxUrls.filestorage_tree_filter,showIcons:!0};return html`
      <div id="typo3-filestoragetree" class="svg-tree">
        <div>
          <typo3-backend-tree-toolbar .tree="${this.tree}" id="filestoragetree-toolbar" class="svg-toolbar"></typo3-backend-tree-toolbar>
          <div class="navigation-tree-container">
            <typo3-backend-navigation-component-filestorage-tree id="typo3-filestoragetree-tree" class="svg-tree-wrapper" .setup=${e}></typo3-backend-navigation-component-filestorage-tree>
          </div>
        </div>
        <div class="svg-tree-loader">
          <typo3-backend-icon identifier="spinner-circle-light" size="large"></typo3-backend-icon>
        </div>
      </div>
    `}firstUpdated(){this.toolbar.tree=this.tree,this.tree.addEventListener("typo3:svg-tree:expand-toggle",this.toggleExpandState),this.tree.addEventListener("typo3:svg-tree:node-selected",this.loadContent),this.tree.addEventListener("typo3:svg-tree:node-context",this.showContextMenu),this.tree.addEventListener("typo3:svg-tree:nodes-prepared",this.selectActiveNode)}};__decorate([query(".svg-tree-wrapper")],FileStorageTreeNavigationComponent.prototype,"tree",void 0),__decorate([query("typo3-backend-tree-toolbar")],FileStorageTreeNavigationComponent.prototype,"toolbar",void 0),FileStorageTreeNavigationComponent=__decorate([customElement(navigationComponentName)],FileStorageTreeNavigationComponent);export{FileStorageTreeNavigationComponent};class FileStorageTreeActions extends DragDrop{isInSameParentNode(e,t){return e.stateIdentifier==t.stateIdentifier||e.parentsStateIdentifier[0]==t.stateIdentifier||t.parentsStateIdentifier.includes(e.stateIdentifier)}getDropCommandDetails(e,t){const o=this.tree.nodes,r=t.identifier;let i=this.tree.settings.nodeDragPosition,n=e||t;if(r===n.identifier)return null;if(i===DraggablePositionEnum.BEFORE){const t=o.indexOf(e),r=this.setNodePositionAndTarget(t);if(null===r)return null;i=r.position,n=r.target}return{node:t,identifier:r,target:n,position:i}}setNodePositionAndTarget(e){const t=this.tree.nodes,o=t[e].depth;e>0&&e--;const r=t[e].depth,i=this.tree.nodes[e];if(r===o)return{position:DraggablePositionEnum.AFTER,target:i};if(r<o)return{position:DraggablePositionEnum.INSIDE,target:i};for(let r=e;r>=0;r--){if(t[r].depth===o)return{position:DraggablePositionEnum.AFTER,target:this.tree.nodes[r]};if(t[r].depth<o)return{position:DraggablePositionEnum.AFTER,target:t[r]}}return null}updateStateOfHoveredNode(e){this.tree.settings.nodeDragPosition=!1,this.tree.hoveredNode&&this.tree.isOverSvg?e.isOver||this.isTheSameNode(this.tree.hoveredNode,e)||this.isInSameParentNode(e,this.tree.hoveredNode)?this.addNodeDdClass("nodrop"):(this.addNodeDdClass("ok-append"),this.tree.settings.nodeDragPosition=DraggablePositionEnum.INSIDE):this.addNodeDdClass("nodrop")}isDropAllowed(e,t){return!t.isOver&&(!this.isTheSameNode(e,t)&&!!this.tree.isOverSvg)}}class FileStorageTreeNodeDragHandler{constructor(e,t){this.dragStarted=!1,this.startPageX=0,this.startPageY=0,this.tree=e,this.actionHandler=t}onDragStart(e,t){return 0!==t.depth&&(this.startPageX=e.pageX,this.startPageY=e.pageY,this.dragStarted=!1,!0)}onDragOver(e,t){return!!this.actionHandler.isDragNodeDistanceMore(e,this)&&(this.dragStarted=!0,0!==t.depth&&(this.actionHandler.getDraggable()||this.actionHandler.createDraggableFromExistingNode(t),this.actionHandler.openNodeTimeout(),this.actionHandler.updateDraggablePosition(e),this.actionHandler.updateStateOfHoveredNode(t),!0))}onDrop(e,t){if(!this.dragStarted||0===t.depth)return!1;if(this.actionHandler.cleanupDrop(),this.actionHandler.isDropAllowed(this.tree.hoveredNode,t)){let e=this.actionHandler.getDropCommandDetails(this.tree.hoveredNode,t),o=e.position===DraggablePositionEnum.INSIDE?TYPO3.lang["mess.move_into"]:TYPO3.lang["mess.move_after"];o=o.replace("%s",e.node.name).replace("%s",e.target.name);const r=Modal.confirm(TYPO3.lang.move_folder,o,Severity.warning,[{text:TYPO3.lang["labels.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:TYPO3.lang["cm.copy"]||"Copy",btnClass:"btn-warning",name:"copy"},{text:TYPO3.lang["labels.move"]||"Move",btnClass:"btn-warning",name:"move"}]);r.addEventListener("button.clicked",(t=>{const o=t.target;"move"===o.name?this.sendChangeCommand("move",e):"copy"===o.name&&this.sendChangeCommand("copy",e),r.hideModal()}))}return!0}sendChangeCommand(e,t){let o={data:{}};if("copy"===e)o.data.copy=[],o.data.copy.push({data:decodeURIComponent(t.identifier),target:decodeURIComponent(t.target.identifier)});else{if("move"!==e)return;o.data.move=[],o.data.move.push({data:decodeURIComponent(t.identifier),target:decodeURIComponent(t.target.identifier)})}this.tree.nodesAddPlaceholder(),new AjaxRequest(top.TYPO3.settings.ajaxUrls.file_process).post(o).then((e=>e.resolve())).then((e=>{e&&e.hasErrors?(this.tree.errorNotification(e.messages,!1),this.tree.nodesContainer.selectAll(".node").remove(),this.tree.updateVisibleNodes(),this.tree.nodesRemovePlaceholder()):(e.messages&&e.messages.forEach((e=>{Notification.showMessage(e.title||"",e.message||"",e.severity)})),this.tree.refreshOrFilterTree())})).catch((e=>{this.tree.errorNotification(e,!0)}))}}