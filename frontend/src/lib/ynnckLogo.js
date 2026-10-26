/* eslint-disable */
export function mountYnnck(el,opts){
  opts=opts||{};var u="y"+Math.random().toString(36).slice(2,7);
  var C="M576 100 A335 335 0 1 0 576 620 A333 333 0 1 1 576 100Z";
  var L=["M295 598V130","M295 130L512 548","M512 548V170","M512 170L147 493","M147 225L512 548"];
  var col=opts.color||"#fff";
  el.innerHTML='<svg class="ylogo" viewBox="20 18 572 690" aria-hidden="true" style="display:block;height:100%;width:auto;overflow:visible">'+
    '<defs><mask id="'+u+'m" maskUnits="userSpaceOnUse"><path class="am" d="M576 100 A335 335 0 1 0 576 620" fill="none" stroke="#fff" stroke-width="40" pathLength="1"/></mask></defs>'+
    '<path d="'+C+'" fill="'+col+'" mask="url(#'+u+'m)"/>'+
    '<g fill="none" stroke="'+col+'" stroke-width="'+(opts.weight||7)+'" stroke-linecap="round">'+L.map(function(d){return '<path class="ln" d="'+d+'" pathLength="1"/>'}).join("")+'</g>'+
    '<g class="dot"><circle r="10" fill="'+(opts.dot||col)+'"/><circle r="26" fill="'+(opts.dot||col)+'" opacity=".18"/></g></svg>';
  var svg=el.firstChild,am=svg.querySelector(".am"),lns=[].slice.call(svg.querySelectorAll(".ln")),dot=svg.querySelector(".dot");
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  function seg(t,a,b){return Math.max(0,Math.min(1,(t-a)/(b-a)))}
  function io(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
  var pts=[[295,598,295,130],[295,130,512,548],[512,548,512,170],[512,170,147,493],[147,225,512,548]];
  function draw(t){
    lns.forEach(function(p,i){var v=io(seg(t,.15+i*.22,.65+i*.22));p.style.strokeDasharray="1 1";p.style.strokeDashoffset=(1-v).toFixed(4);p.style.opacity=v>0?1:0});
    var a=io(seg(t,1.1,2.3));am.style.strokeDasharray="1 1";am.style.strokeDashoffset=(1-a).toFixed(4);
    var k=-1,f=0;for(var i=0;i<5;i++){var s=seg(t,.15+i*.22,.65+i*.22);if(s>0&&s<1){k=i;f=io(s)}}
    if(k>=0){var q=pts[k];dot.setAttribute("transform","translate("+(q[0]+(q[2]-q[0])*f).toFixed(1)+" "+(q[1]+(q[3]-q[1])*f).toFixed(1)+")");dot.style.opacity=1}
    else dot.style.opacity=0;
  }
  var raf=0,start=null,DUR=2.5;
  function tick(now){if(start===null)start=now;var t=(now-start)/1000;draw(t);if(t<DUR)raf=requestAnimationFrame(tick)}
  function play(){cancelAnimationFrame(raf);start=null;raf=requestAnimationFrame(tick)}
  if(reduce)draw(99);else{draw(0);play()}
  return{replay:function(){if(!reduce)play()},stop:function(){cancelAnimationFrame(raf)}};
}
