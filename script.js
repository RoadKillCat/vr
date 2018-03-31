'use strict';

var cnvs_l = document.getElementById('cnvs_l');
var cnvs_r = document.getElementById('cnvs_r');
var cnvii = document.getElementById('cnvii');
var msg = document.getElementById('msg');

var fullscreen = false;
var mobile = /Android/.test(navigator.userAgent);

function fts(){
    console.log('fitting');
    cnvs_l.width = cnvs_r.width = innerWidth / 2;
    cnvs_l.height = cnvs_r.height = innerHeight;
}

screen.orientation.onchange = function(){
    if (document.webkitFullscreenElement){
        cnvii.style.display = 'inline';
        msg.style.display = 'none';
    } else {
        cnvii.style.display = 'none';
        msg.style.display = 'block';
    }
}

document.body.addEventListener('click', function(){
    document.body.webkitRequestFullscreen();
    screen.orientation.lock('landscape');
    fts();
});
