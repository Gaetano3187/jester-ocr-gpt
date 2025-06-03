diff --git a//dev/null b/main.js
index 0000000000000000000000000000000000000000..79f70cba358c3390ae10bdd9562cee963ef8d967 100644
--- a//dev/null
+++ b/main.js
@@ -0,0 +1,165 @@
+const storageKeys = {
+  super: 'jester_utente_supermercato',
+  online: 'jester_utente_online',
+  acqSuper: 'jester_utente_acquisti_supermercato',
+  acqOnline: 'jester_utente_acquisti_online',
+  fav: 'jester_utente_preferiti'
+};
+
+function loadList(key) {
+  return JSON.parse(localStorage.getItem(key) || '[]');
+}
+function saveList(key, arr) {
+  localStorage.setItem(key, JSON.stringify(arr));
+}
+
+function render() {
+  ['super','online'].forEach(tipo => {
+    const listEl = document.getElementById(tipo === 'super' ? 'listSuper' : 'listOnline');
+    listEl.innerHTML = '';
+    const items = loadList(storageKeys[tipo]);
+    const done = loadList(tipo === 'super' ? storageKeys.acqSuper : storageKeys.acqOnline);
+    items.forEach((item)=>{
+      const li = document.createElement('li');
+      li.className = done.includes(item) ? 'completed' : '';
+      const span = document.createElement('span');
+      span.textContent = item;
+      const check = document.createElement('input');
+      check.type = 'checkbox';
+      check.checked = done.includes(item);
+      check.onchange = () => toggleDone(tipo,item);
+      const remove = document.createElement('button');
+      remove.textContent='❌';
+      remove.onclick=()=>removeItem(tipo,item);
+      li.append(check,span,remove);
+      listEl.appendChild(li);
+    });
+    const prog = document.getElementById(tipo==='super'?'progSuper':'progOnline');
+    const val = items.length? (100*done.length/items.length):0;
+    prog.value = val;
+  });
+
+  const favEl = document.getElementById('listFav');
+  favEl.innerHTML='';
+  loadList(storageKeys.fav).forEach(item=>{
+    const li=document.createElement('li');
+    const span=document.createElement('span');
+    span.textContent=item;
+    const addBtn=document.createElement('button');
+    addBtn.textContent='➕';
+    addBtn.onclick=()=>{
+      document.getElementById('inputSuper').value=item;
+    };
+    li.append(span,addBtn);
+    favEl.appendChild(li);
+  });
+}
+
+function addItem(tipo){
+  const input=document.getElementById(tipo==='super'?'inputSuper':'inputOnline');
+  const val=input.value.trim();
+  if(!val) return;
+  const list=loadList(storageKeys[tipo]);
+  list.push(val);
+  saveList(storageKeys[tipo],list);
+  input.value='';
+  render();
+}
+function removeItem(tipo,item){
+  let list=loadList(storageKeys[tipo]);
+  list=list.filter(i=>i!==item);
+  saveList(storageKeys[tipo],list);
+  let done=loadList(tipo==='super'?storageKeys.acqSuper:storageKeys.acqOnline);
+  done=done.filter(i=>i!==item);
+  saveList(tipo==='super'?storageKeys.acqSuper:storageKeys.acqOnline,done);
+  render();
+}
+function toggleDone(tipo,item){
+  let done=loadList(tipo==='super'?storageKeys.acqSuper:storageKeys.acqOnline);
+  if(done.includes(item)){
+    done=done.filter(i=>i!==item);
+  }else{
+    done.push(item);
+  }
+  saveList(tipo==='super'?storageKeys.acqSuper:storageKeys.acqOnline,done);
+  render();
+}
+function exportList(tipo){
+  const items=loadList(storageKeys[tipo]);
+  const text=items.join('\n');
+  const blob=new Blob([text],{type:'text/plain'});
+  const url=URL.createObjectURL(blob);
+  const a=document.createElement('a');
+  a.href=url;
+  a.download=`${tipo}.txt`;
+  a.click();
+  URL.revokeObjectURL(url);
+}
+function addFav(){
+  const input=document.getElementById('inputFav');
+  const val=input.value.trim();
+  if(!val) return;
+  const fav=loadList(storageKeys.fav);
+  fav.push(val);
+  saveList(storageKeys.fav,fav);
+  input.value='';
+  render();
+}
+
+async function handlePhoto(e){
+  const file=e.target.files[0];
+  if(!file) return;
+  const reader=new FileReader();
+  reader.onload=async ev=>{
+    const base64=ev.target.result;
+    document.getElementById('ocrOutput').textContent='🧠 Analisi in corso...';
+    try{
+      const res=await fetch('/api/ocr-gpt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({base64Image:base64})});
+      if(!res.ok) throw new Error(await res.text());
+      const data=await res.json();
+      const content=data.choices?.[0]?.message?.content||'';
+      document.getElementById('ocrOutput').textContent=content;
+      localStorage.setItem('jester_ocr_confirmed',content);
+    }catch(err){
+      document.getElementById('ocrOutput').textContent='Errore: '+err.message;
+    }
+  };
+  reader.readAsDataURL(file);
+}
+
+let recognition;
+function startVoice(){
+  if(!('webkitSpeechRecognition'in window||'SpeechRecognition'in window)){
+    alert('API Speech non supportata');
+    return;
+  }
+  recognition = new (window.SpeechRecognition||window.webkitSpeechRecognition)();
+  recognition.lang='it-IT';
+  recognition.onresult=async e=>{
+    let text=e.results[0][0].transcript.toLowerCase();
+    if(text.startsWith('ciao jester')) text=text.replace('ciao jester','').trim();
+    if(!text) return;
+    try{
+      const res=await fetch('/api/chat-gpt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
+      if(!res.ok) throw new Error(await res.text());
+      const data=await res.json();
+      const cmdStr=data.choices?.[0]?.message?.content||'';
+      const cmd=JSON.parse(cmdStr);
+      if(cmd.azione==='aggiungi'){
+        const input=cmd.lista==='online'?document.getElementById('inputOnline'):document.getElementById('inputSuper');
+        input.value=cmd.prodotto;
+        addItem(cmd.lista==='online'?'online':'super');
+      }
+      if(cmd.azione==='rimuovi') removeItem(cmd.lista==='online'?'online':'super',cmd.prodotto);
+      if(cmd.azione==='completa') toggleDone(cmd.lista==='online'?'online':'super',cmd.prodotto);
+    }catch(err){
+      console.error(err);
+    }
+  };
+  recognition.start();
+}
+
+render();
+if('serviceWorker'in navigator){
+  navigator.serviceWorker.register('/serviceWorker.js');
+}
