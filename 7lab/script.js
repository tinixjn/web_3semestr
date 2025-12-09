document.addEventListener("DOMContentLoaded", function() {
  var playBtn = document.getElementById("playBtn");
  var work = document.getElementById("work");
  var anim = document.getElementById("anim");
  var messages = document.getElementById("messages");
  var startBtn = document.getElementById("startBtn");
  var stopBtn = document.getElementById("stopBtn");
  var reloadBtn = document.getElementById("reloadBtn");
  var closeBtn = document.getElementById("closeBtn");

  var nextSeq = 1;
  var squares = [];
  var animTimer = null;
  var stepMs = 30;
  var squareSize = 15;

  function calculateAndSetDimensions() {
    if (!work || !anim) return;
    var workRect = work.getBoundingClientRect();
    var targetWidth = Math.max(0, Math.round(workRect.width - 10));
    var targetHeight = Math.max(0, Math.round(workRect.height - 50));
    anim.style.width = targetWidth + "px";
    anim.style.height = targetHeight + "px";
    squares.forEach(function(s) {
      s.x = Math.min(Math.max(0, s.x), targetWidth - squareSize);
      s.y = Math.min(Math.max(0, s.y), targetHeight - squareSize);
      s.el.style.left = Math.round(s.x) + "px";
      s.el.style.top = Math.round(s.y) + "px";
    });
  }
  window.addEventListener("resize", calculateAndSetDimensions);

  function makeShortText(type, text, evt) {
    switch(type) {
      case "step":
        return "Крок — " + (evt && evt.color ? evt.color : "") + " " + text;
      case "touch-wall":
        return "Доторк — " + text;
      case "collision":
        return "Зіткнення";
      case "action":
        if (text.indexOf("start") !== -1) return "Старт";
        if (text.indexOf("stop") !== -1) return "Стоп";
        if (text.indexOf("reload") !== -1) return "Перезапуск";
        if (text.indexOf("play") !== -1) return "Відкрито";
        if (text.indexOf("close") !== -1) return "Закрито";
        return "Дія";
      default:
        return text;
    }
  }

  function appendMessage(txt) {
    if (!messages) return;
    var d = document.createElement("div");
    d.className = "msg-line";
    d.textContent = txt;
    messages.appendChild(d);
    messages.scrollTop = messages.scrollHeight;
  }

  function logEvent(type, text, meta) {
    var clientTime = Date.now();
    var evt = { seq: nextSeq++, type: type, text: text, clientTime: clientTime };
    if (meta) { for (var k in meta) evt[k] = meta[k]; }

    fetch('save.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(evt)
    })
    .then(function(resp){ return resp.json(); })
    .then(function(data){
      if (data && data.serverTime) evt.serverTime = data.serverTime;
      appendMessage(makeShortText(type, text, evt) + (evt.serverTime ? " | srv " + new Date(evt.serverTime).toLocaleTimeString() : ""));
    })
    .catch(function(){ appendMessage(makeShortText(type, text, evt) + " | srv помилка"); });

    try {
      var arr = JSON.parse(localStorage.getItem("events_local") || "[]");
      arr.push(evt);
      localStorage.setItem("events_local", JSON.stringify(arr));
    } catch (e) {
      console.warn("localStorage error", e);
    }

    appendMessage(makeShortText(type, text, evt) + " | клієнт " + new Date(clientTime).toLocaleTimeString());
  }

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function createSquare(x, y, vx, vy, color) {
    var el = document.createElement("div");
    el.className = "square " + (color === "blue" ? "blue" : "orange");
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = squareSize + "px";
    el.style.height = squareSize + "px";
    return { el: el, x: x, y: y, vx: vx, vy: vy, color: color };
  }

  function placeSquaresInitial() {
    if (!anim) return;
    anim.innerHTML = "";
    squares = [];
    var w = anim.clientWidth;
    var h = anim.clientHeight;
    if (w <= 0 || h <= 0) return;
    var blue = createSquare(Math.max(0, w - squareSize), randInt(0, Math.max(0, h - squareSize)), -2.2, 0, "blue");
    var orange = createSquare(randInt(0, Math.max(0, w - squareSize)), Math.max(0, h - squareSize), 0, -1.6, "orange");
    squares.push(blue, orange);
    squares.forEach(function(s){ anim.appendChild(s.el); });
  }

  function step() {
    var w = anim.clientWidth;
    var h = anim.clientHeight;
    if (w <= 0 || h <= 0) return;
    squares.forEach(function(s) {
      s.x += s.vx; s.y += s.vy;
      var touched = null;
      if (s.x <= 0) { s.x = 0; s.vx = -s.vx; touched = "ліво"; }
      if (s.x + squareSize >= w) { s.x = w - squareSize; s.vx = -s.vx; touched = "право"; }
      if (s.y <= 0) { s.y = 0; s.vy = -s.vy; touched = "верх"; }
      if (s.y + squareSize >= h) { s.y = h - squareSize; s.vy = -s.vy; touched = "низ"; }
      if (touched) logEvent("touch-wall", s.color + " " + touched, { color: s.color, x: Math.round(s.x), y: Math.round(s.y) });
      s.el.style.left = Math.round(s.x) + "px";
      s.el.style.top = Math.round(s.y) + "px";
      logEvent("step", s.color + " x" + Math.round(s.x) + " y" + Math.round(s.y), { color: s.color });
    });

    if (squares.length >= 2) {
      var a = squares[0], b = squares[1];
      if (!(a.x + squareSize < b.x || b.x + squareSize < a.x || a.y + squareSize < b.y || b.y + squareSize < a.y)) {
        logEvent("collision", "Квадрати зістикнулись");
        stopAnimation();
        stopBtn.style.display = "none";
        reloadBtn.style.display = "inline-block";
      }
    }
  }

  function startAnimation() {
    if (animTimer) return;
    animTimer = setInterval(step, stepMs);
    startBtn.style.display = "none";
    stopBtn.style.display = "inline-block";
    logEvent("action", "start");
  }
  function stopAnimation() {
    if (animTimer) { clearInterval(animTimer); animTimer = null; logEvent("action", "stop"); }
    stopBtn.style.display = "none";
    startBtn.style.display = "inline-block";
  }
  function reloadSquares() { placeSquaresInitial(); reloadBtn.style.display = "none"; startBtn.style.display = "inline-block"; logEvent("action", "reload"); }

  playBtn.addEventListener("click", function() {
    work.style.display = "flex";
    work.setAttribute("aria-hidden", "false");
    calculateAndSetDimensions();
    setTimeout(placeSquaresInitial, 60);
    logEvent("action", "play");
  });
  startBtn.addEventListener("click", startAnimation);
  stopBtn.addEventListener("click", stopAnimation);
  reloadBtn.addEventListener("click", reloadSquares);

  closeBtn.addEventListener("click", function() {
  logEvent("action", "close");
  var localEventsToSave = JSON.parse(localStorage.getItem("events_local") || "[]");

  var sendLocalPromise = fetch('save_local_final.php', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(localEventsToSave)
  }).then(function(resp){ return resp.json(); }).catch(() => {
       console.warn("Помилка відправки LocalStorage на сервер.");
       return { ok: false };
  });
  Promise.all([
    sendLocalPromise,
    Promise.resolve(localEventsToSave), 
    fetch('load.php').then(r => r.json()).catch(()=>[]) 
    ]).then(function(results){
    var localE = results[1] || []; 
    var serverE = results[2] || [];

    var target = document.querySelector(".md_right .col.column:last-child");
    if (!target) target = document.getElementById("events-table-container");

    var prev = target.querySelector(".events-wrapper");
    if (prev) prev.remove();

    var wrapper = document.createElement("div");
    wrapper.className = "events-wrapper";
    wrapper.style.marginTop = "12px";

    wrapper.innerHTML = "<h3>Events</h3>" + tableFromEvents(localE, serverE);

    target.appendChild(wrapper);

    work.style.display = "none";
    work.setAttribute("aria-hidden", "true");
    localStorage.removeItem("events_local");
  });
  
});


 function tableFromEvents(localArr, serverArr) {
  var maxLen = localArr.length;

  var s = "<table style='width:100%; margin:auto;'><thead><tr>" +
    "<th colspan='1'>LocalStorage</th>" +
    "<th colspan='2'>Server</th>" +
    "</tr><tr>" +
    "<th>Подія</th><th>Клієнт</th>" +
    "<th>Сервер</th>" +
    "</tr></thead><tbody>";

  for (var i = 0; i < maxLen; i++) {
    var L = localArr[i] || {};
    var S = serverArr[i] || {};

    s += "<tr>";

    s += "<td>" + ((L.type || "") + " " + (L.text || "")) + "</td>";
    s += "<td>" + (L.clientTime ? new Date(L.clientTime).toLocaleTimeString() : "") + "</td>";

    s += "<td>" + (S.serverTime ? new Date(S.serverTime).toLocaleTimeString() : "") + "</td>";

    s += "</tr>";
  }

  s += "</tbody></table>";

  return s;
}



});
