var imgs = document.getElementsByClassName("post-content")[0].getElementsByTagName("img");
for (var i = 0; i < imgs.length; i++) {
    var tag=imgs[i].getAttribute("alt");
    var temp = '<div class="image-package">' + DomToString(imgs[i]) +((tag==null||tag=="")?'</div>':'<br><div class="image-caption">' + tag + '</div></div>');
    imgs[i].parentNode.replaceChild(parseDom(temp), imgs[i]);
}

function DomToString(arg) {
    var objE = document.createElement("div");
    objE.appendChild(arg.cloneNode());
    return objE.innerHTML;
}


function parseDom(arg) {

    var objE = document.createElement("div");

    objE.innerHTML = arg;

    return objE.childNodes[0];

}

