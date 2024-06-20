import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/**
 * Utility method to show a toast alert. Defaults to error toast. 'this' from
 * caller should be passed into this component.
 *
 * @param {string} message toast message
 * @param {string} title toast title
 * @param {string} variant toast variant. Accepts info, success, warning, error.
 * @param {LightningElement} thisArg 'this' from caller
 */
export const showToast =
    (thisArg, message, title = 'Something went wrong!', variant = 'error') => {
      console.log(message);
      const event = new ShowToastEvent({
        title,
        message,
        variant,
      });
      thisArg.dispatchEvent(event);
    };

export const TASK_TAB_SET = [{label: 'Open', value: 'Open', isActive: true, tasks: []}, {label: 'Completed', value: 'Completed', isActive: false, tasks: []}, {label: 'All', value: 'All', isActive: false, tasks: []}];   