const dom = {
  body: document.body,
  previewcont: document.querySelector("section.preview"),
  preview: document.querySelector("canvas"),
  controls: document.querySelector("div.controls"),
  inspectcont: document.querySelector("section.inspect"),
  inspect: document.querySelector("section.inspect > div"),
  timelinecont: document.querySelector("section.timeline"),
  timeline: document.querySelector("section.timeline > div")
};

var user = {
  vids: [],
  pref: {}
};
var inp = {
  mouse: {
    lmb: 0,
    rmb: 0,
    mmb: 0,
    pos: [0, 0],
    target: null,
    scrollx: 0,
    scrolly: 0,
    input: false
  }
};

function update() {
  let w = window.innerWidth,
    h = window.innerHeight,
    aspratio = 16 / 9;
  dom.previewcont.style.height
}

function load() {
  let c = document.cookie;
  if (c.includes("wv-pref=")) {
    let i = c.indexOf("wv-pref=") + 8;
    let tc = c.toString().substr(i);
    let i2 = tc.indexOf(";");
    tc = tc.substr(0, i2 == -1 ? tc.length : i2);
    let fp = JSON.parse(atob(tc));
    user.pref = fp;
  };
  let vi = 0;
  while (c.includes("wv-vid" + vi + "=")) {
    let i = c.indexOf("wv-vid" + vi + "=") + 7 + vi.toString().length;
    let tc = c.substr(i);
    let i2 = tc.indexOf(";");
    tc = tc.substr(0, i2 == -1 ? tc.length : i2);
    let fv = JSON.parse(atob(tc));
    user.vids.push(fv);
    vi++;
  };
};
function save() {
  let data = btoa(JSON.stringify(user.pref));
  let exp = (new Date((new Date()).getTime() + 31536000000)).toUTCString();
  document.cookie = `wv-pref=${data};expires=${exp};path=/;`
  let vids = [];
  user.vids.forEach(i => {
    let j = i;
    if (j.type == "particles") {
      j.cont.ps = j.cont.ps.toJSON()
    }
    vids.push(btoa(JSON.stringify(j)))
  });
  vids.forEach((i, j) => {
    document.cookie = `wv-vid${j}=${i};expires=${exp};path=/;`
  })
};
function getPosition(el) {
  var xPos = 0;
  var yPos = 0;

  while (el) {
    if (el.tagName == "BODY") {
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }
  return [xPos, yPos];
};
function getParentsOf(el) {
  var a = el;
  var els = [];
  while (a) {
    els.unshift(a);
    a = a.parentNode;
  };
  return els;
};
function toTimestamp(f, p) {
  let fr = f % p;
  let sec = Math.floor(f / p);
  let min = Math.floor(sec / 60);
  sec %= 60;
  let hour = Math.floor(min / 60);
  min %= 60;
  let obj = {
    h: hour,
    m: min,
    s: sec,
    f: fr
  };
  fr = fr.toString();
  fr = fr.length == 1 ? "0" + fr : fr;
  sec = sec.toString();
  sec = sec.length == 1 ? "0" + sec : sec;
  min = min.toString();
  min = min.length == 1 ? "0" + min : min;
  hour = hour.toString();
  obj.t = `${hour}:${min}:${sec}.${fr}`
  return obj;
};
function parseTimestamp(s) {
  let l = s.split(/[\:\.]/g).map(x => Number(x));
  if (l.length < 4) {
    for (i = l.length; i < 4; i++) {
      l.splice(0, 0, 0);
    }
  }
  return {
    h: l[0],
  };
};
dom.body.addEventListener("keydown", e => {
  if (e.repeat) return;
  let key = e.key.toLowerCase();
  if (key == " ") key = "space";
  inp[key] = 1;
});
dom.body.addEventListener("keyup", e => {
  let key = e.key.toLowerCase();
  if (key == " ") key = "space";
  inp[key] = 0;
});
dom.body.addEventListener("mousedown", e => {
  inp.mouse[["lmb", "mmb", "rmb"][e.button]] = 1;
});
dom.body.addEventListener("mouseup", e => {
  inp.mouse[["lmb", "mmb", "rmb"][e.button]] = 0;
})
dom.body.addEventListener("mousemove", e => {
  inp.mouse.pos = [e.clientX, e.clientY];
  inp.mouse.target = e.target;
});
dom.body.addEventListener("wheel", e => {
  inp.mouse.scrolly = (e.deltaY < 0) ? -1 : ((e.deltaY > 0) ? 1 : 0)
  inp.mouse.scrollx = (e.deltaX < 0) ? -1 : ((e.deltaX > 0) ? 1 : 0)
});

setInterval(update, 1000 / 60);
load();