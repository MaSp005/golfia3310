random = (n, x, r) => !r ? Math.floor(Math.random() * (x - n)) + n : Math.random() * (x - n) + n;
class ParticleSystem {
  constructor(w, h, canvas) {
    if (canvas) this.canvas = canvas
    else this.canvas = document.createElement("canvas");
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d");
    this.w = w;
    this.h = h;
    this.time = 0;
    this.fps = 60;
    this.int = null;
    this.particles = [];
    this.properties = {};
    this.nextspawn = 0;
    this.playing = false;
    this.debug = false;
    this.triggered = false;
    //this.background = "#00000077"
    console.log("Using Particle System v0.01")
  }
  setParticles(obj) {
    this.properties = obj;
  }
  makeTriggerSystem(prop) {
    this.triggered = true;
    this.properties = prop || this.properties;
  }
  getDomElement() { return this.canvas }
  render() {
    this.time += Math.round(1000 / 60);
    if (this.properties.background) {
      this.ctx.fillStyle = this.properties.background;
      this.ctx.fillRect(0, 0, this.w, this.h);
    } else this.ctx.clearRect(0, 0, this.w, this.h);
    //console.log("rendering system"/*,this*/,"at time",this.time);
    if (!this.triggered && this.time > this.nextspawn) {
      //for(let n=0;n<Math.floor((this.time-this.nextspawn)/this.properties.spawnInterval[1]);n++)
      this.spawnparticle();
      this.nextspawn = this.time + random(this.properties.spawnInterval[0], this.properties.spawnInterval[1]);
    };
    let ctx = this.ctx;
    this.particles.forEach((x, i) => {
      x.lifetime = this.time - x.spawntime;
      if (typeof this.properties.movement == "object") {
        x.pos[0] += this.properties.movement[0];
        x.pos[1] += this.properties.movement[1];
      } else x.pos = this.properties.movement(x.startpos, x.pos, x.lifetime, x.custom);

      if (x.lifetime < this.properties.life[0]) {
        x.stage = 1;
        x.opacity = x.lifetime / this.properties.life[0];
      } else x.stage = 2;
      if (x.lifetime > this.properties.life[0] + this.properties.life[1]) {
        x.stage = 3;
        x.opacity = Math.min(1 - (x.lifetime - this.properties.life[0] - this.properties.life[1]) /
          this.properties.life[2], 1);
      }
      if (x.lifetime > this.properties.life[0] + this.properties.life[1] + this.properties.life[2] || x.opacity <= 0)
        return this.particles.splice(i, 1);
      /*
      ctx.fillStyle="black";
      this.ctx.fillText(x.lifetime,x.pos[0]+10,x.pos[1]+10,this.w);
      this.ctx.fillText(x.stage,x.pos[0]+10,x.pos[1]+20,this.w);
      this.ctx.fillText(x.opacity,x.pos[0]+10,x.pos[1]+30,this.w);*/
      ctx.fillStyle = this.properties.shape[2] +
        (Math.round(x.opacity * 255).toString(16).length == 1 ?
          "0" + Math.round(x.opacity * 255).toString(16) :
          Math.round(x.opacity * 255).toString(16));
      switch (this.properties.shape[0]) {
        case "circle":
          ctx.beginPath();
          ctx.arc(
            x.pos[0], x.pos[1],
            typeof this.properties.shape[1] == "object" ? x.radius : this.properties.shape[1],
            0, 2 * Math.PI, false);
          ctx.fill();
      }
    })
  }
  spawnparticle(x, y) {
    let o = {
      pos: [
        x || random(this.properties.spawnPosition[0], this.properties.spawnPosition[1]),
        y || random(this.properties.spawnPosition[2], this.properties.spawnPosition[3])
      ],
      spawntime: this.time,
      opacity: 1,
      stage: 0,
      custom: {}
    };
    o.startpos = o.pos;
    if (typeof this.properties.shape[1] == "object") o.radius =
      random(this.properties.shape[1][0], this.properties.shape[1][1]);
    if (this.properties.custom) Object.keys(this.properties.custom).forEach(y =>
      o.custom[y] = random(...this.properties.custom[y]));
    this.particles.push(o);
  }
  init(fps) {
    if (this.playing) return;
    this.fps = fps || 60;
    this.int = setInterval(() => this.render(), Math.round(1000 / this.fps));
    this.playing = true;
    if (this.debug !== true) return;
    this.canvas.addEventListener("click", e => {
      if (!this.playing) return this.init(60);
      this.pause();
      this.ctx.fillStyle = "black";
      this.ctx.fillText(`(${e.clientX}|${e.clientY})`, e.clientX, e.clientY);
      this.particles.forEach((x, i) => {
        this.ctx.fillText(JSON.stringify(x).replace(/\"/g, ""), 0, x.pos[1], this.w);
        this.ctx.fillText(i, 0, x.pos[1] - 10, this.w);
      })
    });
    this.debug = 2;
  }
  trigger(x, y) {
    if (!this.triggered) return console.warn("This System is not a triggered System.")
    for (let i = 0; i < this.properties.spawnAmount; i++) {
      this.spawnparticle(x, y)
    };
    //this.pause();
    this.init(this.fps || 60);
  }
  pause() { clearInterval(this.int); this.playing = false }
  clear() { this.ctx.clearRect(0, 0, this.w, this.h) }
  resize(w, h) {
    this.w = w;
    this.h = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }
}