(() => {
  "use strict";
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
          l = i(310),
          s = i(49);
        function c() {
          var t = parseInt($("#particles").val()),
            e = parseInt($("#temperature").val()),
            i = parseInt($("#size").val()),
            c = parseInt($("#mass").val());
          ((a = document.getElementById("display")).width = 800),
            (a.height = 600),
            (n = a.getContext("2d"));
          for (var h = [], v = 0; v < t; v++) {
            var u = new l.Particle(100, 100, { x: 0, y: 0 }, i, c);
            u.changeVelocity(e, !0), h.push(u);
          }
          clearInterval(o);
          var y = 0;
          o = setInterval(function () {
            var t, i;
            n.clearRect(0, 0, a.width, a.height);
            try {
              for (var o = r(h), l = o.next(); !l.done; l = o.next()) {
                var c = l.value;
                c.move(800, 600),
                  c.changeVelocity(e),
                  (0, s.displayParticle)(n, c, "red");
              }
            } catch (e) {
              t = { error: e };
            } finally {
              try {
                l && !l.done && (i = o.return) && i.call(o);
              } finally {
                if (t) throw t.error;
              }
            }
            (y += 20),
              (n.fillStyle = "black"),
              (n.font = "10px Arial"),
              n.fillText((y / 1e3).toFixed(1) + " ps", 10, 30);
          }, 20);
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
            c(),
            $("#startSim").on("click", function () {
              c();
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
