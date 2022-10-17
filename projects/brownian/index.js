(() => {
  ("use strict");
  var t = {
      310: (t, e, i) => {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.Particle = void 0);
        var r = i(292),
          a = (function () {
            function t(t, e, i, r, a) {
              (this.x = t),
                (this.y = e),
                (this.velocity = i),
                (this.size = r),
                (this.mass = a);
            }
            return (
              (t.prototype.move = function (t, e) {
                void 0 === t && (t = 500),
                  void 0 === e && (e = 400),
                  (this.x += this.velocity.x),
                  (this.y += this.velocity.y),
                  (this.x < 0 || this.x > t) &&
                    ((this.velocity.x = -this.velocity.x),
                    (this.x = Math.max(0, Math.min(t, this.x)))),
                  (this.y < 0 || this.y > e) &&
                    ((this.velocity.y = -this.velocity.y),
                    (this.y = Math.max(0, Math.min(e, this.y))));
              }),
              (t.prototype.changeVelocity = function (t, e) {
                void 0 === e && (e = !1);
                var i = (this.size / 60) * (t / 200 + 0.5);
                if (!(Math.random() > i) || e) {
                  var a = 5 / this.mass + 0.05 * t;
                  (this.velocity.x = (0, r.randomNormal)(a)),
                    (this.velocity.y = (0, r.randomNormal)(a));
                }
              }),
              t
            );
          })();
        e.Particle = a;
      },
      49: (t, e) => {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.displayParticle = void 0),
          (e.displayParticle = function (t, e, i) {
            void 0 === i && (i = "black"),
              t.beginPath(),
              t.arc(
                e.x - 0.5 * e.size,
                e.y - 0.5 * e.size,
                e.size,
                0,
                2 * Math.PI
              ),
              (t.fillStyle = i),
              t.fill(),
              t.stroke(),
              t.closePath();
          });
      },
      292: (t, e) => {
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.randomNormal = void 0),
          (e.randomNormal = function (t, e) {
            return (
              void 0 === e && (e = 0),
              Math.sqrt(-2 * Math.log(Math.random())) *
                Math.cos(2 * Math.PI * Math.random()) *
                t +
                e
            );
          });
      },
      607: function (t, e, i) {
        var r =
          (this && this.__values) ||
          function (t) {
            var e = "function" == typeof Symbol && Symbol.iterator,
              i = e && t[e],
              r = 0;
            if (i) return i.call(t);
            if (t && "number" == typeof t.length)
              return {
                next: function () {
                  return (
                    t && r >= t.length && (t = void 0),
                    { value: t && t[r++], done: !t }
                  );
                },
              };
            throw new TypeError(
              e ? "Object is not iterable." : "Symbol.iterator is not defined."
            );
          };
        Object.defineProperty(e, "__esModule", { value: !0 });
        var a,
          n,
          o,
          l,
          s = i(310),
          c = i(49);
        function h(t) {
          var e = t.temperature;
          ((a = document.getElementById("display")).width = 800),
            (a.height = 600),
            (n = a.getContext("2d"));
          var i = t.particles,
            r = [];
          clearInterval(o);
          var l = 0;
          o = setInterval(function () {
            n.clearRect(0, 0, a.width, a.height);
            for (var t = 0; t < i.length; t++)
              (o = i[t]).move(800, 600),
                o.changeVelocity(e),
                0 == t && r.push({ x: o.x, y: o.y });
            for (
              n.beginPath(), n.moveTo(r[0].x, r[0].y), t = 1;
              t < r.length;
              t++
            )
              n.lineTo(r[t].x, r[t].y);
            for (
              n.strokeStyle = "blue",
                n.stroke(),
                n.strokeStyle = "black",
                t = 0;
              t < i.length;
              t++
            ) {
              var o = i[t];
              (0, c.displayParticle)(n, o, 0 == t ? "blue" : "red");
            }
            (l += 20),
              (n.fillStyle = "black"),
              (n.font = "10px Arial"),
              n.fillText((l / 1e3).toFixed(1) + " ps", 10, 30);
          }, 20);
        }
        function u() {
          for (
            var t,
              e,
              i = parseInt($("#particles").val()),
              o = parseInt($("#temperature").val()),
              l = parseInt($("#size").val()),
              h = parseInt($("#mass").val()),
              u = [],
              v = 0;
            v < i;
            v++
          )
            (p = new s.Particle(
              800 * Math.random(),
              600 * Math.random(),
              { x: 0, y: 0 },
              l,
              h
            )).changeVelocity(o, !0),
              u.push(p);
          ((a = document.getElementById("display")).width = 800),
            (a.height = 600),
            (n = a.getContext("2d"));
          try {
            for (var y = r(u), d = y.next(); !d.done; d = y.next()) {
              var p = d.value;
              (0, c.displayParticle)(n, p, "red");
            }
          } catch (e) {
            t = { error: e };
          } finally {
            try {
              d && !d.done && (e = y.return) && e.call(y);
            } finally {
              if (t) throw t.error;
            }
          }
          return { particles: u, temperature: o };
        }
        $.when($.ready).then(function () {
          $("#particles").on("input", function () {
            var t = parseInt($("#particles").val());
            $("#particlesNum").text(t);
          }),
            $("#temperature").on("input", function () {
              var t = parseInt($("#temperature").val());
              $("#temperatureNum").text(t);
            }),
            $("#size").on("input", function () {
              var t = parseInt($("#size").val());
              $("#sizeNum").text(t);
            }),
            $("#mass").on("input", function () {
              var t = parseInt($("#mass").val());
              $("#massNum").text(t);
            }),
            h((l = u())),
            $("#applyConfig").on("click", function () {
              clearInterval(o), n.clearRect(0, 0, a.width, a.height), (l = u());
            }),
            $("#startSim").on("click", function () {
              h(l);
            });
        });
      },
    },
    e = {};
  !(function i(r) {
    var a = e[r];
    if (void 0 !== a) return a.exports;
    var n = (e[r] = { exports: {} });
    return t[r].call(n.exports, n, n.exports, i), n.exports;
  })(607);
})();
