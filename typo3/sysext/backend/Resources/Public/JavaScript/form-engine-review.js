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
import"bootstrap";import DocumentService from"@typo3/core/document-service.js";import{selector}from"@typo3/core/literals.js";import"@typo3/backend/element/icon-element.js";import Popover from"@typo3/backend/popover.js";import{Tab as BootstrapTab}from"bootstrap";export class FormEngineReview{constructor(e){this.formElement=e,this.toggleButtonClass="t3js-toggle-review-panel",this.labelSelector=".t3js-formengine-label",this.invalidFields=new Set,this.initialize()}initialize(){this.formElement.addEventListener("t3-formengine-postfieldvalidation",(e=>{const t=e.detail.field;e.detail.isValid?this.invalidFields.delete(t):this.invalidFields.add(t),this.checkForReviewableField()})),DocumentService.ready().then((()=>{this.attachButtonToModuleHeader(),this.checkForReviewableField()}))}attachButtonToModuleHeader(){const e=document.querySelector(".t3js-module-docheader-bar-buttons").lastElementChild.querySelector('[role="toolbar"]'),t=document.createElement("typo3-backend-icon");t.setAttribute("identifier","actions-info"),t.setAttribute("size","small");const o=document.createElement("button");o.type="button",o.classList.add("btn","btn-danger","btn-sm","hidden",this.toggleButtonClass),o.title=TYPO3.lang["buttons.reviewFailedValidationFields"],o.appendChild(t),Popover.popover(o),e.prepend(o)}checkForReviewableField(){const e=document.querySelector("."+this.toggleButtonClass);if(null!==e)if(this.invalidFields.size>0){const t=document.createElement("div");t.classList.add("list-group");for(const e of this.invalidFields){const o=e.closest(".t3js-formengine-validation-marker");if(null===o)throw console.error(e),new Error("Could not find an element containing the `t3js-formengine-validation-marker` class for the previously logged input field.");const i=o.querySelector("[data-formengine-validation-rules]");if(null===i)throw console.error(o),new Error("Could not find an element containing the `data-formengine-validation-rules` attribute for the previously logged container.");const n=document.createElement("a");n.classList.add("list-group-item"),n.href="#",n.textContent=o.querySelector(this.labelSelector)?.textContent||"",n.addEventListener("click",(e=>this.switchToField(e,i))),t.append(n)}e.classList.remove("hidden"),Popover.setOptions(e,{html:!0,content:t})}else e.classList.add("hidden"),Popover.hide(e)}switchToField(e,t){e.preventDefault();let o=t;for(;o;){if(o.matches('[id][role="tabpanel"]')){const e=document.querySelector(selector`[aria-controls="${o.id}"]`);new BootstrapTab(e).show()}o=o.parentElement}t.focus()}}