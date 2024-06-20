import { createElement } from "lwc";
import Todo from "c/todo";
import getAllTasks from "@salesforce/apex/ToDoService.getAllTasks";
import createTask from "@salesforce/apex/ToDoService.createTask";

const mockTasks = require("./data/tasks.json");
const showToastEventName = 'lightning__showtoast';

// Mock getAllTasks imperative apex call
jest.mock(
  "@salesforce/apex/ToDoService.getAllTasks",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

// Mock createTask apex wire adapter
jest.mock(
    '@salesforce/apex/ToDoService.createTask',
    () => {
      const {createApexTestWireAdapter} = require('@salesforce/sfdx-lwc-jest');
      // Return a new, unused mock function
      return {default: createApexTestWireAdapter(jest.fn())};
    },
    // Indicates that this mock is for a module that doesn't exist anywhere in
    // the system
    {virtual: true});

describe("c-todo", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("fetches task data from wire apex method and displays open tasks by default", async () => {
    // Arrange
    const element = createElement("c-todo", {
      is: Todo
    });

    // Add the component to the DOM
    document.body.appendChild(element);

    let spinner = element.shadowRoot.querySelector("lightning-spinner");
    let lightningTabSet =
      element.shadowRoot.querySelectorAll("lightning-tabset");
    let lightningTabs = element.shadowRoot.querySelectorAll("lightning-tab");
    let todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    // Assert
    expect(spinner).not.toBeNull();
    expect(spinner.alternativeText).toBe("Loading");
    expect(lightningTabSet).not.toBeNull();
    expect(lightningTabSet.length).toBe(1);
    expect(lightningTabs).not.toBeNull();
    expect(lightningTabs.length).toBe(3);
    expect(todoItems.length).toBe(0);

    // Emit data from @wire
    getAllTasks.emit(mockTasks);

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    spinner = element.shadowRoot.querySelector("lightning-spinner");
    todoItems = element.shadowRoot.querySelectorAll("c-todo-item");
    const lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
    const input = element.shadowRoot.querySelectorAll("input");

    // Assert
    expect(spinner).toBeNull();
    expect(todoItems).not.toBeNull();
    expect(todoItems.length).toBe(2);
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(input).not.toBeNull();
  });

  it("throws error provisioning task data from wire apex method", async () => {
    // Arrange
    const element = createElement("c-todo", {
      is: Todo
    });

    // Add the component to the DOM
    document.body.appendChild(element);

    // Mock handler for toast event
    const toastHandler = jest.fn();
    // Add event listener to catch toast event
    element.addEventListener(showToastEventName, toastHandler);

    let spinner = element.shadowRoot.querySelector("lightning-spinner");
    let lightningTabSet =
      element.shadowRoot.querySelectorAll("lightning-tabset");
    let lightningTabs = element.shadowRoot.querySelectorAll("lightning-tab");
    let todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    // Assert
    expect(spinner).not.toBeNull();
    expect(spinner.alternativeText).toBe("Loading");
    expect(lightningTabSet).not.toBeNull();
    expect(lightningTabSet.length).toBe(1);
    expect(lightningTabs).not.toBeNull();
    expect(lightningTabs.length).toBe(3);
    expect(todoItems.length).toBe(0);

    // Emit data from @wire
    getAllTasks.error({ "error": { "body": { "message": "Failed to get Tasks!" } } });

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    spinner = element.shadowRoot.querySelector("lightning-spinner");
    const lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
    const input = element.shadowRoot.querySelectorAll("input");

    // Assert
    expect(spinner).toBeNull();
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(true);
    expect(input).not.toBeNull();
    expect(toastHandler).toHaveBeenCalled();
    expect(toastHandler.mock.calls[0][0].detail.title).toBe('Something went wrong!');
    expect(toastHandler.mock.calls[0][0].detail.message)
        .toBe('Encountered an error fetching Tasks. Refresh the page and try again.');
    expect(toastHandler.mock.calls[0][0].detail.variant).toBe('error');
  });

  it("add a new task", async () => {
    // Arrange
    const element = createElement("c-todo", {
      is: Todo
    });

    // Add the component to the DOM
    document.body.appendChild(element);

    // Emit data from @wire
    getAllTasks.emit(mockTasks);

    // Mock imperative apex call
    createTask.mockResolvedValue();

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    let input = element.shadowRoot.querySelectorAll("input");

    // Assert
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);

    // Mock onblur event with empty string
    input[0].value = '';
    input[0].dispatchEvent(new CustomEvent("blur"));

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    let lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(true);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('');

    // Mock onclick event with empty string
    input[0].click();

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(false);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('');

    // Mock onchange event with a empty string
    input[0].value = '';
    input[0].dispatchEvent(new CustomEvent("change"));

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(false);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('');

    // Mock onclick event with a empty string
    input[0].click();

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(false);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('');

    // Mock onclick event with empty string
    lightningButtonIcon[0].click();

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(true);
  });

  it("add a new task with a non-empty value", async () => {
    // Arrange
    const element = createElement("c-todo", {
      is: Todo
    });

    // Add the component to the DOM
    document.body.appendChild(element);

    // Emit data from @wire
    getAllTasks.emit(mockTasks);

    // Mock imperative apex call
    createTask.mockResolvedValue();

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    let input = element.shadowRoot.querySelectorAll("input");

    // Assert
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);

    // Mock onclick event with a non-empty value
    input[0].click();

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    let lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(false);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('');

    // Mock onblur event with a non-empty value
    input[0].value = 'Learn to write Jest test';
    input[0].dispatchEvent(new CustomEvent("blur"));

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(false);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('Learn to write Jest test');

    // Mock onchange event with a non-empty value
    input[0].value = 'Learn to write Jest test';
    input[0].dispatchEvent(new CustomEvent("change"));

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(false);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('Learn to write Jest test');

    // Mock onclick event with non-empty value
    lightningButtonIcon[0].click();

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    input = element.shadowRoot.querySelectorAll("input");
    lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

    // Assert
    expect(lightningButtonIcon).not.toBeNull();
    expect(lightningButtonIcon.length).toBe(1);
    expect(lightningButtonIcon[0].iconName).toBe('utility:new');
    expect(lightningButtonIcon[0].disabled).toBe(true);
    expect(input).not.toBeNull();
    expect(input.length).toBe(1);
    expect(input[0].value).toBe('');
  });

  it("changes tab to completed and displays completed tasks", async () => {
    // Arrange
    const element = createElement("c-todo", {
      is: Todo
    });

    // Add the component to the DOM
    document.body.appendChild(element);

    let spinner = element.shadowRoot.querySelector("lightning-spinner");
    let lightningTabSet =
      element.shadowRoot.querySelectorAll("lightning-tabset");
    let lightningTabs = element.shadowRoot.querySelectorAll("lightning-tab");
    let todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    // Assert
    expect(spinner).not.toBeNull();
    expect(spinner.alternativeText).toBe("Loading");
    expect(lightningTabSet).not.toBeNull();
    expect(lightningTabSet.length).toBe(1);
    expect(lightningTabs).not.toBeNull();
    expect(lightningTabs.length).toBe(3);
    expect(todoItems.length).toBe(0);

    // Emit data from @wire
    getAllTasks.emit(mockTasks);

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    spinner = element.shadowRoot.querySelector("lightning-spinner");
    todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    // Assert
    expect(spinner).toBeNull();
    expect(todoItems).not.toBeNull();
    expect(todoItems.length).toBe(2);

    // Dispatch active event on 'Completed' tab
    lightningTabs[1].dispatchEvent(new CustomEvent("active"));

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    expect(todoItems.length).toBe(3);
  });

  it("changes tab to all and displays all tasks", async () => {
    // Arrange
    const element = createElement("c-todo", {
      is: Todo
    });

    // Add the component to the DOM
    document.body.appendChild(element);

    let spinner = element.shadowRoot.querySelector("lightning-spinner");
    let lightningTabSet =
      element.shadowRoot.querySelectorAll("lightning-tabset");
    let lightningTabs = element.shadowRoot.querySelectorAll("lightning-tab");
    let todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    // Assert
    expect(spinner).not.toBeNull();
    expect(spinner.alternativeText).toBe("Loading");
    expect(lightningTabSet).not.toBeNull();
    expect(lightningTabSet.length).toBe(1);
    expect(lightningTabs).not.toBeNull();
    expect(lightningTabs.length).toBe(3);
    expect(todoItems.length).toBe(0);

    // Emit data from @wire
    getAllTasks.emit(mockTasks);

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    spinner = element.shadowRoot.querySelector("lightning-spinner");
    todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    // Assert
    expect(spinner).toBeNull();
    expect(todoItems).not.toBeNull();
    expect(todoItems.length).toBe(2);

    // Dispatch active event on 'Completed' tab
    lightningTabs[2].dispatchEvent(new CustomEvent("active"));

    // Wait for any asynchronous DOM updates. This is
    // needed for promise timing when calling imperative Apex or wire
    // services.
    await new Promise(process.nextTick);

    todoItems = element.shadowRoot.querySelectorAll("c-todo-item");

    expect(todoItems.length).toBe(5);
  });
});
