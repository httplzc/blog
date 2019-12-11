/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */


(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {

        $(".scroll-down").arctic_scroll();

        $(".menu-button, .nav-cover, .nav-close").on("click", function (e) {
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
                elem: $(this),
                speed: 500
            },

            allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove)}, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove}, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top)}, allOptions.speed);
            }
        });

    };
})(jQuery);

var lzcTag = " ___                     ________                ________     \n" +
    "|\\  \\                   |\\_____  \\              |\\   ____\\    \n" +
    "\\ \\  \\                   \\|___/  /|             \\ \\  \\___|    \n" +
    " \\ \\  \\                      /  / /              \\ \\  \\       \n" +
    "  \\ \\  \\____                /  /_/__              \\ \\  \\____  \n" +
    "   \\ \\_______\\             |\\________\\             \\ \\_______\\\n" +
    "    \\|_______|              \\|_______|              \\|_______|\n" +
    "                                                              \n" +
    "                                                              \n" +
    "                                                              ";

function bgImage() {
    console.log(lzcTag);
    if(!insert())
        return;

    function A() {
        t.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, t.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }

    function e() {
        o.clearRect(0, 0, t.width, t.height);
        var A = [a].concat(n);
        n.forEach(function (e) {
            e.x += e.xa, e.y += e.ya, e.xa *= e.x > t.width || e.x < 0 ? -1 : 1, e.ya *= e.y > t.height || e.y < 0 ? -1 : 1, o.fillRect(e.x - .5, e.y - .5, 1, 1);
            for (var i = 0; i < A.length; i++) {
                var n = A[i];
                if (e !== n && null !== n.x && null !== n.y) {
                    var r, l = e.x - n.x, s = e.y - n.y, d = l * l + s * s;
                    d < n.max && (n === a && d >= n.max / 2 && (e.x -= .03 * l, e.y -= .03 * s), r = (n.max - d) / n.max, o.beginPath(), o.lineWidth = r / 2, o.strokeStyle = "rgba(0,0,0," + (r + .2) + ")", o.moveTo(e.x, e.y), o.lineTo(n.x, n.y), o.stroke())
                }
            }
            A.splice(A.indexOf(e), 1)
        }), i(e)
    }

    var t = document.getElementById("cas"), o = t.getContext("2d");
    A(), window.onresize = A;
    var i = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (A) {
            window.setTimeout(A, 1e3 / 60)
        }
    }(), a = {x: null, y: null, max: 2e4};
    window.onmousemove = function (A) {
        A = A || window.event, a.x = A.clientX, a.y = A.clientY
    }, window.onmouseout = function (A) {
        a.x = null, a.y = null
    };
    for (var n = [], r = 0; 150 > r; r++) {
        var l = Math.random() * t.width, s = Math.random() * t.height, d = 2 * Math.random() - 1, c = 2 * Math.random() - 1;
        n.push({x: l, y: s, xa: d, ya: c, max: 6e3})
    }
    setTimeout(function () {
        e()
    }, 100)


}

$(document).ready(function () {
    if (!browserRedirect())
        bgImage();
});

function insert() {
    var doc = document.getElementsByClassName("site-wrapper")[0].getElementsByClassName("content")[0];
    if (doc != null)
        doc.innerHTML += '<canvas id="cas" width="100%" height="100%" style="position: fixed; top: 0; left: 0; z-index: -1; opacity: .5"></canvas>';
    return doc!=null;
}


function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

    return bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM
}


$(function () {
    if (browserRedirect()) {
        $(".site-footer").hide();
    }
});


