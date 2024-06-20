import { LightningElement, api } from "lwc";

export default class TodoItem extends LightningElement {
  @api taskId;
  @api name;
  @api status;
  isEditMode = false;
  isEditTaskButtonDisabled = true;
  newTask = "";

  get isOpen() {
    return this.status !== "Completed";
  }

  handleOnBlur(event) {
    const input = event.target.value;
    if (input === "") {
      this.isEditTaskButtonDisabled = true;
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    this.newTask = value;
  }

  handleEditTaskButtonClick() {
    this.isEditTaskButtonDisabled = false;
  }

  handleCancelEditTask() {
    this.isEditMode = false;
    this.newTask = "";
  }

  handleEditTask() {
    const newTask = this.newTask;
    this.isEditMode = false;
    this.newTask = "";
    this.handleActionNotification("edit", newTask);
  }

  handleAction(event) {
    const action = event.target.title;
    switch (action) {
      case "edit":
        this.isEditMode = true;
        break;
      case "delete":
        this.handleActionNotification(action);
        break;
      case "markComplete":
        console.log("Mark complete");
        this.handleActionNotification(action);
        break;
      default:
        break;
    }
  }

  handleActionNotification(action, taskName) {
    const taskId = this.taskId;
    // Dispatch event to parent component
    this.dispatchEvent(
      new CustomEvent("taskaction", { detail: { action, taskId, taskName } })
    );
  }
}
