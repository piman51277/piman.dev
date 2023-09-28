(() => { "use strict"; var t = { 396: (t, e, i) => { Object.defineProperty(e, "__esModule", { value: !0 }), e.BezierAnim = void 0; const n = i(667), s = i(519); e.BezierAnim = class { constructor(t) { this.inMotion = !1, this.inManualMode = !1, this.motionPath = [], this.renderIntermediate = !0, this.time = 0, this.timeBind = () => { }, this.canvas = t, this.ctx = t.getContext("2d"), this.draggable = new n.Draggable(t), this.draggable.drawBg = this.drawBg.bind(this), this.draggable.draw() } drawBg() { this.ctx.fillStyle = "white", this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height), this.inMotion || this.inManualMode || (this.motionPath = this.getBezierPath(), this.drawAtTime(100, this.renderIntermediate)) } getBezierPath() { const t = this.draggable.points, e = []; if (t.length <= 1) return e; for (let i = 0; i <= 100; i += 1) { const n = (0, s.bezier)(t, i), o = n[n.length - 1][0]; e.push(o) } return e } drawMotionPath(t = 100) { if (this.motionPath.length <= 1) return; this.ctx.beginPath(), this.ctx.moveTo(this.motionPath[0][0], this.motionPath[0][1]); const e = Math.min(this.motionPath.length, t); for (let t = 1; t < e; t++) { const [e, i] = this.motionPath[t]; this.ctx.lineTo(e, i) } this.ctx.strokeStyle = "red", this.ctx.lineWidth = 2, this.ctx.stroke(), this.ctx.lineWidth = 1 } drawAtTime(t, e = !0) { if (!(this.motionPath.length <= 1)) { if (e) { const e = (0, s.bezier)(this.draggable.points, t); for (let t = 0; t < e.length - 1; t++) { const i = e[t]; this.ctx.beginPath(), this.ctx.moveTo(i[0][0], i[0][1]); for (let t = 1; t < i.length; t++) { const [e, n] = i[t]; this.ctx.lineTo(e, n) } this.ctx.strokeStyle = "blue", this.ctx.stroke() } } this.drawMotionPath(t) } } motionTick() { this.inMotion && (this.time += 1, this.time > 100 && (this.time = 0), this.draggable.draw(), this.drawAtTime(this.time, this.renderIntermediate), this.timeBind(this.time), setTimeout((() => requestAnimationFrame(this.motionTick.bind(this))), 30)) } bindAnimationUpdate(t) { this.timeBind = t } startMotionHandler() { this.inMotion || this.draggable.points.length <= 1 || (this.inMotion = !0, this.time = 0, this.draggable.disable(), this.motionTick(), this.canvas.addEventListener("mousedown", this.stopMotionHandler.bind(this))) } stopMotionHandler() { this.inMotion && (this.inMotion = !1, this.draggable.enable(), this.time = 0, this.timeBind(0), this.canvas.removeEventListener("mousedown", this.stopMotionHandler.bind(this))) } overrideTimeHandler(t) { this.inMotion && this.stopMotionHandler(), this.inManualMode = !0, this.time = t, this.draggable.draw(), this.drawAtTime(this.time, this.renderIntermediate), this.inManualMode = !1 } addPointHandler() { this.inMotion && this.stopMotionHandler(), this.draggable.addPoint(250, 250), this.draggable.draw() } removePointHandler() { this.inMotion && this.stopMotionHandler(), this.draggable.removePoint(), this.draggable.draw() } showIntermediateHandler() { this.renderIntermediate = !0, this.draggable.draw() } hideIntermediateHandler() { this.renderIntermediate = !1, this.draggable.draw() } resetHandler() { this.inMotion = !1, this.inManualMode = !1, this.time = 0, this.timeBind(0), this.draggable.removeAllPoints(), this.draggable.draw(), this.draggable.enable() } } }, 667: (t, e) => { Object.defineProperty(e, "__esModule", { value: !0 }), e.Draggable = void 0, e.Draggable = class { constructor(t) { this.dragPoints = [], this.nextPointId = 0, this.pickup = !1, this.pickupPoint = null, this.mouseDownHandler = t => { const e = t.offsetX, i = t.offsetY, n = this.dragPoints.filter((t => { const n = t.x - e, s = t.y - i, o = t.size + 5; return n * n + s * s <= o * o })); if (0 === n.length) return; const s = n.reduce(((t, e) => t.priority > e.priority ? t : e)); s && (this.pickupPoint = s, this.pickup = !0) }, this.mouseUpHandler = t => { this.pickup = !1, this.pickupPoint = null }, this.mouseMoveHandler = t => { if (this.pickup) { const e = t.offsetX, i = t.offsetY; this.pickupPoint.x = e, this.pickupPoint.y = i, this.draw() } }, this.canvas = t, this.ctx = t.getContext("2d"), this.attachListeners() } drawBg() { } attachListeners() { this.canvas.addEventListener("mousedown", this.mouseDownHandler), this.canvas.addEventListener("mouseup", this.mouseUpHandler), this.canvas.addEventListener("mousemove", this.mouseMoveHandler) } removeListeners() { this.canvas.removeEventListener("mousedown", this.mouseDownHandler), this.canvas.removeEventListener("mouseup", this.mouseUpHandler), this.canvas.removeEventListener("mousemove", this.mouseMoveHandler) } drawPoint(t) { this.ctx.beginPath(), this.ctx.arc(t.x, t.y, t.size, 0, 2 * Math.PI), this.ctx.fillStyle = t.color, this.ctx.fill(), this.ctx.closePath(), this.ctx.fillStyle = "black", this.ctx.fillText(t.label, t.x + 5, t.y - t.size - 5) } draw() { this.drawBg(), this.dragPoints.forEach((t => this.drawPoint(t))) } set drawCallback(t) { this.drawBg = t } enable() { this.attachListeners() } disable() { this.removeListeners() } addPoint(t, e, i = 7, n = "", s = "black") { const o = this.nextPointId++; "" === n && (n = o.toString()), this.dragPoints.push({ x: t, y: e, size: i, label: n, color: s, priority: o, isDragging: !1 }) } removePoint() { this.dragPoints.pop() } removeAllPoints() { this.dragPoints = [], this.nextPointId = 0 } get points() { return this.dragPoints.map((t => [t.x, t.y])) } } }, 519: (t, e) => { Object.defineProperty(e, "__esModule", { value: !0 }), e.bezier = void 0, e.bezier = function (t, e) { if (e < 0 || e > 100) throw new Error("t must be in [0,100]"); e /= 100; const i = [t]; for (let n = 0; n < t.length - 1; n++) { const t = i[n]; if (1 === t.length) break; const s = []; for (let i = 0; i < t.length - 1; i++) { const [n, o] = t[i], [a, r] = t[i + 1], h = n + (a - n) * e, d = o + (r - o) * e; s.push([h, d]) } i.push(s) } return i } } }, e = {}; function i(n) { var s = e[n]; if (void 0 !== s) return s.exports; var o = e[n] = { exports: {} }; return t[n](o, o.exports, i), o.exports } (() => { const t = i(396); var e; e = () => { const e = document.getElementById("canvas"); e.width = 500, e.height = 500; const i = new t.BezierAnim(e), n = [["add-point-btn", "click", i.addPointHandler], ["remove-point-btn", "click", i.removePointHandler], ["start-btn", "click", i.startMotionHandler], ["stop-btn", "click", i.stopMotionHandler], ["reset-btn", "click", i.resetHandler]]; for (const [t, e, s] of n) document.getElementById(t).addEventListener(e, s.bind(i)); const s = document.getElementById("time-control"); s.addEventListener("input", (() => { i.overrideTimeHandler(parseInt(s.value)) })), i.bindAnimationUpdate((t => { s.value = t.toString() })); const o = document.getElementById("show-inter"); o.addEventListener("change", (() => { o.checked ? i.showIntermediateHandler() : i.hideIntermediateHandler() })) }, "loading" !== document.readyState ? e() : document.addEventListener("DOMContentLoaded", e) })() })();