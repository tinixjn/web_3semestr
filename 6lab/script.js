document.addEventListener("DOMContentLoaded", function() {
    var items = [];

    var formContainer = document.getElementById("collapse-form-container");
    var message = document.getElementById("message-container");

    function renderFormList() {
        if (message) message.textContent = "";

        formContainer.innerHTML = "";
        for (var i = 0; i < items.length; i++) {

            var div = document.createElement("div");
            div.className = "collapse-item";

            var h = document.createElement("input");
            h.type = "text";
            h.value = items[i].title;
            h.className = "collapse-title-input";
            h.placeholder = "Заголовок";
            (function(index, input){
                input.addEventListener("input", function(){ items[index].title = input.value; });
            })(i, h);

            var t = document.createElement("textarea");
            t.value = items[i].content;
            t.className = "collapse-content-input";
            t.placeholder = "Вміст";
            (function(index, ta){
                ta.addEventListener("input", function(){ items[index].content = ta.value; });
            })(i, t);

            var del = document.createElement("button");
            del.type = "button";
            del.textContent = "Видалити";
            del.className = "collapse-delete-btn";
            (function(index){
                del.addEventListener("click", function(){
                    items.splice(index, 1);
                    renderFormList();
                });
            })(i);

            div.appendChild(h);
            div.appendChild(t);
            div.appendChild(del);

            formContainer.appendChild(div);
        }
    }

    function loadExistingData() {
        fetch('load_collapses.php')
            .then(resp => resp.json())
            .then(data => {
                if (Array.isArray(data)) {
                    items = data;    
                    renderFormList(); 
                }
            })
            .catch(() => {
                console.log("Помилка завантаження існуючих елементів.");
            });
    }

    window.addCollapseItem = function() {
        items.push({ title: "", content: "" });
        renderFormList();
    };

    window.saveCollapseData = function() {
        if (message) message.textContent = "Зберігаю на сервер...";

        fetch('save_collapses.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: items })
        })
        .then(function(resp){ return resp.json(); })
        .then(function(data){
            if (data.ok) {
                if (message) message.textContent = "Збережено на сервері.";
            } else {
                if (message) message.textContent = "Помилка збереження: " + (data.error || "невідома");
            }
        })
        .catch(function(){
            if (message) message.textContent = "Помилка мережі.";
        });
    };

    loadExistingData();
});
