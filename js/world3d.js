/* Korean Hanoi v0.3 — self-contained WebGL 3D renderer, no network dependency. */
(()=>{'use strict';
const $=id=>document.getElementById(id), canvas=$('world3d');if(!canvas)return;
const gl=canvas.getContext('webgl',{antialias:true,alpha:false});if(!gl){$('threeStatus').textContent='WebGL không khả dụng trên thiết bị này. Hãy sử dụng bản đồ 2D.';return;}
const vert=`attribute vec3 p; attribute vec3 n; uniform mat4 mvp; uniform mat4 model; varying vec3 norm; void main(){gl_Position=mvp*vec4(p,1.);norm=mat3(model)*n;}`;
const frag=`precision mediump float; varying vec3 norm; uniform vec3 tint; uniform float daylight; void main(){vec3 sun=normalize(vec3(.55,1.,.45));float l=.32+.68*max(dot(normalize(norm),sun),0.);vec3 c=tint*l*(.35+.65*daylight);gl_FragColor=vec4(c,1.);}`;
function shader(t,s){const h=gl.createShader(t);gl.shaderSource(h,s);gl.compileShader(h);if(!gl.getShaderParameter(h,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(h));return h}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vert));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const loc={p:gl.getAttribLocation(program,'p'),n:gl.getAttribLocation(program,'n'),mvp:gl.getUniformLocation(program,'mvp'),model:gl.getUniformLocation(program,'model'),tint:gl.getUniformLocation(program,'tint'),daylight:gl.getUniformLocation(program,'daylight')};
const vertices=[],normals=[];function face(a,b,c,d,n){for(const v of [a,b,c,a,c,d]){vertices.push(...v);normals.push(...n)}}
const x=-.5,y=-.5,z=-.5,X=.5,Y=.5,Z=.5;
face([x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z],[0,0,1]);face([X,y,z],[x,y,z],[x,Y,z],[X,Y,z],[0,0,-1]);face([X,y,Z],[X,y,z],[X,Y,z],[X,Y,Z],[1,0,0]);face([x,y,z],[x,y,Z],[x,Y,Z],[x,Y,z],[-1,0,0]);face([x,Y,Z],[X,Y,Z],[X,Y,z],[x,Y,z],[0,1,0]);face([x,y,z],[X,y,z],[X,y,Z],[x,y,Z],[0,-1,0]);
function buffer(a,attribute){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(a),gl.STATIC_DRAW);gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,3,gl.FLOAT,false,0,0)}buffer(vertices,loc.p);buffer(normals,loc.n);
const matmul=(a,b)=>{let o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o};
const perspective=(fovy,aspect,near,far)=>{let f=1/Math.tan(fovy/2),o=new Float32Array(16);o[0]=f/aspect;o[5]=f;o[10]=(far+near)/(near-far);o[11]=-1;o[14]=2*far*near/(near-far);return o};
const sub=(a,b)=>a.map((v,i)=>v-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],unit=a=>{let d=Math.hypot(...a)||1;return a.map(v=>v/d)};
function lookAt(eye,target){let f=unit(sub(target,eye)),s=unit(cross(f,[0,1,0])),u=cross(s,f);return new Float32Array([s[0],u[0],-f[0],0,s[1],u[1],-f[1],0,s[2],u[2],-f[2],0,-s.reduce((v,a,i)=>v+a*eye[i],0),-u.reduce((v,a,i)=>v+a*eye[i],0),f.reduce((v,a,i)=>v+a*eye[i],0),1])}
const rgb=h=>{h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)};
let projection,view,day=true,angle=.35,zoom=19,mode='3d',nearNPC=null, lastPos='';
const objects=[];function block(px,py,pz,w,h,d,color){objects.push([px,py,pz,w,h,d,rgb(color)])}
function house(px,pz,color){block(px,1.9,pz,3.6,3.8,3.2,color);block(px,4.0,pz,4.1,.45,3.6,'#ba6353');block(px,1.25,pz+1.65,1.15,2.1,.12,'#527e8a');for(let a of [-1.1,1.1])block(px+a,2.9,pz+1.68,.6,.65,.12,'#b7e2e7')}
block(0,-.15,0,54,.3,54,'#8bc18c');block(0,.02,0,5,.04,54,'#b9aaa0');block(0,.04,-2.5,46,.04,3,'#d5c3ad');for(let z=-24;z<26;z+=4)block(0,.07,z,.15,.02,1.5,'#f6e9c6');
for(const [a,b,c] of [[-9,-9,'#e6bd96'],[-9,5,'#efc7a2'],[9,7,'#e7b5a2'],[-9,15,'#d6c4b6'],[9,16,'#c7c9db'],[-16,-9,'#e9c99b'],[16,10,'#d6a8a3']])house(a,b,c);
const places=[{x:6,z:-1,label:'☕ Cà phê',color:'#f1c8a5'},{x:-7,z:2,label:'🏪 Cửa hàng',color:'#b2d9e5'},{x:8,z:-8,label:'🥖 Bánh mì',color:'#f4d4a0'},
...extraQuests.map(q=>({x:q.x,z:q.z,label:q.name,color:q.color})),
...chapterLocations.map((q,i)=>({x:q.x,z:q.z,label:'💬 '+storyData[i].name,color:'#c4c5eb',story:storyData[i].id,chapter:i}))];
for(const q of places){block(q.x,1.65,q.z,3.6,3.3,3.0,q.color);block(q.x,3.5,q.z,4,.45,3.3,'#476d85');block(q.x,1.1,q.z+1.55,1,1.7,.12,'#5b8292');block(q.x+1.2,1.5,q.z+1.75,.5,1.2,.5,'#498b7d');block(q.x+1.2,2.32,q.z+1.75,.5,.48,.5,'#efc4a4')}
for(let i=0;i<24;i++){let a=(i*7%43)-21,b=(i*11%47)-23;if(Math.abs(a)<4||places.some(p=>Math.hypot(p.x-a,p.z-b)<4))continue;block(a,.7,b,.32,1.4,.32,'#8c7151');block(a,2,b,1.5,1.5,1.5,'#438f67')}
block(-14,.015,-12,8,.03,5,'#6bb9cf');block(-14,.08,-12,3,.12,1.4,'#85cad9');block(0,1.9,-12,2.3,3.8,2.3,'#d9cbb5');block(0,4,-12,3,.5,3,'#b85b4a');
const names=$('npcList'), npcStatus=$('npcStatus');let selectedStory='';
function npcList(){names.replaceChildren();for(let i=0;i<storyData.length;i++){const st=storyData[i],p=chapterLocations[i];const b=document.createElement('button');b.textContent=(storyDone[st.id]?'✓ ':'')+st.name;b.onclick=()=>{selectedStory=st.id;$('npcStatus').textContent='Đã chọn '+st.name+' · Đi tới điểm đánh dấu hoặc bấm “Đến gặp NPC”.';npcList()};if(selectedStory===st.id)b.classList.add('chosen');names.append(b)}}
function goStory(){const i=storyData.findIndex(x=>x.id===selectedStory);if(i<0)return;npcStatus.textContent='Đang mở hội thoại với NPC tại '+chapterLocations[i].place;pos.x=chapterLocations[i].x;pos.z=chapterLocations[i].z;save(POS,pos);storyStart(selectedStory)}
$('npcGo').onclick=goStory;
$('npcTalk').onclick=()=>{if(!nearNPC){npcStatus.textContent='Hãy đến gần NPC (trong 4 đơn vị) hoặc chọn “Đến gặp NPC”.';return}selectedStory=nearNPC.story;storyStart(selectedStory)};
$('viewToggle').onclick=()=>{mode=mode==='3d'?'2d':'3d';canvas.classList.toggle('hidden',mode!=='3d');$('world').classList.toggle('hidden',mode==='3d');$('viewToggle').textContent=mode==='3d'?'Chuyển sang Canvas 2D':'Chuyển sang thế giới 3D';$('threeStatus').textContent=mode==='3d'?'Đồ họa WebGL 3D đang bật':'Đang xem Canvas 2D cũ';};
$('dayToggle').onclick=()=>{day=!day;$('dayToggle').textContent=day?'🌙 Chuyển ban đêm':'☀️ Chuyển ban ngày'};
$('cameraReset').onclick=()=>{angle=.35;zoom=19};
let dragging=false,startX=0;canvas.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(dragging){angle+=(e.clientX-startX)*.008;startX=e.clientX}});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(9,Math.min(34,zoom+Math.sign(e.deltaY)*2))},{passive:false});
function drawBlock(o,pv){const [x,y,z,w,h,d,c]=o;const model=new Float32Array([w,0,0,0,0,h,0,0,0,0,d,0,x,y,z,1]);gl.uniformMatrix4fv(loc.model,false,model);gl.uniformMatrix4fv(loc.mvp,false,matmul(pv,model));gl.uniform3fv(loc.tint,c);gl.drawArrays(gl.TRIANGLES,0,36)}
function render(){requestAnimationFrame(render);if(mode!=='3d'||!valid(profile)||$('play').classList.contains('hidden'))return;let w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const ratio=Math.min(devicePixelRatio||1,2),ww=Math.round(w*ratio),hh=Math.round(h*ratio);if(canvas.width!==ww||canvas.height!==hh){canvas.width=ww;canvas.height=hh}gl.viewport(0,0,ww,hh);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.clearColor(...(day?[.54,.77,.89]:[.06,.11,.22]),1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(loc.daylight,day?1:.52);
const eye=[pos.x+Math.sin(angle)*zoom,zoom*.7,pos.z+Math.cos(angle)*zoom],target=[pos.x,1.5,pos.z],pv=matmul(perspective(Math.PI/3,ww/hh,.1,130),lookAt(eye,target));for(const o of objects)drawBlock(o,pv);
// Player avatar, with legs, body, head and hair.
const a=pos.x,z=pos.z;for(const o of [[a,.55,z, .85,1.1,.55,rgb('#f2a65b')],[a-.23,.35,z,.3,.7,.4,rgb('#345d88')],[a+.23,.35,z,.3,.7,.4,rgb('#345d88')],[a,1.38,z,.66,.65,.65,rgb('#efc4a4')],[a,1.72,z-.07,.7,.22,.68,rgb('#503b35')]])drawBlock(o,pv);
nearNPC=null;let best=4.2;for(let i=0;i<chapterLocations.length;i++){let p=chapterLocations[i],dist=Math.hypot(pos.x-p.x,pos.z-p.z);if(dist<best){best=dist;nearNPC={...p,story:storyData[i].id}}}
$('npcTalk').disabled=!nearNPC;$('npcNearby').textContent=nearNPC?'NPC gần bạn: '+storyData.find(s=>s.id===nearNPC.story).name:'Đi gần biểu tượng NPC trên bản đồ để trò chuyện';
const xy=pos.x.toFixed(1)+','+pos.z.toFixed(1);if(xy!==lastPos){lastPos=xy;$('threeCoords').textContent='Vị trí: '+xy}
}
selectedStory=storyData[0].id;npcList();const oldStoryRender=storyRenderGrid;storyRenderGrid=function(){oldStoryRender();npcList()};$('world').classList.add('hidden');$('threeStatus').textContent='WebGL 3D · Kéo chuột để xoay camera · Lăn chuột để phóng to/thu nhỏ';render();
})();
