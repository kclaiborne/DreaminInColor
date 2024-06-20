import { createElement } from 'lwc';
import TodoItem from 'c/todoItem';

describe('c-todo-item', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('mark open task completed', async () => {
        // Arrange
        const element = createElement('c-todo-item', {
            is: TodoItem
        });

        // Set @api exposed properties
        element.taskId = '00T000000000000000';
        element.name = 'Learn to write Jest test';
        element.status = 'In Progress';

        // Add the component to the DOM
        document.body.appendChild(element);

        // Mock handler for prompt_click custom event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener('taskaction', handler);

        let icons = element.shadowRoot.querySelectorAll("lightning-icon");

        // Assert
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');

        // Mock onclick of 'Mark Completed' icon
        icons[0].click();

        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        expect(handler).toHaveBeenCalled();
    });

    it('edit open task with empty string', async () => {
        // Arrange
        const element = createElement('c-todo-item', {
            is: TodoItem
        });

        // Set @api exposed properties
        element.taskId = '00T000000000000000';
        element.name = 'Learn to write Jest test';
        element.status = 'In Progress';

        // Add the component to the DOM
        document.body.appendChild(element);

        // Mock handler for prompt_click custom event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener('taskaction', handler);

        let icons = element.shadowRoot.querySelectorAll("lightning-icon");

        // Assert
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');

        // Mock onclick of 'Edit' icon
        icons[1].click();

        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);

        let input = element.shadowRoot.querySelectorAll("input");

        // Mock onclick event with empty string
        input[0].click();
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);

        input = element.shadowRoot.querySelectorAll("input");
        let lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(2);
        expect(lightningButtonIcon[0].iconName).toBe('utility:check');
        expect(lightningButtonIcon[0].disabled).toBe(false);
        expect(lightningButtonIcon[1].iconName).toBe('utility:close');
        expect(input).not.toBeNull();
        expect(input.length).toBe(1);
        expect(input[0].value).toBe('');

        // Mock onblur event with a non-empty value
        input[0].value = '';
        input[0].dispatchEvent(new CustomEvent("blur"));
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        input = element.shadowRoot.querySelectorAll("input");
        lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
    
        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(2);
        expect(lightningButtonIcon[0].iconName).toBe('utility:check');
        expect(lightningButtonIcon[0].disabled).toBe(true);
        expect(lightningButtonIcon[1].iconName).toBe('utility:close');
        expect(input).not.toBeNull();
        expect(input.length).toBe(1);
        expect(input[0].value).toBe('');

        // Mock onchange event with a non-empty value
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
        expect(lightningButtonIcon.length).toBe(2);
        expect(lightningButtonIcon[0].iconName).toBe('utility:check');
        expect(lightningButtonIcon[0].disabled).toBe(true);
        expect(lightningButtonIcon[1].iconName).toBe('utility:close');
        expect(input).not.toBeNull();
        expect(input.length).toBe(1);
        expect(input[0].value).toBe('');

        // Mock onclick event to confirm edit
        lightningButtonIcon[0].click();
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        input = element.shadowRoot.querySelectorAll("input");
        lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
        icons = element.shadowRoot.querySelectorAll("lightning-icon");
    
        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(0);
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');
        expect(input).not.toBeNull();
        expect(input.length).toBe(0);
    
        expect(handler).toHaveBeenCalled();
    });

    it('edit open task with non-empty value', async () => {
        // Arrange
        const element = createElement('c-todo-item', {
            is: TodoItem
        });

        // Set @api exposed properties
        element.taskId = '00T000000000000000';
        element.name = 'Learn to write Jest test';
        element.status = 'In Progress';

        // Add the component to the DOM
        document.body.appendChild(element);

        // Mock handler for prompt_click custom event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener('taskaction', handler);

        let icons = element.shadowRoot.querySelectorAll("lightning-icon");

        // Assert
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');

        // Mock onclick of 'Edit' icon
        icons[1].click();

        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);

        let input = element.shadowRoot.querySelectorAll("input");

        // Mock onclick event with empty string
        input[0].click();
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);

        input = element.shadowRoot.querySelectorAll("input");
        let lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");

        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(2);
        expect(lightningButtonIcon[0].iconName).toBe('utility:check');
        expect(lightningButtonIcon[0].disabled).toBe(false);
        expect(lightningButtonIcon[1].iconName).toBe('utility:close');
        expect(input).not.toBeNull();
        expect(input.length).toBe(1);
        expect(input[0].value).toBe('');

        // Mock onblur event with a non-empty value
        input[0].value = 'Learn to write efficient Jest test';
        input[0].dispatchEvent(new CustomEvent("blur"));
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        input = element.shadowRoot.querySelectorAll("input");
        lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
    
        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(2);
        expect(lightningButtonIcon[0].iconName).toBe('utility:check');
        expect(lightningButtonIcon[0].disabled).toBe(false);
        expect(lightningButtonIcon[1].iconName).toBe('utility:close');
        expect(input).not.toBeNull();
        expect(input.length).toBe(1);
        expect(input[0].value).toBe('Learn to write efficient Jest test');

        // Mock onchange event with a non-empty value
        input[0].value = 'Learn to write efficient Jest test';
        input[0].dispatchEvent(new CustomEvent("change"));
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        input = element.shadowRoot.querySelectorAll("input");
        lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
    
        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(2);
        expect(lightningButtonIcon[0].iconName).toBe('utility:check');
        expect(lightningButtonIcon[0].disabled).toBe(false);
        expect(lightningButtonIcon[1].iconName).toBe('utility:close');
        expect(input).not.toBeNull();
        expect(input.length).toBe(1);
        expect(input[0].value).toBe('Learn to write efficient Jest test');

        // Mock onclick event to confirm edit
        lightningButtonIcon[0].click();
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        input = element.shadowRoot.querySelectorAll("input");
        lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
        icons = element.shadowRoot.querySelectorAll("lightning-icon");
    
        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(0);
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');
        expect(input).not.toBeNull();
        expect(input.length).toBe(0);
    
        expect(handler).toHaveBeenCalled();
    });

    it('cancel edit open task', async () => {
        // Arrange
        const element = createElement('c-todo-item', {
            is: TodoItem
        });

        // Set @api exposed properties
        element.taskId = '00T000000000000000';
        element.name = 'Learn to write Jest test';
        element.status = 'In Progress';

        // Add the component to the DOM
        document.body.appendChild(element);

        // Mock handler for prompt_click custom event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener('taskaction', handler);

        let icons = element.shadowRoot.querySelectorAll("lightning-icon");

        // Assert
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');

        // Mock onclick of 'Edit' icon
        icons[1].click();

        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);

        let input = element.shadowRoot.querySelectorAll("input");

        // Mock onblur event with a non-empty value
        input[0].value = 'Learn to write efficient Jest test';
        input[0].dispatchEvent(new CustomEvent("onblur"));
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        input = element.shadowRoot.querySelectorAll("input");
        let lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
    
        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(2);
        expect(lightningButtonIcon[0].iconName).toBe('utility:check');
        expect(lightningButtonIcon[0].disabled).toBe(true);
        expect(lightningButtonIcon[1].iconName).toBe('utility:close');
        expect(input).not.toBeNull();
        expect(input.length).toBe(1);
        expect(input[0].value).toBe('Learn to write efficient Jest test');

        // Mock onclick event to confirm edit
        lightningButtonIcon[1].click();
    
        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        input = element.shadowRoot.querySelectorAll("input");
        lightningButtonIcon = element.shadowRoot.querySelectorAll("lightning-button-icon");
        icons = element.shadowRoot.querySelectorAll("lightning-icon");
    
        // Assert
        expect(lightningButtonIcon).not.toBeNull();
        expect(lightningButtonIcon.length).toBe(0);
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');
        expect(input).not.toBeNull();
        expect(input.length).toBe(0);
    
        expect(handler).not.toHaveBeenCalled();
    });

    it('delete open task', async () => {
        // Arrange
        const element = createElement('c-todo-item', {
            is: TodoItem
        });

        // Set @api exposed properties
        element.taskId = '00T000000000000000';
        element.name = 'Learn to write Jest test';
        element.status = 'In Progress';

        // Add the component to the DOM
        document.body.appendChild(element);

        // Mock handler for prompt_click custom event
        const handler = jest.fn();
        // Add event listener to catch toast event
        element.addEventListener('taskaction', handler);

        let icons = element.shadowRoot.querySelectorAll("lightning-icon");

        // Assert
        expect(icons).not.toBeNull();
        expect(icons.length).toBe(3);
        expect(icons[0].iconName).toBe('utility:success');
        expect(icons[1].iconName).toBe('utility:edit');
        expect(icons[2].iconName).toBe('utility:delete');

        // Mock onclick of 'Delete' icon
        icons[2].click();

        // Wait for any asynchronous DOM updates. This is
        // needed for promise timing when calling imperative Apex or wire
        // services.
        await new Promise(process.nextTick);
    
        expect(handler).toHaveBeenCalled();
    });
});