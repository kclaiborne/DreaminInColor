import { LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import createTask from "@salesforce/apex/ToDoService.createTask";
import getTasks from "@salesforce/apex/ToDoService.getAllTasks";
import editTask from "@salesforce/apex/ToDoService.editTask";
import deleteTask from "@salesforce/apex/ToDoService.deleteTask";
import markTaskComplete from "@salesforce/apex/ToDoService.markTaskComplete";
import { showToast, TASK_TAB_SET } from "./utils";

export default class Todo extends NavigationMixin(LightningElement) {
  activeTab = "Open";
  isAddTaskButtonDisabled = true;
  isLoading = true;
  newTask = "";
  tabs = TASK_TAB_SET;
  tasks = [];

  get openTasks() {
    return this.tasks.filter((task) => task.Status !== "Completed");
  }

  get hasOpenTasks() {
    return this.openTasks.length > 0;
  }

  get completedTasks() {
    return this.tasks.filter((task) => task.Status === "Completed");
  }

  get hasCompletedTasks() {
    return this.completedTasks.length > 0;
  }

  get allTasks() {
    return this.tasks;
  }

  get hasAllTasks() {
    return this.allTasks.length > 0;
  }

  get hasOpenTabActive() {
    return this.activeTab === "Open";
  }

  get hasCompletedTabActive() {
    return this.activeTab === "Completed";
  }

  get hasAllTabActive() {
    return this.activeTab === "All";
  }

  @wire(getTasks)
  wiredGetTasks(response) {
    this.refreshTasks = () => refreshApex(response);
    const { data, error } = response;
    if (data) {
      this.tasks = data;
      this.isLoading = false;
    } else if (error) {
      console.error(error);
      // Display Toast Notification
      showToast(this, "Encountered an error fetching Tasks. Refresh the page and try again.", "Something went wrong!");
      this.isLoading = false;
    }
  }

  createTask(newTaskName) {
    createTask({ subject: newTaskName })
      .then(() => {
        // Display Toast Notification
        showToast(this, "", "Created a new task!", "success");
        // Refresh Tasks data
        this.refreshTasks();
      })
      .catch((error) => {
        // Display Toast Notification
        showToast(
          this,
          "There was an error creating the task. Please try again!"
        );
        console.error(error);
      });
  }

  editTask(taskId, newTaskName) {
    editTask({ taskId, subject: newTaskName })
      .then(() => {
        // Display Toast Notification
        showToast(this, "", "The task was updated!", "success");
        // Refresh Tasks data
        this.refreshTasks();
      })
      .catch((error) => {
        // Display Toast Notification
        showToast(
          this,
          "There was an error updating the task. Please try again!"
        );
        console.error(error);
      });
  }

  deleteTask(taskId) {
    deleteTask({ taskId })
      .then(() => {
        // Display Toast Notification
        showToast(this, "", "The task was deleted!", "success");
        // Refresh Tasks data
        this.refreshTasks();
      })
      .catch((error) => {
        // Display Toast Notification
        showToast(
          this,
          "There was an error deleting the task. Please try again!"
        );
        console.error(error);
      });
  }

  markTaskComplete(taskId) {
    markTaskComplete({ taskId })
      .then(() => {
        // Display Toast Notification
        showToast(this, "", "The task was marked as completed!", "success");
        // Refresh Tasks data
        this.refreshTasks();
      })
      .catch((error) => {
        // Display Toast Notification
        showToast(
          this,
          "There was an error marking the task as completed. Please try again!"
        );
        console.error(error);
      });
  }

  async handleAction(event) {
    // Call respective Apex method based on the action type
    const action = event.detail.action;
    const taskId = event.detail.taskId;
    const newTaskName = event.detail.taskName;
    switch (action) {
      case "edit":
        await this.editTask(taskId, newTaskName);
        break;
      case "delete":
        await this.deleteTask(taskId);
        break;
      case "markComplete":
        await this.markTaskComplete(taskId);
        break;
      default:
        break;
    }
  }

  handleOnBlur(event) {
    const input = event.target.value;
    if (input === "") {
      this.isAddTaskButtonDisabled = true;
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    this.newTask = value;
  }

  handleInputClick() {
    this.isAddTaskButtonDisabled = false;
  }

  async handleAddTask() {
    if (this.newTask.length === 0) {
      // Disables the plus icon if there's no value in the Name field.
      this.isAddTaskButtonDisabled = true;
    } else {
      const newTaskName = this.newTask;
      // Reset the property that holds the new task value
      this.newTask = "";
      this.isAddTaskButtonDisabled = true;
      // Create new Task
      await this.createTask(newTaskName);
    }
  }

  handleActiveTabChanged(event) {
    const activeTabName = event.target.value; // i.e. Open, Completed, All
    this.activeTab = activeTabName;
  }
}
