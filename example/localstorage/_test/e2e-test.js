/*global describe*/
/*global it*/
/*global browser*/
/*global expect*/
/*global repeater*/
/*global jQueryFunction*/
/*jslint node: true */
/*global element */
/*global lastRequest */
/*global ROOT_URL */
/*global activateXHRlog */
/*global sleep */
/*global pause */
/*global fireEnterOn */
/*global QueryString */

"use strict";


describe('Starting application', function() {

    describe('No todos', function() {

        it('Should NOT display main section when there are no item', function() {
            // set up
            browser().navigateTo("/localstorage/" + QueryString.fw);


            expect(repeater('section#main').count()).toEqual(1);
            expect(element('section#main:visible').count()).toBe(0);
        });
        it('Should NOT display footer section when there are no item', function() {
            // set up
            expect(repeater('footer#footer').count()).toEqual(1);
            expect(element('footer#footer:visible').count()).toBe(0);

        });
    });
    describe('New todo', function() {
        it('Should display a section with input to add a new todo', function() {
            // set up
            expect(repeater('input#new-todo').count()).toEqual(1);
            expect(element('input#new-todo:visible').count()).toBe(1);
        });
        it('Should create a new todo on enter, clearing input text, adding it to the list', function() {
            jQueryFunction('input#new-todo', 'val', 'a first todo');
            jQueryFunction('input#new-todo', 'change');
            expect(element('input#new-todo').val()).toBe('a first todo');
            fireEnterOn('input#new-todo');
            expect(element('input#new-todo').val()).toBe('');
            expect(element('section#main:visible').count()).toBe(1);
            expect(element('ul#todo-list > li').count()).toBe(1);
            expect(element('ul#todo-list > li:eq(0) > div > label').text()).toBe('a first todo');
        });
        it('Should trim() the text when adding a new todo', function() {
            jQueryFunction('input#new-todo', 'val', ' a second todo ');
            jQueryFunction('input#new-todo', 'change');
            fireEnterOn('input#new-todo');
            expect(element('ul#todo-list > li').count()).toBe(2);
            expect(element('ul#todo-list > li:eq(1) > div > label').text()).toBe('a second todo');

        });
    });
    describe('Item', function() {
        it("Clicking the checkbox strikethrough the todo and toggling the class completed on it's parent <li>", function() {
            expect(element('li.completed').count()).toBe(0);
            expect(element('ul#todo-list > li:eq(0) > div > label').css("text-decoration")).not().toContain('line-through');

            jQueryFunction('ul#todo-list > li:eq(0) > div > input', 'click');
            expect(element('li.completed').count()).toBe(1);
            expect(element('ul#todo-list > li:eq(0) > div > label').css("text-decoration")).toContain('line-through');

        });
        it("Should NOT display the delete button by default", function() {
            expect(element('button.destroy').count()).toBe(2);
            expect(element('button.destroy:visible').count()).toBe(0);
        });
        it("Double clicking the label activates the editing mode, and toggle .editing class on it's <li>", function() {
            // arrange & check first
            expect(element('ul#todo-list > li:eq(0) > input').count()).toBe(1);
            expect(element('ul#todo-list > li:eq(0) > input.edit:visible').count()).toBe(0);
            expect(element('ul#todo-list > li:eq(0) > input.edit:focus').count()).toBe(0);
            expect(element('ul#todo-list > li:eq(0).editing').count()).toBe(0);

            // act
            jQueryFunction('ul#todo-list > li:eq(0) > div > label', 'dblclick');

            // assert
            expect(element('ul#todo-list > li:eq(0) > input.edit:visible').count()).toBe(1);
            expect(element('ul#todo-list > li:eq(0).editing').count()).toBe(1);
        });

    });
    describe('Editing', function() {
        it("Should set the focus on the edited element", function() {
            expect(element('ul#todo-list > li:eq(0) > input.edit:focus').count()).toBe(1);
        });
        it("Should be able to save new value on blur", function() {

            expect(element('ul#todo-list > li:eq(0) > input.edit').count()).toBe(1);
            jQueryFunction('ul#todo-list > li:eq(0) > input.edit', 'val', ' a first todo changed ');
            jQueryFunction('ul#todo-list > li:eq(0) > input.edit', 'change');

            // blur
            jQueryFunction('ul#todo-list > li:eq(1) > div > label', 'dblclick');

            // new value saved contains text entered
            expect(element('ul#todo-list > li:eq(0) > div > label').text()).toContain('a first todo changed');

        });
        it("new entered value should be trimmed", function() {
            // new value saved is exactly equals to the trimmed text.
            expect(element('ul#todo-list > li:eq(0) > div > label').text()).toBe('a first todo changed');
        });
        it("editing class should be removed", function() {
            expect(element('ul#todo-list > li:eq(0)').count()).toBe(1);
            expect(element('ul#todo-list > li:eq(0).editing').count()).toBe(0);
        });
    });
});