document.addEventListener("DOMContentLoaded", function() {
    var container = document.getElementById("content-display-container");
    var lastDataJson = "";

    function renderCollapse(items) {
        container.innerHTML = ""; 
        if (!items || items.length === 0) {
            container.textContent = "Немає об'єктів.";
            return;
        }

        for (var i = 0; i < items.length; i++) {
            (function(item, idx){
                var wrap = document.createElement("div");
                wrap.classList.add("collapse-wrap");

                var header = document.createElement("div");
                header.classList.add("collapse-header");
                header.textContent = item.title || ("Елемент " + (idx+1));

                var content = document.createElement("div");
                content.classList.add("collapse-content");
                content.innerHTML = item.content || "";
                content.style.display = "none"; 

                header.addEventListener("click", function() {
                    content.style.display = 
                        (content.style.display === "none") ? "block" : "none";
                });

                wrap.appendChild(header);
                wrap.appendChild(content);
                container.appendChild(wrap);
            })(items[i], i);
        }
    }

    function loadDataOnce() {
        fetch('load_collapses.php')
            .then(function(resp){ return resp.json(); })
            .then(function(data){
                var j = JSON.stringify(data);
                if (j !== lastDataJson) {
                    lastDataJson = j;
                    renderCollapse(data);
                }
            })
            .catch(function(err){
                console.log("Помилка при завантаженні:", err);
            });
    }

    loadDataOnce();

    setInterval(loadDataOnce, 5000);
});
