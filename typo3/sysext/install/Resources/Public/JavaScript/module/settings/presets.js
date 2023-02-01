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
import"bootstrap";import $ from"jquery";import{AbstractInteractableModule}from"@typo3/install/module/abstract-interactable-module.js";import Modal from"@typo3/backend/modal.js";import Notification from"@typo3/backend/notification.js";import AjaxRequest from"@typo3/core/ajax/ajax-request.js";import Router from"@typo3/install/router.js";class Presets extends AbstractInteractableModule{constructor(){super(...arguments),this.selectorActivateTrigger=".t3js-presets-activate",this.selectorImageExecutable=".t3js-presets-image-executable",this.selectorImageExecutableTrigger=".t3js-presets-image-executable-trigger"}initialize(e){this.currentModal=e,this.getContent(),e.on("click",this.selectorImageExecutableTrigger,(e=>{e.preventDefault(),this.getCustomImagePathContent()})),e.on("click",this.selectorActivateTrigger,(e=>{e.preventDefault(),this.activate()})),e.find(".t3js-custom-preset").on("input",".t3js-custom-preset",(e=>{$("#"+$(e.currentTarget).data("radio")).prop("checked",!0)}))}getContent(){const e=this.getModalBody();new AjaxRequest(Router.getUrl("presetsGetContent")).get({cache:"no-cache"}).then((async t=>{const s=await t.resolve();!0===s.success&&"undefined"!==s.html&&s.html.length>0?(e.empty().append(s.html),Modal.setButtons(s.buttons)):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(t=>{Router.handleAjaxError(t,e)}))}getCustomImagePathContent(){const e=this.getModalBody(),t=this.getModuleContent().data("presets-content-token");new AjaxRequest(Router.getUrl()).post({install:{token:t,action:"presetsGetContent",values:{Image:{additionalSearchPath:this.findInModal(this.selectorImageExecutable).val()}}}}).then((async t=>{const s=await t.resolve();!0===s.success&&"undefined"!==s.html&&s.html.length>0?e.empty().append(s.html):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(t=>{Router.handleAjaxError(t,e)}))}activate(){this.setModalButtonsState(!1);const e=this.getModalBody(),t=this.getModuleContent().data("presets-activate-token"),s={};for(let e of this.findInModal("form").serializeArray())s[e.name]=e.value;s["install[action]"]="presetsActivate",s["install[token]"]=t,new AjaxRequest(Router.getUrl()).post(s).then((async e=>{const t=await e.resolve();!0===t.success&&Array.isArray(t.status)?t.status.forEach((e=>{Notification.showMessage(e.title,e.message,e.severity)})):Notification.error("Something went wrong","The request was not processed successfully. Please check the browser's console and TYPO3's log.")}),(t=>{Router.handleAjaxError(t,e)})).finally((()=>{this.setModalButtonsState(!0)}))}}export default new Presets;