/*let seedRNG = -1;

function rand() {
    if (seedRNG === -1)
        return Math.random();
    let x = Math.sin(seedRNG++) * 10000;
    return x - Math.floor(x);
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(rand() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function randInt(max) {
    return Math.floor(rand() * Math.floor(max));
}

function randElem(list) {
    return list[randInt(list.length)];
}*/

function download(filename, text) {
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}