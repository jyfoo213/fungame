import {useEffect,useState} from 'react';
type Dish='omelette'|'burger'|'icecream';
type Stage='pick'|'cook'|'assemble'|'plate'|'serve'|'done';
const foods={egg:['🥚','Egg'],mushroom:['🍄','Mushroom'],patty:['🥩','Patty'],bun:['🍞','Bun'],cheese:['🧀','Cheese'],cone:['🍦','Cone'],scoop:['🍓','Strawberry']} as const;
const recipes:{[K in Dish]:{name:string,icon:string,price:number,raw:(keyof typeof foods)[],finish:(keyof typeof foods)[]}}={
omelette:{name:'Mushroom Omelette',icon:'🍳',price:5,raw:['egg','mushroom'],finish:[]},
burger:{name:'Cheeseburger',icon:'🍔',price:8,raw:['patty'],finish:['bun','cheese']},
icecream:{name:'Strawberry Ice Cream',icon:'🍨',price:4,raw:['cone','scoop'],finish:[]}};
const sequence:Dish[]=['omelette','burger','icecream'];
const guests=[['🐰','Bunny'],['🐻','Bear'],['🐱','Kitty'],['🐼','Panda']];
export default function App(){
const [round,setRound]=useState(0),[stage,setStage]=useState<Stage>('pick'),[picked,setPicked]=useState<string[]>([]),[time,setTime]=useState(5),[muted,setMuted]=useState(false);
const [coins,setCoins]=useState(()=>{try{return Number(localStorage.getItem('ana-coins'))||0}catch{return 0}});
const dish=recipes[sequence[round%3]],guest=guests[round%guests.length],needed=stage==='assemble'?dish.finish:dish.raw;
const next=needed.find(x=>!picked.includes(x)),ready=needed.every(x=>picked.includes(x));
useEffect(()=>{try{localStorage.setItem('ana-coins',String(coins))}catch{}},[coins]);
useEffect(()=>{if(stage!=='cook')return;if(time===0){setStage(dish.finish.length?'assemble':'plate');setPicked([]);return}const t=setTimeout(()=>setTime(n=>n-1),1000);return()=>clearTimeout(t)},[stage,time,dish.finish.length]);
function beep(){if(muted)return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=700;g.gain.value=.06;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.12);o.onended=()=>{void a.close()}}catch{}}
function select(id:string){if(!['pick','assemble'].includes(stage)||!needed.includes(id as keyof typeof foods)||picked.includes(id))return;setPicked(p=>[...p,id]);beep()}
function advance(){if(!ready)return;beep();if(stage==='assemble'||sequence[round%3]==='icecream')setStage('plate');else{setStage('cook');setTime(5)}}
function reset(){setRound(n=>n+1);setStage('pick');setPicked([]);setTime(5)}
const hint=stage==='pick'||stage==='assemble'?next?'Find the '+foods[next][1]+'! ✨':'All ready!':stage==='cook'?'Sizzle! Watch the timer!':stage==='plate'?'Put the food on the plate!':stage==='serve'?'Serve your customer!':'Great job, Chef Ana!';
return <main className="app"><header><div className="brand"><span>🍓</span><div><h1>Ana Restaurant</h1><small>Little Chef's Happy Kitchen</small></div></div><div className="tools"><strong>🪙 {coins}</strong><button onClick={()=>setMuted(v=>!v)} aria-label="Toggle sound">{muted?'🔇':'🔊'}</button></div></header>
<section className="characters"><div className="person"><div className="bubble">{stage==='done'?'YUMMY! 💖':<>Can I have<br/><b>{dish.icon} {dish.name}</b>?</>}</div><div className="face">{guest[0]}</div><span>{guest[1]}</span></div><div className="order"><small>ORDER #{round+1}</small><div>{dish.icon}</div><b>{dish.name}</b><p>🪙 +{dish.price}</p></div><div className="person"><div className="bubble">Let's cook! 💕</div><div className="face">👩🏻‍🍳</div><span>Chef Ana</span></div></section>
<h2 className="hint">💗 {hint}</h2><section className="game"><div className="panel"><h3>🍳 Cooking Station</h3><div className="stations"><div className={'pan '+(stage==='cook'?'hot':'')} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();select(e.dataTransfer.getData('text/plain'))}}>{stage==='pick'||stage==='assemble'?picked.length?picked.map(id=><span key={id}>{foods[id as keyof typeof foods][0]}</span>):'✨':dish.icon}</div><div className="plate" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(stage==='plate'){setStage('serve');beep()}}}>{stage==='serve'||stage==='done'?dish.icon:'🍽️'}</div></div><div className="actions">{stage==='pick'||stage==='assemble'?<button disabled={!ready} onClick={advance}>{stage==='assemble'||sequence[round%3]==='icecream'?'🍽️ Ready to Plate!':'🔥 Turn On Stove!'}</button>:stage==='cook'?<div className="timer">🔥 Cooking... {time}s <div className="progress" style={{width:(5-time)*20+'%'}}/></div>:stage==='plate'?<button onClick={()=>{setStage('serve');beep()}}>🍽️ Put on Plate!</button>:stage==='serve'?<button onClick={()=>{setStage('done');setCoins(c=>c+dish.price);beep()}}>💝 Serve Customer!</button>:<button onClick={reset}>✨ Next Customer!</button>}</div></div>
<div className="panel"><h3>🧺 Ingredient Shelf</h3><p className="instruction">Click or drag the glowing ingredient!</p><div className="shelf">{Object.entries(foods).map(([id,[icon,name]])=>{const active=(stage==='pick'||stage==='assemble')&&needed.includes(id as keyof typeof foods)&&!picked.includes(id);return <button key={id} draggable={active} onDragStart={e=>e.dataTransfer.setData('text/plain',id)} onClick={()=>select(id)} disabled={!active} className={'ingredient '+(next===id?'glow':'')}><span>{icon}</span><small>{name}</small></button>})}</div></div></section>
{stage==='done'&&<div className="overlay"><div className="win"><div className="stars">✨ ⭐ 💛 ✨</div><div className="celebrate">🎉</div><h2>Yummy! Great job, Chef Ana!</h2><p>{guest[1]} loves your cooking!</p><strong>🪙 +{dish.price} coins!</strong><button onClick={reset}>Next Customer ➜</button></div></div>}
<footer>Made with 💕 for little chefs · No ads · No losing</footer></main>}
