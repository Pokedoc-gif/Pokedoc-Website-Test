/* INTRO REMOVE */
window.addEventListener("load",()=>{
setTimeout(()=>{
const intro=document.getElementById("intro");
intro.style.transition="opacity 1s";
intro.style.opacity="0";
setTimeout(()=>intro.remove(),1000);
},1800);
});

/* PARTICLE BACKGROUND */
const canvas=document.getElementById("particles");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];
for(let i=0;i<80;i++){
particles.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
r:Math.random()*2,
d:Math.random()*1
});
}

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle="rgba(255,215,0,0.7)";
particles.forEach(p=>{
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fill();
p.y+=p.d;
if(p.y>canvas.height){p.y=0;}
});
requestAnimationFrame(draw);
}
draw();

/* BUY */
function buyProduct(name){
const msg=encodeURIComponent("Hi PokéDoc! I want to buy: "+name);
window.open("https://wa.me/8615253131891?text="+msg,"_blank");
}

/* DARK MODE */
document.getElementById("darkToggle")
.addEventListener("click",()=>{
document.body.classList.toggle("dark");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("PokéDoc Service Worker Registered"));
}