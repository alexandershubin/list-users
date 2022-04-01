'use strict'
document.addEventListener("DOMContentLoaded", () => {
    const btnAdd = document.querySelector('.btn-primary');
    const todoList = document.querySelector('.table-list');
    const tel = document.querySelector('#tel');
    const name = document.querySelector('#name');
    const errorPhone = document.querySelector('.error-phone');
    const errorName = document.querySelector('.error-name');
    const form = document.querySelector('.form');
    let isEdit = false;

    const getData = () => {
        const data = localStorage.getItem('app_state');

        if (!data) {
            return [];
        }

        try {
            console.log('data', JSON.parse(data));
            return JSON.parse(data);
        } catch (e) {
            console.error('Ошибка при получении данных из localStorage');
            return [];
        }
    }

    let arrayData = getData();

    /**
     * Сгенерировать уникальный ID
     */
    const generateID = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const validatePhone = (phone) => {
        let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return regex.test(phone);
    }

    /**
     * валидация для полей/оттображение ошибки
     * @param {HTMLDivElement} elem
     */
    const checkValidPhone = (elem) => {
        elem.addEventListener('input', ({target}) => {
            if (target.type === 'tel') {
                btnAdd.disabled = false;

                !validatePhone(target.value)
                    ? errorPhone.classList.add('show')
                    : errorPhone.classList.remove('show')
            } else {
                target.value.trim() === ''
                    ? errorName.classList.add('show')
                    : errorName.classList.remove('show')
            }
        })
    };

    /**
     * берет значение из инпутов и вставляет в обьект
     */
    const createDataForObject = (btnAdd, tel, name) => {
        btnAdd.addEventListener('click', () => {
            let id = generateID();
            errorPhone.classList.remove('show')
            arrayData.push({name: name.value, phone: tel.value, id});
            tel.value = '';
            name.value = '';

            renderList();
            saveData();
        })
    };

    /**
     * Рендерит список задач
     * @param {Array} data
     * @returns {string}
     */
    const createTasksListTemplate = data => data.map((item, index) =>
        `<tr class="list-item" data-id="${item.id}">
            <th scope="row">${index + 1}</th>
            <td><input type="text" class="td-input" value="${item.name}" id="td-name"/></td>
            <td><input type="tel" class="td-input" value="${item.phone}" id="td-phone"/></td>
            <td class="btn-wrap">
                <button type="button" class="button edit-button">Edit</button>
                <button type="button" class="button btn-close">Delete</button>
            </td>
        </tr>`
    ).join(``);


    const saveData = () => {
        localStorage.setItem('app_state', JSON.stringify(arrayData));
    };

    /**
     * редактирование данных таблицы
     */
    const editBtnTask = () => {
        const editButton = document.querySelectorAll('.edit-button');
        let name = document.querySelectorAll('#td-name');
        let phone = document.querySelectorAll('#td-phone');

        editButton.forEach((item, i) => {
            item.addEventListener('click', (e) => {

                isEdit = !isEdit
                item.innerHTML = isEdit ? 'Save' : 'Edit'

                name[i].classList.add('active')
                phone[i].classList.add('active')

                let taskElement = e.target.closest('.list-item');
                let taskId = taskElement.getAttribute('data-id');

                if (isEdit) {
                    arrayData = arrayData.filter(item => item.id !== taskId);
                    createDataForObject(item, phone[i], name[i]);
                    checkValidPhone(phone[i]);
                    checkValidPhone(name[i]);
                    saveData()
                }
            })
        })
    };

    /**
     * скрывает блок с задачей
     */
    const deleteTaskBtn = () => {
        const btnClose = document.querySelectorAll('.btn-close');

        btnClose.forEach((item, i) => {
            item.addEventListener('click', (e) => {
                let taskElement = e.target.closest('.list-item');
                let taskId = taskElement.getAttribute('data-id');
                arrayData = arrayData.filter(item => item.id !== taskId);
                taskElement.remove();
                saveData();
            })
        })
    };

    /**
     * отправка данных
     */
    // form.addEventListener("submit", function (evt) {
    //     if (!name.value || !tel.value) {
    //         evt.preventDefault();
    //         console.log('сбрасываем')
    //     } else {
    //         createDataForObject(btnAdd, tel, name);
    //         btnAdd.disabled = false;
    //     }
    // });

    /**
     * Вставляет список в верстку
     */
    const renderList = () => {
        todoList.innerHTML = createTasksListTemplate(arrayData);
        editBtnTask();
        deleteTaskBtn();
        checkValidPhone(tel);
        checkValidPhone(name);
        btnAdd.disabled = true;
    };

    createDataForObject(btnAdd, tel, name);
    renderList();
});