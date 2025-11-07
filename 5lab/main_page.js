/*1 task*/
document.addEventListener("DOMContentLoaded", () => {
    const rightBlock = document.querySelector(".md_right");
    const blocks = rightBlock.querySelectorAll(".col.column");

    if (blocks.length >= 2) {
        const block4Content = blocks[0].innerHTML;
        const block5Content = blocks[1].innerHTML;

        blocks[0].innerHTML = block5Content;
        blocks[1].innerHTML = block4Content;

        console.log("1 task: right");
    } else {
        console.warn("1 task: wrong");
    }
});

/*2 task*/
document.addEventListener("DOMContentLoaded", () => {
    let a = 5;
    let b = 7;
    let c = 8;

    let p = (a + b + c) / 2;
    let area = Math.sqrt(p * (p - a) * (p - b) * (p - c));

    let block3 = document.querySelector(".md_left .col_part .column2");

    if (block3) {
        block3.innerHTML += `<p><b>Площа трикутника:</b> ${area.toFixed(2)}</p>`;
        console.log("2 task: right");
    } else {
        console.warn("2 task: wrong");
    }
});

/*3 task*/
document.addEventListener("DOMContentLoaded", () => {
    let block3 = document.querySelector(".md_left .col_part .column2");

    if (document.cookie.includes("maxCount=") && document.cookie.includes("shown=yes")) {

       let saved = document.cookie
            .split("; ")
            .find(row => row.startsWith("maxCount="))
            ?.split("=")[1] || "невідомо";

        alert("Раніше було збережено результат:\n" +
              "Кількість максимальних чисел = " + saved +
              "\nПісля натискання ОК ці дані будуть видалені з cookies.");

        document.cookie = "maxCount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "shown=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        alert("Cookies видалено. Сторінка оновиться.");
        location.reload();
        return;
    }

    if (document.cookie.includes("maxCount=") && !document.cookie.includes("shown=yes")) {
        let saved = document.cookie
            .split("; ")
            .find(row => row.startsWith("maxCount="))
            .split("=")[1];

        alert("Збережений результат: кількість максимальних чисел = " + saved);
        document.cookie = "shown=yes; path=/;";
        return;
    }

    if (block3) {
        block3.innerHTML += `
            <form id="numbersForm">
                <p><b>Введіть 10 чисел:</b></p>
                ${Array(10).fill(0).map((_, i) => 
                    `<input type="number" name="num${i}" required style="width:80px">`).join(" ")}
                <br><br>
                <button type="submit">Порахувати</button>
            </form>
        `;
    }

    document.addEventListener("submit", (e) => {
        e.preventDefault();

        let numbers = Array.from(e.target.querySelectorAll("input"))
            .map(input => Number(input.value));

        let max = Math.max(...numbers);
        let count = numbers.filter(n => n === max).length;

        alert("Максимальне число: " + max + 
              "\nКількість таких чисел: " + count);

        document.cookie = "maxCount=" + count + "; path=/;";
        location.reload();
    });
});

/*4 task*/
document.addEventListener("DOMContentLoaded", () => {
    const block6 = document.querySelector(".row_part");

    block6.insertAdjacentHTML("beforebegin", `
        <form id="boldForm">
            <p><b>Виберіть жирність тексту для блоку 6:</b></p>
            <label><input type="radio" name="weight" value="normal"> Звичайний</label>
            <label><input type="radio" name="weight" value="bold"> Жирний</label>
        </form>
    `);
    const form = document.getElementById("boldForm");
    form.style.padding = "10px";
    form.style.backgroundColor = getComputedStyle(block6).backgroundColor;
    let saved = localStorage.getItem("textWeight");
    if (saved) {
        block6.style.fontWeight = saved;
        let radio = document.querySelector(`input[value="${saved}"]`);
        if (radio) radio.checked = true;
    }

    window.addEventListener("scroll", () => {
        let checked = document.querySelector('input[name="weight"]:checked');
        if (checked) {
            block6.style.fontWeight = checked.value;
            localStorage.setItem("textWeight", checked.value);
        }
    });
});

/*5 task*/
document.addEventListener("DOMContentLoaded", () => {
    const blocks = [
        {id:1, el: document.querySelector(".info_header .title")},
        {id:2, el: document.querySelector(".md_left .col_part .column1")},
        {id:3, el: document.querySelector(".md_left .col_part .column2")},
        {id:4, el: (function(){ const r=document.querySelector(".md_right"); return r ? r.querySelectorAll(".col.column")[0] : null; })()},
        {id:5, el: (function(){ const r=document.querySelector(".md_right"); return r ? r.querySelectorAll(".col.column")[1] : null; })()},
        {id:6, el: document.querySelector(".row_part .text_row")},
        {id:7, el: document.querySelector(".footer .inscription_Y")}
    ];

    function renderList(placeholder, items) {
        placeholder.innerHTML = "";
        const ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.padding = "0";
        items.forEach((text, i) => {
            const li = document.createElement("li");
            li.textContent = text;
            li.style.padding = "6px 8px";
            if (i % 2 === 0) { li.style.backgroundColor = "black"; li.style.color = "white"; }
            else { li.style.backgroundColor = "white"; li.style.color = "black"; }
            ul.appendChild(li);
        });
        placeholder.appendChild(ul);
    }

    function createForm(placeholder) {
        const wrap = document.createElement("div");
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Текст пункту";
        input.style.width = "60%";
        input.style.marginRight = "6px";

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.textContent = "Додати";

        const tempUl = document.createElement("ul");
        tempUl.style.listStyle = "none";
        tempUl.style.padding = "0";
        tempUl.style.marginTop = "8px";

        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.textContent = "Зберегти список";
        saveBtn.style.display = "inline-block";
        saveBtn.style.marginTop = "8px";

        wrap.appendChild(input);
        wrap.appendChild(addBtn);
        wrap.appendChild(saveBtn);
        wrap.appendChild(tempUl);

        addBtn.addEventListener("click", () => {
            const v = input.value.trim();
            if (!v) return;
            const li = document.createElement("li");
            li.textContent = v;
            li.style.padding = "6px 8px";
            const idx = tempUl.children.length;
            if (idx % 2 === 0) { li.style.backgroundColor = "black"; li.style.color = "white"; }
            else { li.style.backgroundColor = "white"; li.style.color = "black"; }
            tempUl.appendChild(li);
            input.value = "";
        });

        saveBtn.addEventListener("click", () => {
            const items = Array.from(tempUl.children).map(li => li.textContent);
            if (items.length === 0) { alert("Немає пунктів для збереження."); return; }
            if (typeof wrap.onSave === "function") wrap.onSave(items);
        });

        return wrap;
    }

    blocks.forEach(b => {
        if (!b.el) return;

        const key = "list_block_" + b.id;
        const saved = localStorage.getItem(key);

        const widget = document.createElement("div");
        widget.style.marginTop = "8px";

        const phrase = document.createElement("p");
        phrase.textContent = "Виділіть цю фразу, щоб додати список";
        phrase.style.cursor = "text";
        phrase.style.color = "blue";

        const placeholder = document.createElement("div");
        placeholder.className = "list-placeholder";
        placeholder.style.marginTop = "6px";

        widget.appendChild(phrase);
        widget.appendChild(placeholder);
        b.el.appendChild(widget);

        if (saved) {
            const items = JSON.parse(saved);
            renderList(placeholder, items);

            phrase.remove();

            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.textContent = "Видалити збережений список";
            delBtn.style.display = "block";
            delBtn.style.marginTop = "8px";
            delBtn.addEventListener("click", () => {
                localStorage.removeItem(key);
                location.reload();
            });
            widget.appendChild(delBtn);

            return; 
        }

        phrase.addEventListener("mouseup", () => {
            const sel = window.getSelection().toString().trim();
            if (sel.length === 0) return;
            if (!placeholder.querySelector(".list-form")) {
                const form = createForm(placeholder);
                form.className = "list-form";
                form.onSave = function(items) {
                    localStorage.setItem(key, JSON.stringify(items));
                    renderList(placeholder, items);
                    phrase.remove(); 
                    const delBtn = document.createElement("button");
                    delBtn.type = "button";
                    delBtn.textContent = "Видалити збережений список";
                    delBtn.style.display = "block";
                    delBtn.style.marginTop = "8px";
                    delBtn.addEventListener("click", () => {
                        localStorage.removeItem(key);
                        location.reload();
                    });
                    placeholder.parentNode.appendChild(delBtn);
                    form.remove();
                };
                placeholder.appendChild(form);
            }
            window.getSelection().removeAllRanges();
        });
    });
});
