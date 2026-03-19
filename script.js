let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
let stats = JSON.parse(localStorage.getItem("stats")) || {easy:[],medium:[],hard:[],extreme:[]};

let currentAnswer, questions=[], index=0, startTime=0;
let attempts=0, snoozed=false;

// CLOCK
setInterval(()=>{
  let now=new Date();
  document.getElementById("clock").innerText=now.toLocaleTimeString();
},1000);

// SAVE
function save(){
  localStorage.setItem("alarms", JSON.stringify(alarms));
  localStorage.setItem("stats", JSON.stringify(stats));
}

// ADD
function addAlarm(){
  let time=document.getElementById("alarmTime").value;
  let diff=document.getElementById("difficulty").value;
  alarms.push({time,diff,done:false});
  save();
  render();
}

// CLEAR
function clearAlarms(){
  alarms=[];
  save();
  render();
}

// RENDER
function render(){
  let list=document.getElementById("alarmList");
  list.innerHTML="";
  alarms.forEach((a,i)=>{
    list.innerHTML+=`<div class="alarm-item">
      ${a.time} (${a.diff})
      <button onclick="remove(${i})">X</button>
    </div>`;
  });
}
render();

// DELETE
function remove(i){
  alarms.splice(i,1);
  save();
  render();
}

// CHECK TIME
setInterval(()=>{
  let now=new Date();
  let t=now.toTimeString().slice(0,5);

  alarms.forEach(a=>{
    if(a.time===t && !a.done){
      a.done=true;
      startAlarm(a.diff);
    }
  });
},1000);

// QUESTIONS
const bank={
  easy:[{q:"2+2?",a:"4",c:["3","4","5","6"]}],
  medium:[{q:"5x2?",a:"10",c:["8","10","12","14"]}],
  hard:[{q:"12+30?",a:"42",c:["42","40","44","50"]}],
  extreme:[{q:"25x4?",a:"100",c:["90","100","110","120"]}]
};

// START
function startAlarm(diff){
  document.getElementById("alarmScreen").style.display="flex";

  let v=document.getElementById("alarmVideo");
  let s=document.getElementById("alarmSound");
  v.play(); s.play();

  questions=[...bank[diff]];
  index=0;
  attempts=0;
  startTime=Date.now();
  snoozed=false;

  showQ();
}

// SHOW Q
function showQ(){
  let q=questions[index];
  currentAnswer=q.a;

  document.getElementById("question").innerText=q.q;

  let c=document.getElementById("choices");
  c.innerHTML="";
  q.c.forEach((ch,i)=>{
    let b=document.createElement("button");
    b.innerText=ch;
    b.onclick=()=>check(ch);
    c.appendChild(b);
  });
}

// CHECK
function check(ans){
  attempts++;
  if(ans==currentAnswer){
    stopAlarm();
  } else alert("Wrong!");
}

// KEYBOARD SUPPORT
document.addEventListener("keydown",(e)=>{
  let btns=document.querySelectorAll("#choices button");
  if(e.key>=1 && e.key<=4){
    btns[e.key-1]?.click();
  }
});

// SNOOZE
function snooze(){
  if(snoozed) return alert("No more snooze!");
  snoozed=true;

  let v=document.getElementById("alarmVideo");
  let s=document.getElementById("alarmSound");
  v.pause(); s.pause();

  setTimeout(()=>{
    v.play(); s.play();
  },10000);
}

// STOP
function stopAlarm(){
  let v=document.getElementById("alarmVideo");
  let s=document.getElementById("alarmSound");

  v.pause(); s.pause();

  let time=((Date.now()-startTime)/1000).toFixed(2);

  document.getElementById("alarmScreen").style.display="none";

  alert(`Done!\nTime: ${time}s\nAttempts: ${attempts}`);
}
